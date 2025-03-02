import { ref, update } from 'firebase/database';
import { db } from '../firebase';

export const updateTodo = (id, updatedTodo) => {
	const todoRef = ref(db, `todos/${id}`);
	update(todoRef, updatedTodo);
};
