import { z } from 'zod';

const questionTypeEnum = z.enum(['mcq', 'input']);

// Base schema for all questions
const baseQuestionSchema = z.object({
  question_type: questionTypeEnum,
  question_statement: z.string().min(1, 'Question statement is required'),
  options: z.array(z.string()).optional()
}).refine((data) => {
  // For mcq, options must be provided
  if (data.question_type === 'mcq') {
    return Array.isArray(data.options) && data.options.length >= 2;
  }
  // For input, options must be undefined
  return data.options === undefined;
}, {
  message: 'MCQ questions must have options; input questions must not.',
  path: ['options']
});

const questionBlockSchema = z.object({
  question: baseQuestionSchema,
  user_response: z.string().min(1, 'User response is required'),
  correct_answer: z.string().min(1, 'Correct answer is required'),
  topic_tag: z.array(z.string()).min(1, 'At least one topic tag is required')
});

export const questionListSchema = z.array(questionBlockSchema);

export function validateQuestions(data) {
  const result = questionListSchema.safeParse(data);

  if (result.success) {
    return { isValid: true, errors: [] };
  } else {
    const errors = result.error.errors.map(err => {
      const path = err.path.join('.');
      return `${path}: ${err.message}`;
    });
    return { isValid: false, errors };
  }
}
