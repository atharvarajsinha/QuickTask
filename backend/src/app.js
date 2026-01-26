import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import tasksRoutes from './routes/taskRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/tasks', tasksRoutes);
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Node server alive...' });
});
app.get('/', (req, res) => {
  res.send('Welcome to the Task Management API');
});

export default app;