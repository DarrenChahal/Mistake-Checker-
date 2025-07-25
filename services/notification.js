import TelegramBot from "node-telegram-bot-api";

class NotificationService {
  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error("TELEGRAM_BOT_TOKEN is not defined in the environment variables.");
    }
    this.bot = new TelegramBot(token);
  }

  sendNotification(message, chatId) {
    this.bot.sendMessage(chatId, message, { parse_mode: "MarkdownV2" })
        .then(() => console.log("Notification sent successfully"))
        .catch(error => console.error("Error sending notification:", error));
    }


}

const notificationService = new NotificationService();
export default notificationService;