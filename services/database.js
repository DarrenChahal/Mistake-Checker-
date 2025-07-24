import firestore from './firestore.js';

class DatabaseService {
    async logEvaluatedQuestions(questions) {
        firestore.logEvaluatedQuestions(questions)
            .then(() => console.log("Evaluated questions logged successfully"))
            .catch(error => console.error("Error logging evaluated questions:", error));
    }
}

const database = new DatabaseService();
export default database;
