import { ref, push } from 'firebase/database';
import { db } from '../firebase';

export const addTodo = (todo) => {
	const todosRef = ref(db, 'todos');
	push(todosRef, {
		title: todo.title,
		completed: false,
	});
};
