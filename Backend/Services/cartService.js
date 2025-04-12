const isCourseExist = async (db, courseId) => {
   const [result] = await db.execute(
      "SELECT id FROM COURSES WHERE id = ?",
      [courseId]
   );
   return result.length > 0;
};

const isCourseInCart = async (db, studentId, courseId) => {
   const [result] = await db.execute(
      "SELECT 1 FROM CART WHERE student_id = ? AND course_id = ?",
      [studentId, courseId]
   );
   return result.length > 0;
};

const isStudentEnrolled = async (db, studentId, courseId) => {
   const [result] = await db.execute(
      "SELECT 1 FROM ENROLLMENT WHERE student_id = ? AND course_id = ?",
      [studentId, courseId]
   );
   return result.length > 0;
};

module.exports = {
   isCourseExist,
   isCourseInCart,
   isStudentEnrolled,
};
