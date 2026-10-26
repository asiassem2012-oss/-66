-- =====================================================================
-- أكاديمية أهل القرآن (إدارة أ/ سلوى بكر) - Complete Production Database Schema
-- Database Target: Supabase / PostgreSQL
-- =====================================================================

-- 1. Profiles & Roles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'teacher', 'student')) DEFAULT 'student',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  instructor TEXT NOT NULL,
  start_date DATE NOT NULL,
  schedule TEXT NOT NULL,
  lesson_day INT DEFAULT 0,
  lesson_hour INT DEFAULT 19,
  lesson_minute INT DEFAULT 30,
  type TEXT CHECK (type IN ('free', 'paid')) NOT NULL DEFAULT 'free',
  price NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'ج.م',
  payment_link TEXT,
  online_lesson_link TEXT NOT NULL,
  level TEXT DEFAULT 'متوسط',
  max_students INT DEFAULT 30,
  current_students_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Teachers & Permissions Table
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  specialization TEXT,
  permissions JSONB DEFAULT '{"manageExams": true, "manageCourses": true, "manageAttendance": true}'::jsonb,
  assigned_courses TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enrollment Requests (الطلبات المعلقة مع رقم الواتساب)
CREATE TABLE IF NOT EXISTS public.enrollment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  notes TEXT,
  rejection_reason TEXT,
  requested_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

-- 5. Enrolled Students (الطلاب المقبولين بالحلقات)
CREATE TABLE IF NOT EXISTS public.enrolled_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES public.enrollment_requests(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  joined_date DATE DEFAULT CURRENT_DATE,
  attendance_rate INT DEFAULT 100,
  notes TEXT
);

-- 6. Exams & Questions Table
CREATE TABLE IF NOT EXISTS public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  course_title TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  open_date DATE NOT NULL,
  close_date DATE NOT NULL,
  duration_minutes INT DEFAULT 20,
  total_marks NUMERIC DEFAULT 20,
  passing_marks NUMERIC DEFAULT 12,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Exam Submissions & Automated Grading
CREATE TABLE IF NOT EXISTS public.exam_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  score NUMERIC NOT NULL,
  total_marks NUMERIC NOT NULL,
  percentage INT NOT NULL,
  status TEXT CHECK (status IN ('pending_approval', 'approved')) DEFAULT 'pending_approval',
  approved_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  feedback TEXT
);

-- 8. Student Feedbacks & Ratings
CREATE TABLE IF NOT EXISTS public.student_feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  student_name TEXT NOT NULL,
  course_title TEXT,
  rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Row Level Security Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrolled_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_feedbacks ENABLE ROW LEVEL SECURITY;

-- Public can view courses
CREATE POLICY "Courses are viewable by everyone" ON public.courses FOR SELECT USING (true);
