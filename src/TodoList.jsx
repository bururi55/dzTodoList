import React, { useEffect, useState } from 'react';
import './TodoList.css';

const TodoList = () => {
	const [todos, setTodos] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		fetch('https://jsonplaceholder.typicode.com/todos')
			.then((response) => response.json())
			.then((data) => {
				setTodos(data);
			})
			.finally(() => setIsLoading(false));
	}, []);

	const addTodo = (newTodo) => {
		setTodos((prevTodos) => [...prevTodos, newTodo]);
	};

	const updateTodo = (updatedTodo) => {
		setTodos((prevTodos) =>
			prevTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)),
		);
	};

	const deleteTodo = (todoId) => {
		setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
	};

	return (
		<div className="todo-list">
			<h1>Список дел</h1>
			{isLoading ? (
				<div>Загрузка...</div>
			) : (
				<ul>
					{todos.map((todo) => (
						<li key={todo.id} className="todo-item">
							{todo.title}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default TodoList;
