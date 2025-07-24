import { Firestore } from '@google-cloud/firestore';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Get full path to credentials JSON
const credentialsPath = path.join(projectRoot, process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Set env var programmatically in case it's not picked automatically
process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;

const db = new Firestore({
  projectId: process.env.GCLOUD_PROJECT_ID,
  databaseId: process.env.DATABASE_ID,
});

// Health check
db.collection('_health_check').doc('test').get()
  .then(() => console.log('✅ Firestore connected'))
  .catch(err => console.error('❌ Firestore connection error:', err.message));

// Optional class
class FirestoreService {
  // Define CRUD methods later
}

const firestore = new FirestoreService();
export default firestore;
