import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      enum: [
        "#EF4444", "#3B82F6", "#10B981", "#F59E0B", "#F97316",
        "#8B5CF6", "#EC4899", "#14B8A6", "#6B7280", "#000000", "#FFFFFF"
      ],
      default: "#6B7280",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

categorySchema.index({ name: 1, user: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);
export default Category;