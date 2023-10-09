// Import the functions you need from the SDKs you need
import firebase from '../config/firebase-config.js';
import admin from 'firebase-admin';

const serviceAccount = require('../config/firebase-key.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

let db = admin.firestore();
const auth = admin.auth();

afterAll(async () => {
    await deleteFirestoreData();
    const users = await getAllUsers();
    await deleteAllUsers(users);
});

// After all tests, clear the database completely
async function deleteFirestoreData() {
    try {
        // Obtiene una lista de las colecciones en tu base de datos Firestore
        const collections = await db.listCollections();

        // Elimina todas las colecciones y sus documentos
        const deletionPromises = collections.map(async (collection) => {
            const querySnapshot = await collection.get();
            querySnapshot.forEach((doc) => {
                doc.ref.delete();
            });
        });

        await Promise.all(deletionPromises);

        console.log('Todos los datos de Firestore han sido eliminados.');
    } catch (error) {
        console.error('Error al eliminar los datos de Firestore:', error);
    }
}

// After all tests, clear the authentication database completely
async function deleteAllUsers(users) {
    try {
        for (const user of users) {
            await auth.deleteUser(user.uid);
            console.log(`Usuario eliminado: ${user.uid}`);
        }
    } catch (error) {
        console.error('Error al eliminar usuarios:', error);
    }
}

// Retrieves all authenticated users from firebase
async function getAllUsers() {
    try {
        const listUsersResult = await auth.listUsers();
        return listUsersResult.users;
    } catch (error) {
        console.error('Error al recuperar la lista de usuarios:', error);
        throw error;
    }
}





