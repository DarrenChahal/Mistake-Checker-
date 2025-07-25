function escape(text) {
  if (!text) return '';
  return text
    .toString()
    .replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&')
    .replace(/\\n/g, '\n');
}

export function formatNotificationMessage(questions) {
  if (!Array.isArray(questions) || questions.length === 0) {
    return 'No questions evaluated.';
  }

  return questions.map((q, index) => {
    const questionText = escape(q.question?.question_statement || 'N/A');
    const userAnswer = escape(q.user_response || 'N/A');
    const correctAnswer = escape(q.correct_answer || 'N/A');
    const topic = escape((q.topic_tag || []).join(', ') || 'N/A');
    const difficulty = escape(q.result?.difficulty || 'N/A');
    const bloom = escape(q.result?.bloomsLevel || 'N/A');
    const explanation = escape(q.result?.explanation || '');
    const revisionAdvice = escape(q.result?.revisionAdvice || '');

    const isCorrect = q.result?.isCorrect;

    let msg = `${isCorrect ? '✅ *Correct Answer*' : '❌ *Incorrect Answer*'}\n\n`;
    msg += `*Q:* ${questionText}\n`;
    msg += `*User Answer:* ${userAnswer}\n`;
    msg += `*Correct Answer:* ${correctAnswer}\n\n`;
    msg += `*Topic:* ${topic}\n`;
    msg += `*Difficulty:* ${difficulty}\n`;
    msg += `*Bloom’s Level:* ${bloom}\n`;

    if (!isCorrect) {
      msg += `\n*Explanation:*\n${explanation}\n`;
      msg += `\n*Revision Tip:*\n${revisionAdvice}\n`;
    }

    return msg;
  }).join('\n\n');
}
