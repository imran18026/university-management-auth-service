import dotenv from 'dotenv'

import path from 'path' //node path
dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  student_default_password: process.env.DEFAULT_STUDENT_PASSWORD,
  faculty_default_password: process.env.DEFAULT_FACULTY_PASSWORD,
  admin_default_password: process.env.DEFAULT_ADMIN_PASSWORD,
}
