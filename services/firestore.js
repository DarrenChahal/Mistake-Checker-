import { Firestore } from '@google-cloud/firestore';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const credentialsPath = path.join(projectRoot, process.env.GOOGLE_APPLICATION_CREDENTIALS);
process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;

const db = new Firestore({
  projectId: process.env.GCLOUD_PROJECT_ID,
  databaseId: process.env.DATABASE_ID,
});

// Health check
db.collection('_health_check').doc('test').get()
  .then(() => console.log('✅ Firestore connected'))
  .catch(err => console.error('❌ Firestore connection error:', err.message));

class FirestoreService {
  async logEvaluatedQuestions(questions) {
    const logsCollection = db.collection('logs');

    // Helper to chunk array into groups of max 500
    const chunkArray = (arr, size) => {
      const chunks = [];
      for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
      }
      return chunks;
    };

    const chunks = chunkArray(questions, 500);

    try {
      for (const chunk of chunks) {
        const batch = db.batch();
        chunk.forEach((q) => {
          const docRef = logsCollection.doc();
          batch.set(docRef, {
            question: q.question,
            user_response: q.user_response,
            correct_answer: q.correct_answer,
            topic_tag: q.topic_tag || [],
            result: q.result,
            createdAt: Date.now()
          });
        });
        await batch.commit();
      }
      console.log(`✅ Successfully logged ${questions.length} questions in ${chunks.length} batch(es)`);
    } catch (error) {
      console.error('❌ Error writing to Firestore:', error.message);
      throw error;
    }
  }

}

const firestore = new FirestoreService();
export default firestore;
