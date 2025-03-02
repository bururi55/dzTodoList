import React, { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import './TodoList.css';

const TodoList = () => {
	const [todos, setTodos] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [sorted, setSorted] = useState(false);
	const [newTodo, setNewTodo] = useState('');
	const [editingTodo, setEditingTodo] = useState(null);

	useEffect(() => {
		fetchTodos();
	}, []);

	const fetchTodos = () => {
		setIsLoading(true);
		fetch('http://localhost:3004/todos')
			.then((response) => response.json())
			.then((data) => {
				setTodos(data);
				setIsLoading(false);
			});
	};

	const addTodo = async () => {
		if (!newTodo.trim()) return;
		const response = await fetch('http://localhost:3004/todos', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title: newTodo, completed: false }),
		});
		const createdTodo = await response.json();
		setTodos((prevTodos) => [...prevTodos, createdTodo]);
		setNewTodo('');
	};

	const updateTodo = async (id, updatedTitle) => {
		const response = await fetch(`http://localhost:3004/todos/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title: updatedTitle, completed: false }),
		});
		const updatedTodo = await response.json();
		setTodos((prevTodos) =>
			prevTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)),
		);
		setEditingTodo(null);
	};

	const deleteTodo = async (id) => {
		await fetch(`http://localhost:3004/todos/${id}`, {
			method: 'DELETE',
		});
		setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
	};

	const handleSearch = (event) => {
		setSearchQuery(event.target.value);
	};

	useEffect(() => {
		const debouncedSearch = debounce((query) => {
			setSearchQuery(query);
		}, 300);

		debouncedSearch(searchQuery);
	}, [searchQuery]);

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
				<button className="add-button" onClick={addTodo}>
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
									onClick={() => updateTodo(todo.id, todo.title)}
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
								onClick={() => deleteTodo(todo.id)}
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
