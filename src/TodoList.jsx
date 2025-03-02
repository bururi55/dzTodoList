import React, { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import './TodoList.css';
import { db } from './firebase';
import { addTodo } from './CRUD/Create';
import { fetchTodos } from './CRUD/Read';
import { updateTodo } from './CRUD/Update';
import { deleteTodo } from './CRUD/Delete';

const TodoList = () => {
	const [todos, setTodos] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [sorted, setSorted] = useState(false);
	const [newTodo, setNewTodo] = useState('');
	const [editingTodo, setEditingTodo] = useState(null);

	useEffect(() => {
		fetchTodos(setTodos, setIsLoading);
	}, []);

	const handleAddTodo = () => {
		if (newTodo.trim()) {
			addTodo({ title: newTodo });
			setNewTodo('');
		}
	};

	const handleUpdateTodo = (id, updatedTitle) => {
		updateTodo(id, { title: updatedTitle });
	};

	const handleDeleteTodo = (id) => {
		deleteTodo(id);
		setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
	};

	const handleSearch = (event) => {
		setSearchQuery(event.target.value);
	};

	const handleSaveTodo = (id) => {
		const updatedTitle = todos.find((todo) => todo.id === id).title;
		handleUpdateTodo(id, updatedTitle);
		setEditingTodo(null);
		setTodos((prevTodos) =>
			prevTodos.map((todo) =>
				todo.id === id ? { ...todo, title: updatedTitle } : todo,
			),
		);
	};

	const filteredTodos = todos.filter((todo) =>
		todo.title.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const sortedTodos = sorted
		? [...filteredTodos].sort((a, b) => a.title.localeCompare(b.title))
		: filteredTodos;

	return (
		<div className="todo-list">
			<h1>Список дел</h1>
			<div className="controls">
				<input
					type="text"
					placeholder="Поиск..."
					value={searchQuery}
					onChange={handleSearch}
					className="search-input"
				/>
				<button className="sort-button" onClick={() => setSorted(!sorted)}>
					Сортировать по алфавиту
				</button>
			</div>
			<div className="new-todo">
				<input
					type="text"
					placeholder="Новое дело"
					value={newTodo}
					onChange={(e) => setNewTodo(e.target.value)}
					className="new-todo-input"
				/>
				<button className="add-button" onClick={handleAddTodo}>
					Добавить дело
				</button>
			</div>
			{isLoading ? (
				<div>Загрузка...</div>
			) : (
				<ul>
					{sortedTodos.map((todo) => (
						<li key={todo.id} className="todo-item">
							<div>
								{editingTodo === todo.id ? (
									<input
										type="text"
										value={todo.title}
										onChange={(e) =>
											setTodos((prevTodos) =>
												prevTodos.map((t) =>
													t.id === todo.id
														? { ...t, title: e.target.value }
														: t,
												),
											)
										}
										className="edit-todo-input"
									/>
								) : (
									todo.title
								)}
							</div>
							{editingTodo === todo.id ? (
								<button
									className="save-button"
									onClick={() => handleSaveTodo(todo.id)}
								>
									Сохранить
								</button>
							) : (
								<button
									className="edit-button"
									onClick={() => setEditingTodo(todo.id)}
								>
									Редактировать
								</button>
							)}
							<button
								className="delete-button"
								onClick={() => handleDeleteTodo(todo.id)}
							>
								Удалить
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default TodoList;
