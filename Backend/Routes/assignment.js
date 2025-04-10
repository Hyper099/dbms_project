const { Router } = require('express');
const { instructorAuth, studentAuth } = require('../Middleware/authMiddleware');
const connectDatabase = require('../Database/database');

const assignmentRouter = Router();

// STUDENT ROUTES
assignmentRouter.post('/submit', studentAuth, async (req, res) => {
   const db = await connectDatabase();
   const studentId = req.student.id;
   const { assignmentId, answers } = req.body;

   try {
      const [assignmentResult] = await db.execute(
         'SELECT * FROM ASSIGNMENTS WHERE id = ?',
         [assignmentId]
      );
      if (assignmentResult.length === 0) {
         return res.status(404).json({ error: 'Assignment not found.' });
      }

      const [questions] = await db.execute(
         'SELECT id, correct_option_id FROM QUESTIONS WHERE assignment_id = ?',
         [assignmentId]
      );
      if (questions.length === 0) {
         return res.status(404).json({ error: 'No questions found for this assignment.' });
      }

      let correctAnswers = 0;
      const studentAnswers = [];

      answers.forEach(({ questionId, selectedOptionId }) => {
         const question = questions.find(q => q.id === questionId);
         const isCorrect = question && question.correct_option_id === selectedOptionId;

         if (isCorrect) correctAnswers++;

         studentAnswers.push({
            questionId,
            selectedOptionId,
            isCorrect
         });
      });

      const score = ((correctAnswers / questions.length) * 100).toFixed(2);

      const [assessmentResult] = await db.execute(
         'INSERT INTO ASSESSMENTS (student_id, assignment_id, score, total_questions, correct_answers) VALUES (?, ?, ?, ?, ?)',
         [studentId, assignmentId, score, questions.length, correctAnswers]
      );
      const assessmentId = assessmentResult.insertId;

      const answerPromises = studentAnswers.map(({ questionId, selectedOptionId, isCorrect }) =>
         db.execute(
            'INSERT INTO STUDENT_ANSWERS (assessment_id, question_id, selected_option_id, is_correct) VALUES (?, ?, ?, ?)',
            [assessmentId, questionId, selectedOptionId, isCorrect]
         )
      );
      await Promise.all(answerPromises);

      res.json({ message: 'Assignment submitted successfully', score });
   } catch (error) {
      console.error('Error submitting assessment:', error.message);
      res.status(500).json({ error: 'Failed to submit assessment. Please try again.' });
   }
});

assignmentRouter.get('/performance', studentAuth, async (req, res) => {
   const db = await connectDatabase();
   const studentId = req.student.id;

   try {
      const [results] = await db.execute(
         `
         SELECT a.id AS assessment_id, c.title AS course_title, 
         asn.title AS assignment_title, a.score, a.submitted_at
         FROM ASSESSMENTS a
         JOIN ASSIGNMENTS asn ON a.assignment_id = asn.id
         JOIN COURSES c ON asn.course_id = c.id
         WHERE a.student_id = ?
         `,
         [studentId]
      );

      res.json(results);
   } catch (error) {
      console.error('Error fetching performance:', error.message);
      res.status(500).json({ error: 'Failed to get performance data. Please try again.' });
   }
});

// INSTRUCTOR ROUTES
assignmentRouter.use(instructorAuth);

assignmentRouter.post('/add', async (req, res) => {
   const db = await connectDatabase();
   const instructorId = req.instructor.id;
   const { courseId, assignmentTitle, description, dueDate, maxMarks, questions } = req.body;

   if (!courseId || !assignmentTitle || !description || !dueDate || !maxMarks || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Invalid input data' });
   }

   try {
      const [courseResult] = await db.execute(
         'SELECT * FROM COURSES WHERE instructor_id = ? AND id = ?',
         [instructorId, courseId]
      );
      if (courseResult.length === 0) {
         return res.status(401).json({ error: 'Unauthorized access' });
      }

      const [assignmentResult] = await db.execute(
         'INSERT INTO ASSIGNMENTS (course_id, title, description, due_date, max_marks) VALUES (?, ?, ?, ?, ?)',
         [courseId, assignmentTitle, description, dueDate, maxMarks]
      );
      const assignmentId = assignmentResult.insertId;

      for (const { questionText, options, correctOptionIndex } of questions) {
         const [questionResult] = await db.execute(
            'INSERT INTO QUESTIONS (assignment_id, question_text) VALUES (?, ?)',
            [assignmentId, questionText]
         );
         const questionId = questionResult.insertId;

         const optionIds = [];
         for (const optionText of options) {
            const [optionResult] = await db.execute(
               'INSERT INTO OPTIONS (question_id, option_text) VALUES (?, ?)',
               [questionId, optionText]
            );
            optionIds.push(optionResult.insertId);
         }

         const correctOptionId = optionIds[correctOptionIndex];

         await db.execute(
            'UPDATE QUESTIONS SET correct_option_id = ? WHERE id = ?',
            [correctOptionId, questionId]
         );
      }

      res.json({ message: 'Assignment added successfully' });
   } catch (error) {
      console.error('Error adding assignment:', error.message);
      res.status(500).json({ error: 'Failed to add assignment. Please try again.' });
   }
});

assignmentRouter.get('/', async (req, res) => {
   const db = await connectDatabase();
   const instructorId = req.instructor.id;

   try {
      const [results] = await db.execute(
         `
         SELECT a.id AS assignment_id, a.title AS assignment_title, 
         a.due_date, a.max_marks, c.title AS course_title
         FROM ASSIGNMENTS a
         JOIN COURSES c ON a.course_id = c.id
         WHERE c.instructor_id = ?
         `,
         [instructorId]
      );
      res.json(results);
   } catch (error) {
      console.error('Error getting assignments:', error.message);
      res.status(500).json({ error: 'Failed to get assignments. Please try again.' });
   }
});

assignmentRouter.get('/course/:courseId', async (req, res) => {
   const db = await connectDatabase();
   const { courseId } = req.params;

   try {
      const [assignments] = await db.execute(
         'SELECT * FROM ASSIGNMENTS WHERE course_id = ?',
         [courseId]
      );
      res.json(assignments);
   } catch (error) {
      console.error('Error getting course assignments:', error.message);
      res.status(500).json({ error: 'Failed to get course assignments. Please try again.' });
   }
});

assignmentRouter.get('/questions/:assignmentId', async (req, res) => {
   const db = await connectDatabase();
   const { assignmentId } = req.params;

   try {
      const [questions] = await db.execute(
         'SELECT id, question_text FROM QUESTIONS WHERE assignment_id = ?',
         [assignmentId]
      );

      const questionsWithOptions = await Promise.all(
         questions.map(async (q) => {
            const [options] = await db.execute(
               'SELECT id, option_text FROM OPTIONS WHERE question_id = ?',
               [q.id]
            );
            return { ...q, options };
         })
      );

      res.json(questionsWithOptions);
   } catch (error) {
      console.error('Error getting assignment questions:', error.message);
      res.status(500).json({ error: 'Failed to get assignment questions. Please try again.' });
   }
});

module.exports = assignmentRouter;
