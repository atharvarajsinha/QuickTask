from django.shortcuts import render
from django.http import JsonResponse
from .db import tasks_collection, users_collection
from bson import ObjectId
from .auth import jwt_required
from rest_framework.decorators import api_view
from datetime import datetime, timedelta

def health_check(request):
    return JsonResponse({"status": "Python microservice alive..."})

ALL_PRIORITIES = ["Low", "Medium", "High"]
ALL_STATUSES = ["Todo", "In Progress", "Completed"]

@api_view(['GET'])
@jwt_required
def user_task_statistics(request):
    try:
        user_id = ObjectId(request.user_id)

        start_date_str = request.GET.get("start_date")
        start_date = (
            datetime.strptime(start_date_str, "%Y-%m-%d")
            if start_date_str else datetime.now()
        )

        end_date_str = request.GET.get("end_date")
        end_date = (
            datetime.strptime(end_date_str, "%Y-%m-%d") + timedelta(days=1)
            if end_date_str else datetime.now() + timedelta(days=1)
        )

        total_tasks = tasks_collection.count_documents({'user': user_id})
        completed_tasks = tasks_collection.count_documents({'user': user_id, 'status': 'Completed'})
        pending_tasks = tasks_collection.count_documents({'user': user_id, 'status': {'$in': ['In Progress', 'Todo']}})
        due_tasks = tasks_collection.count_documents({'user': user_id, 'dueDate': {'$gte': start_date, '$lt': end_date}, 'status': {'$ne': 'Completed'}})
        overdue_tasks = tasks_collection.count_documents({'user': user_id, 'dueDate': {'$lt': datetime.now()}, 'status': {'$ne': 'Completed'}})

        completion_rate = round((completed_tasks / total_tasks) * 100,2) if total_tasks > 0 else 0

        task_status_pipeline = [
            {"$match": {"user": user_id}},
            {
                "$group": {
                    "_id": "$status",
                    "count": {"$sum": 1}
                }
            }
        ]
        task_status_data = list(tasks_collection.aggregate(task_status_pipeline))
        task_status_distribution = {s: 0 for s in ALL_STATUSES}
        for item in task_status_data:
            task_status_distribution[item["_id"]] = item["count"]

        priority_pipeline = [
            {"$match": {"user": user_id}},
            {
                "$group": {
                    "_id": "$priority",
                    "count": {"$sum": 1}
                }
            }
        ]
        priority_data = list(tasks_collection.aggregate(priority_pipeline))
        priority_distribution = {p: 0 for p in ALL_PRIORITIES}
        for item in priority_data:
            priority_distribution[item["_id"]] = item["count"]

        analytics_data = {
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
            'pending_tasks': pending_tasks,
            'due_tasks': due_tasks,
            'overdue_tasks': overdue_tasks,
            'completion_rate': completion_rate,
            'task_status_distribution': task_status_distribution,
            'priority_distribution': priority_distribution
        }
        return JsonResponse(analytics_data, status=200)
    except Exception as e:
        return JsonResponse(f"An error occurred: {str(e)}", status=500)
    

@api_view(['GET'])
@jwt_required
def productivity_analytics(request):
    try:
        user_id = ObjectId(request.user_id)
        days = int(request.GET.get("days", 7))
        start_date = datetime.now() - timedelta(days=days)

        pipeline = [
            {
                "$match": {
                    "user": user_id,
                    "status": "Completed",
                    "updatedAt": {"$gte": start_date}
                }
            },
            {
                "$group": {
                    "_id": {
                        "$dateToString": {
                            "format": "%Y-%m-%d",
                            "date": "$updatedAt"
                        }
                    },
                    "count": {"$sum": 1}
                }
            },
            {"$sort": {"_id": 1}}
        ]
        results = list(tasks_collection.aggregate(pipeline))

        return JsonResponse({
            "days": days,
            "data": results
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    

@api_view(['GET'])
def public_stats(request):
    try:
        total_users = users_collection.count_documents({})
        total_tasks = tasks_collection.count_documents({})

        completed_tasks = tasks_collection.count_documents({'status': 'Completed'})

        active_users = len(tasks_collection.distinct('user'))

        completion_rate = (round((completed_tasks / total_tasks) * 100, 2) if total_tasks > 0 else 0)

        stats = {
            'total_users': total_users,
            'total_tasks': total_tasks,
            'tasks_completed': completed_tasks,
            'completion_rate': completion_rate,
            'active_users': active_users
        }
        return JsonResponse(stats, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)