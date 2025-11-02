"use client";
import React, { useEffect, useState } from "react";
import { Trash2, Edit2, Check, X } from "lucide-react";
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase.config";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Fetch todos from Firestore
  const fetchTodos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "todos"));
      const todoList = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setTodos(todoList);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [todos]); // Run once on mount

  // Add new todo
  const addTodo = async () => {
    if (inputValue.trim() === "") return;
    const newTodo = { text: inputValue, completed: false, createdAt: new Date() };

    try {
      await addDoc(collection(db, "todos"), newTodo);
      setInputValue("");
      fetchTodos(); // Refresh list
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, "todos", id));
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Toggle complete (local only for now)
  const toggleComplete = async (id) => {
    // setTodos((prev) =>
    //   prev.map((t) =>
    //     t.id === id ? { ...t, completed: !t.completed } : t
    //   )
    // );

    await updateDoc(doc(db, "todos", id), { completed: true });
  };

  // Start editing
  const startEdit = (id, text) => {
    setEditingId(id);
    setEditValue(text);
  };

  // Save edited todo (local only — can be extended to Firestore)
  const saveEdit = async (id) => {
    if (editValue.trim() === "") return;
    // setTodos((prev) =>
    //   prev.map((t) => (t.id === id ? { ...t, text: editValue } : t))
    // );
    
    await updateDoc(doc(db, "todos", id), { text: editValue });
    setEditingId(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") addTodo();
  };

  const handleEditKeyPress = (e, id) => {
    if (e.key === "Enter") saveEdit(id);
    if (e.key === "Escape") cancelEdit();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gray-800">
      <div className="w-full max-w-4xl p-6 bg-gray-600 rounded-lg shadow-xl text-white">
        <h1 className="mb-6 text-3xl font-bold text-center">ToDo List</h1>

        {/* Add Todo Section */}
        <div className="grid grid-cols-12 gap-3 mb-6">
          <div className="col-span-9">
            <input
              type="text"
              placeholder="Add your new todo"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-3 rounded text-white bg-gray-700 border border-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="col-span-3">
            <button
              onClick={addTodo}
              className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors"
            >
              Add Todo
            </button>
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No todos yet. Add one above!</p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`flex items-center gap-3 p-4 rounded-lg border ${
                  todo.completed ? "bg-gray-700 border-gray-600" : "bg-gray-700 border-gray-500"
                }`}
              >
                <button
                  onClick={() => toggleComplete(todo.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                    todo.completed
                      ? "bg-green-600 border-green-600"
                      : "border-gray-400 hover:border-green-500"
                  }`}
                >
                  {todo.completed && <Check size={16} />}
                </button>

                {editingId === todo.id ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => handleEditKeyPress(e, todo.id)}
                    className="flex-1 p-2 rounded text-white bg-gray-600 border border-blue-500 focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <span
                    className={`flex-1 ${
                      todo.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {todo.text}
                  </span>
                )}

                <div className="flex gap-2">
                  {editingId === todo.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(todo.id)}
                        className="p-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
                        title="Save"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 bg-gray-500 hover:bg-gray-600 rounded transition-colors"
                        title="Cancel"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(todo.id, todo.text)}
                        className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        {todos.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-500 text-center text-gray-300">
            <p>
              Total: {todos.length} | Completed:{" "}
              {todos.filter((t) => t.completed).length} | Pending:{" "}
              {todos.filter((t) => !t.completed).length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
