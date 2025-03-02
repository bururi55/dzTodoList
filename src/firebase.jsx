import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyCSSgONz-qMTlfnOnbQYt4diK0OFGDx6ds',
	authDomain: 'todolist-99bd8.firebaseapp.com',
	projectId: 'todolist-99bd8',
	storageBucket: 'todolist-99bd8.firebasestorage.app',
	messagingSenderId: '493996930612',
	appId: '1:493996930612:web:0921bd7192c5d14d3f3c61',
	measurementId: 'G-N61JCNH09Z',
	databaseURL: 'https://todolist-99bd8-default-rtdb.europe-west1.firebasedatabase.app/',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

export { db };
