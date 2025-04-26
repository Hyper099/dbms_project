const z = require('zod');

const SignUpSchema = z.object({
   email: z.string().email("Invalid email format"),
   password: z.string().min(6, "Password must be at least 6 characters"),
   firstName: z.string().min(2, "First name must be at least 2 characters"),
   lastName: z.string().min(2, "Last name must be at least 2 characters")
});

const LoginSchema = z.object({
   email: z.string().email("Invalid email format"),
   password: z.string().min(6, "Password must be at least 6 characters")
});

const CourseSchema = z.object({
   title: z.string().min(2, "Title must be at least 3 characters."),
   description: z.string().optional(),
   duration: z.coerce.number().positive("Duration must be a positive number"),
   price: z.coerce.number().positive("Price must be a positive number"),
   category: z.string().min(1, "Category must be at least 1 character"),
   accessPeriod: z.coerce.number().positive("Access Period must be positive.")
});



module.exports = {
   SignUpSchema,
   LoginSchema,
   CourseSchema
};
