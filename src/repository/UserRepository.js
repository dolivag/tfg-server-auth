import firebase from 'firebase/compat/app';

export class UserRepository {
    constructor(db) {
        this.db = db;
    }

    async findByEmail(email) {
        const user = await this.db.collection('users')
            .where('email', '==', email)
            .limit(1)
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    // La consulta tiene resultados
                    querySnapshot.forEach((doc) => {
                        // Accede al documento que coincide con el correo electrónico
                        return doc.data();
                    });
                } else {
                    // No se encontraron coincidencias
                }
            })
            .catch((error) => {
                console.error('Error al realizar la consulta:', error);
            });
        return user;
    }

    async findById(id) {
        const user = await this.db.User.findByPk(id);
        return user;
    }

    async create(user) {
        try {
            const newUser = await this.db.collection('users').add({
                name: user.name,
                email: user.email,
                houseId: user.houseId
            });
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
            return newUser;
        } catch (error) {
            console.error('Error al crear el usuario:', user, error);
        }
    }
}
