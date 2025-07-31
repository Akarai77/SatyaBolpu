import express from 'express';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './utils/db.js';
dotenv.config()
const PORT = process.env.PORT

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

connectDB()

app.get('/api', (req, res) => res.send('Hello World!'));
app.use('/api/auth',authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
