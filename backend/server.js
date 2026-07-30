import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoutes.js';
import incomeRouter from './routes/incomeRoute.js';
import expenseRouter from './routes/expenseRoutes.js';
import dashboardRouter from './routes/dashboardRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  'https://expenseflow-plus.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//DB
connectDB();

// ROUTES
app.use('/api/user', userRouter);
app.use('/api/income', incomeRouter);
app.use('/api/expense', expenseRouter);
app.use('/api/dashboard', dashboardRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
