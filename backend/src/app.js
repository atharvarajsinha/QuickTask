import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import tasksRoutes from './routes/taskRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/tasks', tasksRoutes);
app.use('/category', categoryRoutes);
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Node server alive...' });
});

export default app;