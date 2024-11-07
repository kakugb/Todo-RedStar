import express from 'express';
import userRoutes from './routes/todo.route.js'; 
import connectDB from './db/connect.js';
import todoRoutes from './routes/todo.route.js'; 
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true, 
}));
app.use(express.json());
app.use(bodyParser.json());

connectDB();

app.use('/api/users', userRoutes);
app.use('/api/todos', todoRoutes);
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
