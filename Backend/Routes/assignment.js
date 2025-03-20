const { Router } = require('express');
const { instructorAuth, studentAuth } = require('../Middleware/authMiddleware');
const connectDatabase = require('../Database/database');

const assignmentRouter = Router();

assignmentRouter.post('/submit', studentAuth, async (req, res) => {
   const db = await connectDatabase();
   const studentId = req.student.id;
   const { assignmentId, answers } = req.body;

   console.log('hi');

   try {
      // Validate assignment
      const [assignmentResult] = await db.execute(
         'SELECT * FROM ASSIGNMENTS WHERE id = ?',
         [assignmentId]
      );

      if (assignmentResult.length === 0) {
         return res.status(404).json({ error: 'Assignment not found.' });
      }

      // Fetch correct answers
      const [questions] = await db.execute(
         'SELECT id, correct_answer FROM QUESTIONS WHERE assignment_id = ?',
         [assignmentId]
      );

      if (questions.length === 0) {
         return res.status(404).json({ error: 'No questions found for this assignment.' });
      }
      console.log("hi2");
      // Calculate score
      let correctAnswers = 0;
      const studentAnswers = [];

      answers.forEach((answer) => {
         const question = questions.find(q => q.id === answer.questionId);
         const isCorrect = question && question.correct_answer === answer.answer;

         if (isCorrect) correctAnswers++;

         studentAnswers.push({
            questionId: answer.questionId,
            studentAnswer: answer.answer,
            isCorrect
         });
      });

      const score = ((correctAnswers / questions.length) * 100).toFixed(2);

      // Insert assessment record
      const [assessmentResult] = await db.execute(
         'INSERT INTO ASSESSMENTS (student_id, assignment_id, score, total_questions, correct_answers) VALUES (?, ?, ?, ?, ?)',
         [studentId, assignmentId, score, questions.length, correctAnswers]
      );

      const assessmentId = assessmentResult.insertId;

      // Insert individual question responses
      const answerPromises = studentAnswers.map(({ questionId, studentAnswer, isCorrect }) =>
         db.execute(
            'INSERT INTO STUDENT_ANSWERS (assessment_id, question_id, student_answer, is_correct) VALUES (?, ?, ?, ?)',
            [assessmentId, questionId, studentAnswer, isCorrect]
         )
      );

      await Promise.all(answerPromises);

      res.json({ message: 'Assignment submitted successfully', score });
   } catch (error) {
      console.error('Error submitting assessment:', error.message);
      res.status(500).json({ error: 'Failed to submit assessment. Please try again.' });
   }
});

// Get Student Performance
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



assignmentRouter.use(instructorAuth);

// Add assignment
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

      const questionPromises = questions.map(({ question, options, correctAnswer }) => {
         if (!question || !options || !correctAnswer || !Array.isArray(options)) {
            throw new Error('Invalid question format');
         }

         return db.execute(
            'INSERT INTO QUESTIONS (assignment_id, question, options, correct_answer) VALUES (?, ?, ?, ?)',
            [assignmentId, question, JSON.stringify(options), correctAnswer]
         );
      });

      await Promise.all(questionPromises);

      res.json({ message: 'Assignment added successfully' });
   } catch (error) {
      console.error('Error adding assignment:', error.message);
      res.status(500).json({ error: 'Failed to add assignment. Please try again.' });
   }
});

// Get assignments by instructor
assignmentRouter.get('/', async (req, res) => {
   const db = await connectDatabase();
   const instructorId = req.instructor.id;

   try {
      const [results] = await db.execute(
         `SELECT
                a.id AS assignment_id,
                a.title AS assignment_title,
                a.due_date,
                a.max_marks,
                c.title AS course_title
            FROM ASSIGNMENTS a
            JOIN COURSES c ON a.course_id = c.id
            WHERE c.instructor_id = ?`,
         [instructorId]
      );

      res.json(results);
   } catch (error) {
      console.error('Error getting assignments:', error.message);
      res.status(500).json({ error: 'Failed to get assignments. Please try again.' });
   }
});

// Get assignments by course
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

// Get Questions of a assignment by id.
assignmentRouter.get('/questions/:assignmentId/', async (req, res) => {
   const db = await connectDatabase();
   const { assignmentId } = req.params;

   try {
      const [questions] = await db.execute(
         'SELECT * FROM QUESTIONS WHERE assignment_id =?',
         [assignmentId]
      );
      res.json(questions);
   } catch (error) {
      console.error('Error getting assignment questions:', error.message);
      res.status(500).json({ error: 'Failed to get assignment questions. Please try again.' });
   }
});


module.exports = assignmentRouter;
