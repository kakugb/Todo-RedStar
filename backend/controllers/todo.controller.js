import Todo from '../models/todo.model.js';
import User from '../models/user.model.js'; 


export const createTodo = async (req, res) => {
  try {
    const { title } = req.body; 

    const userId = req.user.id; 
    console.log(userId);
    const newTodo = new Todo({
      title,  
      user: userId, 
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getTodos = async (req, res) => {
  try {
    const userId = req.user.id;
    const todos = await Todo.find({ user: userId });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    const userId = req.user.id;
    const { title, completed, dueDate, priority } = req.body;

    const todo = await Todo.findOne({ _id: todoId, user: userId });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found or unauthorized' });
    }

    todo.title = title || todo.title;
    todo.completed = completed !== undefined ? completed : todo.completed;
    todo.dueDate = dueDate || todo.dueDate;
    todo.priority = priority || todo.priority;

    await todo.save();
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



export const deleteTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    const userId = req.user.id;

    const todo = await Todo.findOneAndDelete({ _id: todoId, user: userId });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found or unauthorized' });
    }

    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const toggleTodoCompletion = async (req, res) => {
  try {
    const { todoId } = req.params;
    const userId = req.user.id;

    const todo = await Todo.findOne({ _id: todoId, user: userId });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found or unauthorized' });
    }

   
    todo.completed = !todo.completed;

    await todo.save();
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
