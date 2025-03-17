require("dotenv").config();
const jwt = require("jsonwebtoken");

function instructorAuth(req, res, next) {
   try {
      const token = req.headers.token;
      if (!token) {
         return res.status(401).json({ error: "Unauthorized: No token provided" });
      }

      jwt.verify(token, process.env.JWT_INSTRUCTOR_SECRET, (err, decoded) => {
         if (err) {
            return res.status(403).json({ error: "Forbidden: Invalid token" });
         }

         req.instructor = decoded;
         next();
      });
   } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server Error: Failed to authenticate token" });
   }

}


function studentAuth(req, res, next) {
   try {
      const token = req.headers.token;
      if (!token) {
         return res.status(401).json({ error: "Unauthorized: No token provided" });
      }

      jwt.verify(token, process.env.JWT_STUDENT_SECRET, (err, decoded) => {
         if (err) {
            return res.status(403).json({ error: "Forbidden: Invalid token" });
         }

         req.student = decoded;
         next();
      });
   } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server Error: Failed to authenticate token" });
   }
}

module.exports = { instructorAuth, studentAuth };
