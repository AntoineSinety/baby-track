import React, { useState, useEffect } from 'react';
import { useBaby } from '../context/BabyContext';
import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import './TodoList.css';

const TodoList = () => {
  const { activeBaby } = useBaby();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (!activeBaby) return;

    const todosRef = collection(db, 'babies', activeBaby.id, 'todos');
    const q = query(todosRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTodos(todosData);
    });

    return () => unsubscribe();
  }, [activeBaby]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim() || !activeBaby) return;

    try {
      const todosRef = collection(db, 'babies', activeBaby.id, 'todos');
      await addDoc(todosRef, {
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      });
      setNewTodo('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
    }
  };

  const handleToggle = async (todo) => {
    try {
      const todoRef = doc(db, 'babies', activeBaby.id, 'todos', todo.id);
      await updateDoc(todoRef, {
        completed: !todo.completed
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleDelete = async (todoId) => {
    try {
      const todoRef = doc(db, 'babies', activeBaby.id, 'todos', todoId);
      await deleteDoc(todoRef);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleStartEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleSaveEdit = async (todoId) => {
    if (!editText.trim()) return;

    try {
      const todoRef = doc(db, 'babies', activeBaby.id, 'todos', todoId);
      await updateDoc(todoRef, {
        text: editText.trim()
      });
      setEditingId(null);
      setEditText('');
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="todolist">
      <div className="todolist-header">
        <h2>📝 To-Do List</h2>
        <p className="todolist-subtitle">
          Questions, tâches, mémos... tout ce qui vous passe par la tête
        </p>
        {totalCount > 0 && (
          <div className="todolist-progress">
            <div className="progress-text">
              {completedCount} / {totalCount} complétées
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <form className="todolist-add-form" onSubmit={handleAddTodo}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Ajouter une tâche, question, mémo..."
          className="todolist-input"
        />
        <button type="submit" className="todolist-add-button">
          ➕ Ajouter
        </button>
      </form>

      {todos.length === 0 ? (
        <div className="todolist-empty">
          <div className="empty-icon">📋</div>
          <p>Aucune tâche pour le moment</p>
          <small>Ajoutez vos questions, idées ou choses à ne pas oublier</small>
        </div>
      ) : (
        <div className="todolist-items">
          {todos.map(todo => (
            <div key={todo.id} className={`todolist-item ${todo.completed ? 'completed' : ''}`}>
              {editingId === todo.id ? (
                <div className="todolist-edit-mode">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="todolist-edit-input"
                    autoFocus
                  />
                  <div className="todolist-edit-actions">
                    <button
                      onClick={() => handleSaveEdit(todo.id)}
                      className="todolist-save-button"
                    >
                      ✓ Sauvegarder
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="todolist-cancel-button"
                    >
                      ✕ Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="todolist-item-content">
                    <button
                      className="todolist-checkbox"
                      onClick={() => handleToggle(todo)}
                    >
                      {todo.completed ? '✓' : ''}
                    </button>
                    <span className="todolist-text">{todo.text}</span>
                  </div>
                  <div className="todolist-item-actions">
                    <button
                      onClick={() => handleStartEdit(todo)}
                      className="todolist-edit-button"
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="todolist-delete-button"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;
