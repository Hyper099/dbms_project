const { Router } = require("express");
const connectDatabase = require("../Database/database");
const { CourseSchema } = require("../Database/schema");
const { instructorAuth, studentAuth } = require("../Middleware/authMiddleware");

const courseRouter = Router();

// Add Course
courseRouter.post("/add", instructorAuth, async (req, res) => {
   try {
      console.log("Received data:", req.body);
      const result = CourseSchema.safeParse(req.body);
      if (!result.success) {
         console.error("Validation error:", result.error.format());
         return res.status(400).json({ error: result.error.format() });
      }

      const { title, description, price, category, duration } = result.data;
      const instructorId = req.instructor.id;
      const db = await connectDatabase();

      await db.execute(
         "INSERT INTO COURSES (title, description, price, instructor_id, category, duration) VALUES (?, ?, ?, ?, ?, ?)",
         [title, description, price, instructorId, category, duration]
      );

      res.status(201).json({ message: "Course added successfully." });
   } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Database error or instructor ID invalid." });
   }
});

// Update Course
courseRouter.put("/update/:id", instructorAuth, async (req, res) => {
   try {
      const courseId = req.params.id;
      const result = CourseSchema.partial().safeParse(req.body);
      if (!result.success) {
         return res.status(400).json({ error: result.error.format() });
      }

      const { title, description, price } = result.data;
      const db = await connectDatabase();
      const [results] = await db.execute(
         "UPDATE COURSES SET title = ?, description = ?, price = ? WHERE id = ? AND instructor_id = ?",
         [title, description, price, courseId, req.instructor.id]
      );

      if (results.affectedRows === 0) {
         return res.status(404).json({ error: "Course not found or unauthorized action." });
      }

      res.status(200).json({ message: "Course updated successfully." });
   } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error updating course." });
   }
});

// Delete Course
courseRouter.delete("/delete/:id", instructorAuth, async (req, res) => {
   try {
      const courseId = req.params.id;
      const db = await connectDatabase();
      const [results] = await db.execute("DELETE FROM COURSES WHERE id = ? AND instructor_id = ?", [courseId, req.instructor.id]);

      if (results.affectedRows === 0) {
         return res.status(404).json({ error: "Course not found or unauthorized action." });
      }

      res.status(200).json({ message: "Course deleted successfully." });
   } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error deleting course." });
   }
});

// Get All Courses (Public Route)
courseRouter.get("/", async (req, res) => {
   try {
      const db = await connectDatabase();
      const [results] = await db.execute("SELECT * FROM COURSES");
      res.status(200).json(results);
   } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching courses." });
   }
});

// Get single course by ID
courseRouter.get("/:id", async (req, res) => {
   try {
      const { id } = req.params;
      const db = await connectDatabase();
      const [result] = await db.execute("SELECT * FROM COURSES WHERE id = ?", [id]);

      if (result.length === 0) {
         return res.status(404).json({ error: "Course not found." });
      }

      res.status(200).json(result[0]);
   } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching course." });
   }
});

// Enroll user in a course
courseRouter.post("/enroll", studentAuth, async (req, res) => {
   try {
      const studentId = req.student.id;
      const courseId = req.body.courseId;
      const db = await connectDatabase();

      const [courseResult] = await db.execute("SELECT access_period FROM COURSES WHERE id = ?", [courseId]);
      if (courseResult.length === 0) {
         return res.status(404).json({ error: "Course not found." });
      }

      const [existingEnrollment] = await db.execute("SELECT * FROM ENROLLMENT WHERE student_id = ? AND course_id = ?", [studentId, courseId]);
      if (existingEnrollment.length > 0) {
         return res.status(400).json({ error: "You have already enrolled in this course." });
      }

      const accessPeriod = courseResult[0].access_period || 0;
      const enrollmentDate = new Date().toISOString().split('T')[0];
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + accessPeriod);

      const [result] = await db.execute(
         "INSERT INTO ENROLLMENT (Student_id, Course_id, Enrollment_date, Start_date, Expiry_date, Status) VALUES (?, ?, ?, ?, ?, 'Active')",
         [studentId, courseId, enrollmentDate, enrollmentDate, expiryDate.toISOString().split('T')[0]]
      );

      res.json({ message: "Enrollment successful", id: result.insertId });
   } catch (err) {
      console.error("Error during enrollment:", err);
      res.status(500).json({ error: "Failed to enroll in the course." });
   }
});

module.exports = courseRouter;
