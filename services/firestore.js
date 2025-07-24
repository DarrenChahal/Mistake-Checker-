import { Firestore, Timestamp } from '@google-cloud/firestore';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Set the environment variable for Google Cloud authentication
// This is the recommended way to use service account credentials with Google Cloud client libraries
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(projectRoot, 'credentials.json');

// Initialize Firestore
const db = new Firestore({
    projectId: process.env.GCLOUD_PROJECT_ID,
    databaseId: process.env.DATABASE_ID 
});

// Verify connection
db.collection('_health_check').doc('test').get()
    .then(() => console.log('Firestore connection verified successfully'))
    .catch(error => console.error('Firestore connection error:', error.message));

class FirestoreService {
    
    

}

const firestore = new FirestoreService();
export default firestore;
