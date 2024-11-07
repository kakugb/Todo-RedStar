import express from 'express';
import { RegisterUser,loginUser } from '../controllers/user.controller.js'; 
import { createTodo, getTodos, updateTodo, deleteTodo,toggleTodoCompletion } from '../controllers/todo.controller.js';
import { protect } from '../middlewares/auth.js';
const router = express.Router();

router.post('/register', RegisterUser);
router.post('/login', loginUser);



            //  Todo


router.post('/', protect, createTodo); 
router.get('/', protect, getTodos); ; 
router.put('/:todoId', protect, updateTodo); 
router.delete('/:todoId', protect, deleteTodo); 
router.patch('/:todoId/completion', protect, toggleTodoCompletion); 
export default router;  
