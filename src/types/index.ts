export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  joinedAt: string;
  isCustomAdmin?: boolean;
}

export type CourseType = 'free' | 'paid';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  startDate: string;
  schedule: string;
  lessonDay?: number; // 0 for Sun, 1 for Mon, etc.
  lessonHour?: number; // 24-hr format, e.g., 19 for 7 PM
  lessonMinute?: number;
  type: CourseType;
  price?: number;
  currency?: string;
  paymentLink?: string;
  onlineLessonLink: string;
  level: 'مبتدئ' | 'متوسط' | 'متقدم' | 'إجازة وسند';
  image: string;
  currentStudentsCount: number;
  maxStudents?: number;
  createdAt: string;
}

export type RequestStatus = 'pending' | 'accepted' | 'rejected';

export interface EnrollmentRequest {
  id: string;
  courseId: string;
  courseTitle: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  whatsappNumber: string;
  status: RequestStatus;
  rejectionReason?: string;
  notes?: string;
  requestedAt: string;
  reviewedAt?: string;
}

export interface StudentRecord {
  id: string;
  enrollmentId: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  whatsappNumber: string;
  courseId: string;
  courseTitle: string;
  joinedDate: string;
  attendanceRate: number;
  notes?: string;
}

export interface AcademyMessage {
  id: string;
  userId: string; // 'all' or specific user id
  title: string;
  content: string;
  type: 'announcement' | 'approval' | 'rejection' | 'lesson_link' | 'reminder' | 'exam_alert';
  courseId?: string;
  courseTitle?: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

// Teacher / Supervisor model
export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string; // e.g., قراءات وتجويد، حفظ وتثبيت
  permissions: {
    manageExams: boolean;
    manageCourses: boolean;
    manageAttendance: boolean;
  };
  assignedCourses: string[];
  createdAt: string;
}

// Exams & Questions model
export interface ExamQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
  points: number;
}

export interface Exam {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string;
  openDate: string;
  closeDate: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  questions: ExamQuestion[];
  createdAt: string;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  examTitle: string;
  courseId: string;
  studentId: string;
  studentName: string;
  whatsappNumber: string;
  answers: Record<string, number>; // questionId -> chosen answer index
  score: number;
  totalMarks: number;
  percentage: number;
  status: 'pending_approval' | 'approved';
  approvedAt?: string;
  submittedAt: string;
  feedback?: string;
}

// Student Academy Feedback
export interface StudentFeedback {
  id: string;
  studentId: string;
  studentName: string;
  courseTitle?: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: string;
}

// Academy General Settings
export interface AcademySettings {
  academyName: string;
  directorName: string;
  contactPhone: string;
  whatsappPhone: string;
  address: string;
  welcomeMessage: string;
  announcementTicker: string;
}

export type ActiveTab = 
  | 'courses' 
  | 'my-courses' 
  | 'pending' 
  | 'messages' 
  | 'exams'
  | 'admin-courses' 
  | 'admin-pending' 
  | 'admin-students'
  | 'admin-teachers'
  | 'admin-exams'
  | 'admin-leaderboard'
  | 'admin-settings';
