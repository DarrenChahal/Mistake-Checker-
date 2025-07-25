# Mistake-Checker-Backend

This is the backend service for the **Mistake Checker** system, built to log and notify mistakes in real-time using Google Firestore and Telegram notifications.

---

## 🔧 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/DarrenChahal/Mistake-Checker-Backend.git
cd Mistake-Checker-Backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create .env File
Create a `.env` file in the root directory and populate it with the following environment variables:

```env
GOOGLE_APPLICATION_CREDENTIALS=credentials.json
GCLOUD_PROJECT_ID=<your-gcp-project-id>
DATABASE_ID=mathongo
GEMINI_API_KEY=<your-gemini-api-key>
TELEGRAM_BOT_TOKEN=<your-telegram-bot-token>
TELEGRAM_CHAT_ID=<your-telegram-chat-id>
```

## 🔑 How to Get credentials.json from Google Cloud

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select or create a project
3. Enable the following APIs:
   - Firestore Database API
   - IAM & Admin > Service Accounts
4. Navigate to **IAM & Admin > Service Accounts**
5. Click **Create Service Account**, and follow these steps:
   - **Service account name**: e.g., `mistake-checker`
   - **Role**: Select `Cloud Datastore User` or `Editor`
   - Click **Continue** and then **Done**
6. After creating the account:
   - Go to the **Keys** tab
   - Click **Add Key > Create new key > JSON**
   - This will download a file named `credentials.json`
7. Place the `credentials.json` file in the root directory of this project

⚠️ **Important**: Never commit `credentials.json` or `.env` to version control. Add them to your `.gitignore`.

## 🧪 Running the Project Locally

Once you've added the `.env` file and `credentials.json`, run:

```bash
npm start
```

You should see:
```
Mistake Logger Backend is running
```

## 📦 Project Structure

```
.
├── routes/               # API route handlers
├── services/             # Business logic (e.g., Telegram, Gemini)
├── utils/                # Utility functions
├── credentials.json      # GCP service account key (keep secret)
├── .env                  # Environment variables
└── index.js              # Main entry point
```

## ✅ Features

- Stores evaluated questions/mistakes in Firestore
- Sends real-time notifications via Telegram bot
- Uses Gemini API to analyze or generate reasoning on questions

## 📬 Telegram Bot Setup

1. Create a bot using [@BotFather](https://t.me/BotFather)
2. Save the token in your `.env` as `TELEGRAM_BOT_TOKEN`
3. Send a message to your bot from your Telegram account
4. Get your chat ID using one of the following methods:

   **Option 1**: Use [@userinfobot](https://t.me/userinfobot)
   
   **Option 2**: Use the Telegram Bot API:
   ```bash
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

Darren Chahal - [@DarrenChahal](https://github.com/DarrenChahal)

Project Link: [https://github.com/DarrenChahal/Mistake-Checker-Backend](https://github.com/DarrenChahal/Mistake-Checker-Backend)
