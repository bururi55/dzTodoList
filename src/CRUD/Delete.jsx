import { ref, remove } from 'firebase/database';
import { db } from '../firebase';

export const deleteTodo = (id) => {
	const todoRef = ref(db, `todos/${id}`);
	remove(todoRef);
};
