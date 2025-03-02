import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

export const fetchTodos = (setTodos) => {
	const todosRef = ref(db, 'todos');
	onValue(todosRef, (snapshot) => {
		const data = snapshot.val();
		if (data) {
			const todosArray = Object.keys(data).map((key) => ({
				id: key,
				...data[key],
			}));
			setTodos(todosArray);
		}
	});
};
