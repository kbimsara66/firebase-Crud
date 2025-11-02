"use client"
import React, { useState } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';

export default function Home() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Sample todo - Click edit to modify', completed: false },
    { id: 2, text: 'Click the checkmark to mark as complete', completed: false },
    { id: 3, text: 'This one is completed', completed: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim() === '') return;
    
    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false
    };
    
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditValue(text);
  };

  const saveEdit = (id) => {
    if (editValue.trim() === '') return;
    
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editValue } : todo
    ));
    setEditingId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const handleEditKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      saveEdit(id);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-8 bg-gray-800'>
      <div className='w-full max-w-4xl p-6 bg-gray-600 rounded-lg shadow-xl text-white'>
        <h1 className='mb-6 text-3xl font-bold text-center'>ToDo List</h1>
        
        {/* Add Todo Section */}
        <div className='grid grid-cols-12 gap-3 mb-6'>
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
            todos.map(todo => (
              <div
                key={todo.id}
                className={`flex items-center gap-3 p-4 rounded-lg border ${
                  todo.completed
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-gray-700 border-gray-500'
                }`}
              >
                {/* Complete Button */}
                <button
                  onClick={() => toggleComplete(todo.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                    todo.completed
                      ? 'bg-green-600 border-green-600'
                      : 'border-gray-400 hover:border-green-500'
                  }`}
                >
                  {todo.completed && <Check size={16} />}
                </button>

                {/* Todo Text or Edit Input */}
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
                      todo.completed ? 'line-through text-gray-400' : ''
                    }`}
                  >
                    {todo.text}
                  </span>
                )}

                {/* Action Buttons */}
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
              Total: {todos.length} | Completed: {todos.filter(t => t.completed).length} | 
              Pending: {todos.filter(t => !t.completed).length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}