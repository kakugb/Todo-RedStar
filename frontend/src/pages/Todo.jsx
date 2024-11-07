import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // if you are using React Router

function Todo() {
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null); 
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // if you are using React Router

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/todos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setTodos(response?.data);
    } catch (error) {
      setError("Error fetching todos");
    }
  };

  const createTodo = async (e) => {
    e.preventDefault();

    if (!title) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/todos",
        { title },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setTodos([...todos, response.data]);
      setTitle("");
    } catch (error) {
      setError("Error creating todo");
    }
  };

  const toggleCompletion = async (todoId, currentStatus) => {
    const status = currentStatus === "true" || currentStatus === true;

    try {
      const updatedTodo = await axios.put(
        `http://localhost:8000/api/todos/${todoId}`,
        { completed: !status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setTodos(
        todos.map((todo) =>
          todo._id === todoId
            ? { ...todo, completed: updatedTodo.data.completed }
            : todo
        )
      );
    } catch (error) {
      setError("Error toggling completion");
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await axios.delete(`http://localhost:8000/api/todos/${todoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setTodos(todos.filter((todo) => todo._id !== todoId));
    } catch (error) {
      setError("Error deleting todo");
    }
  };

  const startEditing = (todoId, currentTitle) => {
    setEditingTodoId(todoId);
    setTitle(currentTitle);
  };

  const handleEdit = async (todoId) => {
    try {
      const updatedTodo = await axios.put(
        `http://localhost:8000/api/todos/${todoId}`,
        { title },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setTodos(
        todos.map((todo) =>
          todo._id === todoId
            ? { ...todo, title: updatedTodo.data.title }
            : todo
        )
      );
      setEditingTodoId(null);
      setTitle("");
    } catch (error) {
      setError("Error editing todo");
    }
  };

  const handleLogout = () => {
   
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <>
    
     <div className="w-full">
     <button
        onClick={handleLogout}
        className="flex mx-auto mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 "
      >
        Log out
      </button>
     </div>

      <div className="max-w-md mx-auto py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white bg-sky-600 p-2 rounded-lg">
            To-Do App
          </h1>
        </header>

        <div className="bg-gray-300 rounded-lg shadow-md p-6 mb-4">
          <form>
            <div className="flex items-center mb-4">
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder={editingTodoId ? "Edit your task" : "Add a new task"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <button
                type="button"
                onClick={
                  editingTodoId ? () => handleEdit(editingTodoId) : createTodo
                }
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {editingTodoId ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <ul className="divide-y divide-gray-200">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className={`max-w-md py-3 flex items-center justify-between bg-blue-300 px-3 rounded-md mb-2 text-xl font-semibold ${
                todo.completed ? "line-through" : ""
              }`}
            >
              <input
                id="first"
                checked={todo.completed}
                onChange={() => toggleCompletion(todo._id, todo.completed)}
                type="checkbox"
                className="w-4 h-4 text-blue-800 focus:ring-red-500 focus:ring-2"
              />
              <div className="flex items-center">
                {editingTodoId === todo._id ? (
                  <span>{todo.title}</span>
                ) : (
                  <span>{todo.title}</span>
                )}
              </div>

              <div>
                <button
                  onClick={() => startEditing(todo._id, todo.title)}
                  className="ml-4 text-white hover:text-green-600 hover:font-bold py-1 px-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="max-w-max text-white hover:text-red-600 hover:font-bold py-1 px-3"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Todo;
