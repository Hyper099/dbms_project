// const { Router } = require('express');
// const { studentAuth } = require('../Middleware/authMiddleware');
// const connectDatabase = require('../Database/database');

// const assessmentRouter = Router();

// // Submit Assessment
// assessmentRouter.post('/submit', studentAuth, async (req, res) => {
//    const db = await connectDatabase();
//    const studentId = req.student.id;
//    const { assignmentId, answers } = req.body;

//    console.log('hi');

//    try {
//       // Validate assignment
//       const [assignmentResult] = await db.execute(
//          'SELECT * FROM ASSIGNMENTS WHERE id = ?',
//          [assignmentId]
//       );

//       if (assignmentResult.length === 0) {
//          return res.status(404).json({ error: 'Assignment not found.' });
//       }

//       // Fetch correct answers
//       const [questions] = await db.execute(
//          'SELECT id, correct_answer FROM QUESTIONS WHERE assignment_id = ?',
//          [assignmentId]
//       );

//       if (questions.length === 0) {
//          return res.status(404).json({ error: 'No questions found for this assignment.' });
//       }
//       console.log("hi2");
//       // Calculate score
//       let correctAnswers = 0;
//       const studentAnswers = [];

//       answers.forEach((answer) => {
//          const question = questions.find(q => q.id === answer.questionId);
//          const isCorrect = question && question.correct_answer === answer.answer;

//          if (isCorrect) correctAnswers++;

//          studentAnswers.push({
//             questionId: answer.questionId,
//             studentAnswer: answer.answer,
//             isCorrect
//          });
//       });

//       const score = ((correctAnswers / questions.length) * 100).toFixed(2);

//       // Insert assessment record
//       const [assessmentResult] = await db.execute(
//          'INSERT INTO ASSESSMENTS (student_id, assignment_id, score, total_questions, correct_answers) VALUES (?, ?, ?, ?, ?)',
//          [studentId, assignmentId, score, questions.length, correctAnswers]
//       );

//       const assessmentId = assessmentResult.insertId;

//       // Insert individual question responses
//       const answerPromises = studentAnswers.map(({ questionId, studentAnswer, isCorrect }) =>
//          db.execute(
//             'INSERT INTO STUDENT_ANSWERS (assessment_id, question_id, student_answer, is_correct) VALUES (?, ?, ?, ?)',
//             [assessmentId, questionId, studentAnswer, isCorrect]
//          )
//       );

//       await Promise.all(answerPromises);

//       res.json({ message: 'Assignment submitted successfully', score });
//    } catch (error) {
//       console.error('Error submitting assessment:', error.message);
//       res.status(500).json({ error: 'Failed to submit assessment. Please try again.' });
//    }
// });

// // Get Student Performance
// assessmentRouter.get('/performance', studentAuth, async (req, res) => {
//    const db = await connectDatabase();
//    const studentId = req.student.id;

//    try {
//       const [results] = await db.execute(
//          `
//          SELECT a.id AS assessment_id, c.title AS course_title, 
//          asn.title AS assignment_title, a.score, a.submitted_at
//          FROM ASSESSMENTS a
//          JOIN ASSIGNMENTS asn ON a.assignment_id = asn.id
//          JOIN COURSES c ON asn.course_id = c.id
//          WHERE a.student_id = ?
//          `,
//          [studentId]
//       );

//       res.json(results);
//    } catch (error) {
//       console.error('Error fetching performance:', error.message);
//       res.status(500).json({ error: 'Failed to get performance data. Please try again.' });
//    }
// });

// module.exports = assessmentRouter;
