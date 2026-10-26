import { 
  Course, 
  EnrollmentRequest, 
  StudentRecord, 
  AcademyMessage, 
  User, 
  UserRole,
  Teacher,
  Exam,
  ExamSubmission,
  StudentFeedback,
  AcademySettings
} from '../types';
import { auth, googleProvider, db, handleFirestoreError, OperationType, fbSignOut } from './firebase';
import { onAuthStateChanged, signInWithPopup, User as FbUser } from 'firebase/auth';

const HERO_IMG = '/src/assets/images/hero_quran_academy_1793044519373.jpg';
const STUDY_IMG = '/src/assets/images/tajweed_recitation_session_1793044519992.jpg';
const BADGE_IMG = '/src/assets/images/academy_badge_emblem_1793044518865.jpg';

// Initial Academy Settings
const DEFAULT_SETTINGS: AcademySettings = {
  academyName: 'أهل القرآن',
  directorName: 'أ/ سلوى بكر',
  contactPhone: '01093165437',
  whatsappPhone: '01093165437',
  address: 'جمهورية مصر العربية - القاهرة',
  welcomeMessage: 'مرحباً بكم في أكاديمية أهل القرآن لتحفيظ وتجويد كتاب الله برعاية وإدارة أ/ سلوى بكر',
  announcementTicker: 'يسر إدارة الأكاديمية (أ/ سلوى بكر) الترحيب بجميع طلبة العلم في الحلقات المباشرة ونظام الامتحانات الذكي.',
};

const DEFAULT_ADMIN_CREDENTIALS = {
  username: 'admin_salwa',
  password: 'salwa_quran_2026',
};

const DEFAULT_USERS: User[] = [
  {
    id: 'user-admin-salwa',
    name: 'أ/ سلوى بكر (مدير الأكاديمية)',
    email: 'salwa.bakr@quran-academy.com',
    role: 'admin',
    phone: '01093165437',
    avatar: BADGE_IMG,
    joinedAt: '2026-01-01',
    isCustomAdmin: true,
  }
];

const DEFAULT_TEACHERS: Teacher[] = [
  {
    id: 'teach-1',
    name: 'فضيلة الشيخ د. أحمد النجار',
    email: 'ahmed.naggar@quran-academy.com',
    phone: '01093165437',
    specialization: 'إجازة بالقراءات العشر الصغرى والكبرى وضبط التجويد',
    permissions: {
      manageExams: true,
      manageCourses: true,
      manageAttendance: true,
    },
    assignedCourses: ['c-1', 'c-3'],
    createdAt: '2026-01-10',
  },
  {
    id: 'teach-2',
    name: 'الشيخة فاطمة عبد الرحمن',
    email: 'fatma@quran-academy.com',
    phone: '01093165437',
    specialization: 'تحفيظ القرآن الكريم وتصحيح مخارج الحروف للأخوات',
    permissions: {
      manageExams: true,
      manageCourses: false,
      manageAttendance: true,
    },
    assignedCourses: ['c-2'],
    createdAt: '2026-01-20',
  }
];

const DEFAULT_COURSES: Course[] = [
  {
    id: 'c-1',
    title: 'دورة إتقان التجويد وتصحيح التلاوة (جزء عمّ)',
    description: 'دورة تطبيقية مباشرة تركز على تصحيح مخارج الحروف وصفاتها، وتطبيق أحكام النون والميم الساكنتين والمدود برعاية أ/ سلوى بكر.',
    instructor: 'فضيلة الشيخ د. أحمد النجار',
    startDate: '2026-11-05',
    schedule: 'الأحد والثلاثاء - 07:30 مساءً بتوقيت القاهرة',
    lessonDay: 0,
    lessonHour: 19,
    lessonMinute: 30,
    type: 'free',
    onlineLessonLink: 'https://meet.google.com/ahl-alquran-live',
    level: 'مبتدئ',
    image: HERO_IMG,
    currentStudentsCount: 0,
    maxStudents: 35,
    createdAt: '2026-10-15',
  },
  {
    id: 'c-2',
    title: 'برنامج التحفيظ المكثف - سورة البقرة وآل عمران',
    description: 'حلقات يومية مع نخبة من الحفاظ المتقنين لتثبيت الحفظ والمراجعة التراكمية، مع اختبارات أسبوعية ومتابعة فردية تحت إشراف الإدارة.',
    instructor: 'الشيخة فاطمة عبد الرحمن',
    startDate: '2026-11-10',
    schedule: 'السبت، الإثنين، والأربعاء - 06:00 مساءً',
    lessonDay: 1,
    lessonHour: 18,
    lessonMinute: 0,
    type: 'paid',
    price: 150,
    currency: 'ج.م',
    paymentLink: 'https://buy.stripe.com/demo-quran-albaqarah',
    onlineLessonLink: 'https://us02web.zoom.us/j/89201928374?pwd=salwa',
    level: 'متوسط',
    image: STUDY_IMG,
    currentStudentsCount: 0,
    maxStudents: 25,
    createdAt: '2026-10-18',
  },
  {
    id: 'c-3',
    title: 'حلقة الإجازة والسند المتصل برواية حفص عن عاصم',
    description: 'إقراء القرآن الكريم كاملاً غيباً مع التوجيه الدقيق لأصول الرواية حتى نيل الإجازة بالسند المتصل إلى رسول الله ﷺ.',
    instructor: 'فضيلة الشيخ د. أحمد النجار',
    startDate: '2026-12-01',
    schedule: 'جلسات فردية محددة',
    lessonDay: 2,
    lessonHour: 20,
    lessonMinute: 0,
    type: 'paid',
    price: 350,
    currency: 'ج.م',
    paymentLink: 'https://buy.stripe.com/demo-quran-sanad',
    onlineLessonLink: 'https://us02web.zoom.us/j/7729102938?pwd=sanad',
    level: 'إجازة وسند',
    image: BADGE_IMG,
    currentStudentsCount: 0,
    maxStudents: 10,
    createdAt: '2026-10-22',
  }
];

const DEFAULT_EXAMS: Exam[] = [
  {
    id: 'exam-1',
    courseId: 'c-1',
    courseTitle: 'دورة إتقان التجويد وتصحيح التلاوة (جزء عمّ)',
    title: 'الاختبار الدوري الأول: أحكام النون الساكنة والتنوين',
    description: 'امتحان إلكتروني شامل لقياس استيعاب أحكام الإظهار، الإدغام، الإقلاب، والإخفاء وتطبيقاتها في جزء عم.',
    openDate: '2026-10-20',
    closeDate: '2026-11-30',
    durationMinutes: 20,
    totalMarks: 20,
    passingMarks: 12,
    createdAt: '2026-10-24',
    questions: [
      {
        id: 'q1',
        text: 'ما هو حكم النون الساكنة في قوله تعالى: ﴿مِنْ بَعْدِ﴾؟',
        options: ['إظهار حلقي', 'إقلاب (قلب النون ميماً مخفاة بغنة)', 'إدغام بغنة', 'إخفاء حقيقي'],
        correctAnswerIndex: 1,
        explanation: 'تقلب النون الساكنة ميماً مخفاة مع الغنة إذا جاء بعدها حرف الباء.',
        points: 5,
      },
      {
        id: 'q2',
        text: 'حروف الإظهار الحلقي الستة مجموعة في أوائل الكلمات التالية:',
        options: [
          'يرملون',
          'همز فهاء ثم عين حاء مهملتان ثم غين خاء',
          'صف ذا ثنا كم جاد شخص قد سما',
          'قطب جد'
        ],
        correctAnswerIndex: 1,
        explanation: 'حروف الحلق ستة: الهمزة، الهاء، العين، الحاء، الغين، الخاء.',
        points: 5,
      },
      {
        id: 'q3',
        text: 'كم عدد حركات المد اللازم الكلمي المثقل (مثل: ﴿الْحَاقَّةُ﴾)؟',
        options: ['حركتان', '4 حركات', '6 حركات وجوباً', 'يجوز حركتان أو أربع'],
        correctAnswerIndex: 2,
        explanation: 'المد اللازم يمد ست حركات وجوباً مشبعاً.',
        points: 5,
      },
      {
        id: 'q4',
        text: 'في قوله تعالى: ﴿مِن مَّالٍ﴾ ما نوع الإدغام وما حكم الغنة؟',
        options: ['إدغام بغير غنة', 'إدغام بغنة كامل', 'إخفاء شفوي', 'إظهار مطلق'],
        correctAnswerIndex: 1,
        explanation: 'إدغام النون في الميم إدغام بغنة كاملة.',
        points: 5,
      }
    ]
  }
];

const DEFAULT_SUBMISSIONS: ExamSubmission[] = [];

const DEFAULT_FEEDBACKS: StudentFeedback[] = [];

const DEFAULT_REQUESTS: EnrollmentRequest[] = [];

const DEFAULT_STUDENTS: StudentRecord[] = [];

const DEFAULT_MESSAGES: AcademyMessage[] = [
  {
    id: 'msg-welcome-salwa',
    userId: 'all',
    title: 'أهلاً بكم في أكاديمية أهل القرآن (إدارة أ/ سلوى بكر)',
    content: 'نسعد بزيارتكم وانضمامكم لأكاديمية أهل القرآن. نسعى معكم لنيل الخيرية في تعلم القرآن الكريم وإتقان تجويده بأحدث الأنظمة الذكية.',
    type: 'announcement',
    read: false,
    createdAt: '2026-10-26 12:00',
  }
];

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('quran_store_updated'));
  } catch (e) {}
}

class AcademyStore {
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem('ahl_quran_courses')) safeSet('ahl_quran_courses', DEFAULT_COURSES);
      if (!localStorage.getItem('ahl_quran_requests')) safeSet('ahl_quran_requests', DEFAULT_REQUESTS);
      if (!localStorage.getItem('ahl_quran_students')) safeSet('ahl_quran_students', DEFAULT_STUDENTS);
      if (!localStorage.getItem('ahl_quran_messages')) safeSet('ahl_quran_messages', DEFAULT_MESSAGES);
      if (!localStorage.getItem('ahl_quran_teachers')) safeSet('ahl_quran_teachers', DEFAULT_TEACHERS);
      if (!localStorage.getItem('ahl_quran_exams')) safeSet('ahl_quran_exams', DEFAULT_EXAMS);
      if (!localStorage.getItem('ahl_quran_submissions')) safeSet('ahl_quran_submissions', DEFAULT_SUBMISSIONS);
      if (!localStorage.getItem('ahl_quran_feedbacks')) safeSet('ahl_quran_feedbacks', DEFAULT_FEEDBACKS);
      if (!localStorage.getItem('ahl_quran_settings')) safeSet('ahl_quran_settings', DEFAULT_SETTINGS);
      if (!localStorage.getItem('ahl_quran_admin_creds')) safeSet('ahl_quran_admin_creds', DEFAULT_ADMIN_CREDENTIALS);
      if (!localStorage.getItem('ahl_quran_users')) safeSet('ahl_quran_users', DEFAULT_USERS);

      // Clean/purge all fake/mock accounts from localStorage automatically
      if (!localStorage.getItem('ahl_quran_fake_purged_v5')) {
        localStorage.setItem('ahl_quran_fake_purged_v5', 'true');
        setTimeout(() => this.purgeFakeAccounts(), 10);
      }

      window.addEventListener('quran_store_updated', () => this.notify());
      window.addEventListener('storage', () => this.notify());

      // Firebase Auth state listener
      onAuthStateChanged(auth, (fbUser: FbUser | null) => {
        if (fbUser) {
          const userEmail = fbUser.email || '';
          const isAdmin = userEmail.toLowerCase() === 'asiassem2012@gmail.com' || userEmail.toLowerCase().includes('admin');
          const userObj: User = {
            id: fbUser.uid,
            name: fbUser.displayName || userEmail.split('@')[0],
            email: userEmail,
            role: isAdmin ? 'admin' : 'student',
            avatar: fbUser.photoURL || undefined,
            joinedAt: new Date().toISOString().split('T')[0],
          };
          this.setCurrentUser(userObj);
        }
      });
    }
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  // --- Academy Settings & Admin Credentials ---
  public getSettings(): AcademySettings {
    return safeGet<AcademySettings>('ahl_quran_settings', DEFAULT_SETTINGS);
  }

  public updateSettings(updates: Partial<AcademySettings>): void {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    safeSet('ahl_quran_settings', updated);
  }

  public getAdminCredentials(): typeof DEFAULT_ADMIN_CREDENTIALS {
    return safeGet('ahl_quran_admin_creds', DEFAULT_ADMIN_CREDENTIALS);
  }

  public updateAdminCredentials(username: string, password: string): void {
    safeSet('ahl_quran_admin_creds', { username, password });
  }

  public verifyAdminCredentials(user: string, pass: string): boolean {
    const creds = this.getAdminCredentials();
    return creds.username === user.trim() && creds.password === pass.trim();
  }

  // --- Users & Auth ---
  public getCurrentUser(): User | null {
    const u = localStorage.getItem('ahl_quran_currentUser');
    if (!u) return null;
    try {
      return JSON.parse(u);
    } catch {
      return null;
    }
  }

  public setCurrentUser(user: User | null): void {
    if (user) {
      safeSet('ahl_quran_currentUser', user);
    } else {
      localStorage.removeItem('ahl_quran_currentUser');
      window.dispatchEvent(new Event('quran_store_updated'));
    }
    this.notify();
  }

  public getAllUsers(): User[] {
    return safeGet<User[]>('ahl_quran_users', DEFAULT_USERS);
  }

  public purgeFakeAccounts(): { removedUsers: number; removedStudents: number; removedRequests: number; removedSubmissions: number } {
    const fakeKeywords = ['abdullah@example.com', 'sara@example.com', 'user-student-1', 'user-student-2', 'عبد الله منصور', 'سارة خالد'];
    
    // Purge fake users, keeping real admin and real registered students
    const allUsers = this.getAllUsers();
    const cleanUsers = allUsers.filter(u => {
      if (u.role === 'admin') return true;
      const isFake = fakeKeywords.some(k => u.id.includes(k) || u.email.toLowerCase().includes(k) || u.name.includes(k));
      return !isFake;
    });
    const removedUsers = allUsers.length - cleanUsers.length;
    safeSet('ahl_quran_users', cleanUsers);

    // Purge fake students
    const allStudents = this.getStudents();
    const cleanStudents = allStudents.filter(s => {
      const isFake = fakeKeywords.some(k => s.userId.includes(k) || s.studentEmail.toLowerCase().includes(k) || s.studentName.includes(k));
      return !isFake;
    });
    const removedStudents = allStudents.length - cleanStudents.length;
    safeSet('ahl_quran_students', cleanStudents);

    // Purge fake requests
    const allRequests = this.getRequests();
    const cleanRequests = allRequests.filter(r => {
      const isFake = fakeKeywords.some(k => r.userId.includes(k) || r.studentEmail.toLowerCase().includes(k) || r.studentName.includes(k));
      return !isFake;
    });
    const removedRequests = allRequests.length - cleanRequests.length;
    safeSet('ahl_quran_requests', cleanRequests);

    // Purge fake submissions
    const allSubmissions = this.getSubmissions();
    const cleanSubmissions = allSubmissions.filter(s => {
      const isFake = fakeKeywords.some(k => s.studentId.includes(k) || s.studentName.includes(k));
      return !isFake;
    });
    const removedSubmissions = allSubmissions.length - cleanSubmissions.length;
    safeSet('ahl_quran_submissions', cleanSubmissions);

    // Purge fake feedbacks
    safeSet('ahl_quran_feedbacks', []);

    // Recalculate real course students count
    const courses = this.getCourses();
    const updatedCourses = courses.map(c => ({
      ...c,
      currentStudentsCount: cleanStudents.filter(s => s.courseId === c.id).length
    }));
    safeSet('ahl_quran_courses', updatedCourses);

    // If current logged-in session is a fake user, log out cleanly
    const cur = this.getCurrentUser();
    if (cur && fakeKeywords.some(k => cur.id.includes(k) || cur.email.toLowerCase().includes(k) || cur.name.includes(k))) {
      this.logout();
    } else {
      this.notify();
    }

    return { removedUsers, removedStudents, removedRequests, removedSubmissions };
  }

  public switchRole(role: UserRole): boolean {
    if (role === 'admin') {
      // Admin dashboard requires username & password, cannot bypass
      return false;
    }
    const users = this.getAllUsers();
    const target = users.find((u) => u.role === 'student');
    if (target) {
      this.setCurrentUser(target);
      return true;
    } else {
      this.logout();
      return true;
    }
  }

  public loginAdmin(username: string, pass: string): { success: boolean; message: string; user?: User } {
    if (this.verifyAdminCredentials(username, pass)) {
      const adminUser: User = {
        id: 'user-admin-salwa',
        name: 'أ/ سلوى بكر (إدارة الأكاديمية)',
        email: 'salwa.bakr@quran-academy.com',
        role: 'admin',
        phone: this.getSettings().contactPhone,
        avatar: BADGE_IMG,
        joinedAt: '2026-01-01',
        isCustomAdmin: true,
      };
      this.setCurrentUser(adminUser);
      return { 
        success: true, 
        message: 'مرحباً أ/ سلوى بكر! تم تسجيل الدخول إلى لوحة إدارة الأكاديمية بنجاح.', 
        user: adminUser 
      };
    }
    return { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة.' };
  }

  public loginWithCredentials(userOrEmail: string, pass: string): { success: boolean; message: string; user?: User } {
    // Check if it matches admin credentials
    if (this.verifyAdminCredentials(userOrEmail, pass)) {
      return this.loginAdmin(userOrEmail, pass);
    }

    const users = this.getAllUsers();
    const clean = userOrEmail.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === clean || u.name.toLowerCase() === clean);
    if (found) {
      this.setCurrentUser(found);
      return { success: true, message: `مرحباً بك يا ${found.name}! تم تسجيل الدخول بنجاح.`, user: found };
    }

    return { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة.' };
  }

  public register(name: string, email: string, role: UserRole, phone: string): User {
    const users = this.getAllUsers();
    const newUser: User = {
      id: 'user-' + Date.now(),
      name,
      email: email.trim().toLowerCase(),
      role,
      phone,
      joinedAt: new Date().toISOString().split('T')[0],
    };
    users.push(newUser);
    safeSet('ahl_quran_users', users);
    this.setCurrentUser(newUser);
    return newUser;
  }

  public async loginWithGoogle(): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const fbUser = res.user;
      const userEmail = fbUser.email || '';
      const isAdmin = userEmail.toLowerCase() === 'asiassem2012@gmail.com' || userEmail.toLowerCase().includes('salwa');
      const userObj: User = {
        id: fbUser.uid,
        name: fbUser.displayName || userEmail.split('@')[0],
        email: userEmail,
        role: isAdmin ? 'admin' : 'student',
        avatar: fbUser.photoURL || undefined,
        joinedAt: new Date().toISOString().split('T')[0],
      };
      
      const users = this.getAllUsers();
      if (!users.some((u) => u.id === userObj.id)) {
        users.push(userObj);
        safeSet('ahl_quran_users', users);
      }
      this.setCurrentUser(userObj);
      return { success: true, message: `مرحباً بك ${userObj.name}! تم تسجيل الدخول بواسطة Google Firebase.`, user: userObj };
    } catch (error) {
      return { success: false, message: 'تعذر إتمام الدخول عبر Google، يمكنك استخدام الدخول باسم المستخدم وكلمة السر.' };
    }
  }

  public async logout(): Promise<void> {
    try {
      await fbSignOut(auth);
    } catch (e) {}
    this.setCurrentUser(null);
  }

  // --- Meeting Link 30-Minute Rule ---
  public isMeetingLinkActive(course: Course): { active: boolean; minutesUntil: number; message: string } {
    const now = new Date();
    // Simulate active for testing or compute schedule
    // Use course schedule or default to 19:30 if unset
    const hour = typeof course.lessonHour === 'number' ? course.lessonHour : 19;
    const minute = typeof course.lessonMinute === 'number' ? course.lessonMinute : 30;
    const target = new Date();
    target.setHours(hour, minute, 0, 0);

    const diffMs = target.getTime() - now.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    // Active if within 30 minutes before or during the lesson (up to 90 min after start)
    if (diffMinutes <= 30 && diffMinutes >= -90) {
      return {
        active: true,
        minutesUntil: Math.max(0, diffMinutes),
        message: 'رابط الدرس متاح الآن! اضغط للدخول للحلقة المباشرة.',
      };
    }

    return {
      active: false,
      minutesUntil: diffMinutes > 0 ? diffMinutes : 1440 + diffMinutes,
      message: 'يُتاح رابط الدرس تلقائياً قبل بدء الحلقة بنصف ساعة فقط (30 دقيقة).',
    };
  }

  // --- Courses ---
  public getCourses(): Course[] {
    return safeGet<Course[]>('ahl_quran_courses', DEFAULT_COURSES);
  }

  public addCourse(data: Omit<Course, 'id' | 'currentStudentsCount' | 'createdAt'>): Course {
    const courses = this.getCourses();
    const newCourse: Course = {
      ...data,
      id: 'c-' + Date.now(),
      currentStudentsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      image: data.image || HERO_IMG,
    };
    courses.unshift(newCourse);
    safeSet('ahl_quran_courses', courses);

    this.addMessage({
      userId: 'all',
      title: `دورة جديدة متاحة: ${newCourse.title}`,
      content: `تعلن إدارة الأكاديمية (أ/ سلوى بكر) عن فتح باب التسجيل في ${newCourse.title} مع ${newCourse.instructor}.`,
      type: 'announcement',
      courseId: newCourse.id,
      courseTitle: newCourse.title,
      read: false,
    });

    return newCourse;
  }

  public updateCourse(courseId: string, updates: Partial<Course>): void {
    const courses = this.getCourses();
    const idx = courses.findIndex((c) => c.id === courseId);
    if (idx !== -1) {
      courses[idx] = { ...courses[idx], ...updates };
      safeSet('ahl_quran_courses', courses);
    }
  }

  public deleteCourse(courseId: string): void {
    let courses = this.getCourses().filter((c) => c.id !== courseId);
    safeSet('ahl_quran_courses', courses);
  }

  // --- Teachers Management ---
  public getTeachers(): Teacher[] {
    return safeGet<Teacher[]>('ahl_quran_teachers', DEFAULT_TEACHERS);
  }

  public addTeacher(data: Omit<Teacher, 'id' | 'createdAt'>): Teacher {
    const teachers = this.getTeachers();
    const newTeacher: Teacher = {
      ...data,
      id: 'teach-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    teachers.unshift(newTeacher);
    safeSet('ahl_quran_teachers', teachers);
    return newTeacher;
  }

  public updateTeacher(id: string, updates: Partial<Teacher>): void {
    const teachers = this.getTeachers();
    const idx = teachers.findIndex((t) => t.id === id);
    if (idx !== -1) {
      teachers[idx] = { ...teachers[idx], ...updates };
      safeSet('ahl_quran_teachers', teachers);
    }
  }

  public deleteTeacher(id: string): void {
    const teachers = this.getTeachers().filter((t) => t.id !== id);
    safeSet('ahl_quran_teachers', teachers);
  }

  // --- Enrollment Requests ---
  public getRequests(): EnrollmentRequest[] {
    return safeGet<EnrollmentRequest[]>('ahl_quran_requests', DEFAULT_REQUESTS);
  }

  public requestEnrollment(courseId: string, whatsappNumber: string, notes?: string): EnrollmentRequest {
    const user = this.getCurrentUser();
    if (!user) throw new Error('يرجى تسجيل الدخول أولاً');

    const course = this.getCourses().find((c) => c.id === courseId);
    if (!course) throw new Error('الدورة غير موجودة');

    const requests = this.getRequests();
    const existing = requests.find((r) => r.courseId === courseId && r.userId === user.id && r.status === 'pending');
    if (existing) return existing;

    const newRequest: EnrollmentRequest = {
      id: 'req-' + Date.now(),
      courseId,
      courseTitle: course.title,
      userId: user.id,
      studentName: user.name,
      studentEmail: user.email,
      whatsappNumber,
      status: 'pending',
      notes,
      requestedAt: new Date().toLocaleString('ar-EG', { hour12: true }),
    };

    requests.unshift(newRequest);
    safeSet('ahl_quran_requests', requests);

    this.addMessage({
      userId: user.id,
      title: `تم استلام طلب اشتراكك في: ${course.title}`,
      content: `تم تسجيل طلبك برقم الواتساب (${whatsappNumber}). طلبك قيد المراجعة لدى إدارة الأكاديمية (أ/ سلوى بكر).`,
      type: 'reminder',
      courseId,
      courseTitle: course.title,
      read: false,
    });

    return newRequest;
  }

  public approveRequest(requestId: string): void {
    const requests = this.getRequests();
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    req.status = 'accepted';
    req.reviewedAt = new Date().toLocaleString('ar-EG', { hour12: true });
    safeSet('ahl_quran_requests', requests);

    const students = this.getStudents();
    if (!students.some((s) => s.courseId === req.courseId && s.userId === req.userId)) {
      students.unshift({
        id: 'stud-' + Date.now(),
        enrollmentId: req.id,
        userId: req.userId,
        studentName: req.studentName,
        studentEmail: req.studentEmail,
        whatsappNumber: req.whatsappNumber,
        courseId: req.courseId,
        courseTitle: req.courseTitle,
        joinedDate: new Date().toISOString().split('T')[0],
        attendanceRate: 100,
        notes: req.notes || 'طالب معتمد',
      });
      safeSet('ahl_quran_students', students);

      const courses = this.getCourses();
      const course = courses.find((c) => c.id === req.courseId);
      if (course) {
        course.currentStudentsCount = (course.currentStudentsCount || 0) + 1;
        safeSet('ahl_quran_courses', courses);
      }
    }

    this.addMessage({
      userId: req.userId,
      title: `مبارك! اعتمدت أ/ سلوى بكر انضمامك إلى: ${req.courseTitle}`,
      content: `يسعدنا قبولك رسمياً في الأكاديمية. سيتاح رابط الدرس المباشر في صفحة "دوراتي" قبل موعد كل حلقة بـ 30 دقيقة.`,
      type: 'approval',
      courseId: req.courseId,
      courseTitle: req.courseTitle,
      read: false,
    });
  }

  public rejectRequest(requestId: string, reason?: string): void {
    const requests = this.getRequests();
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    req.status = 'rejected';
    req.rejectionReason = reason || 'اكتمال العدد المتاح في هذه الحلقة.';
    req.reviewedAt = new Date().toLocaleString('ar-EG', { hour12: true });
    safeSet('ahl_quran_requests', requests);

    this.addMessage({
      userId: req.userId,
      title: `إشعار بخصوص طلبك في: ${req.courseTitle}`,
      content: `نعتذر عن عدم قبول الطلب حالياً: ${req.rejectionReason}. يمكنك التواصل مباشرة مع الإدارة على 01093165437.`,
      type: 'rejection',
      courseId: req.courseId,
      courseTitle: req.courseTitle,
      read: false,
    });
  }

  // --- Students Management ---
  public getStudents(): StudentRecord[] {
    return safeGet<StudentRecord[]>('ahl_quran_students', DEFAULT_STUDENTS);
  }

  public removeStudent(studentId: string, reason?: string): void {
    let students = this.getStudents();
    const target = students.find((s) => s.id === studentId);
    if (!target) return;

    students = students.filter((s) => s.id !== studentId);
    safeSet('ahl_quran_students', students);

    const courses = this.getCourses();
    const course = courses.find((c) => c.id === target.courseId);
    if (course && course.currentStudentsCount > 0) {
      course.currentStudentsCount -= 1;
      safeSet('ahl_quran_courses', courses);
    }

    this.addMessage({
      userId: target.userId,
      title: `إلغاء الاشتراك في دورة: ${target.courseTitle}`,
      content: `تم إلغاء اشتراكك من قبل الإدارة: ${reason || 'بسبب الغياب المتكرر عن الحلقات'}.`,
      type: 'rejection',
      courseId: target.courseId,
      courseTitle: target.courseTitle,
      read: false,
    });
  }

  // --- Exams & Automated Grading ---
  public getExams(): Exam[] {
    return safeGet<Exam[]>('ahl_quran_exams', DEFAULT_EXAMS);
  }

  public addExam(data: Omit<Exam, 'id' | 'createdAt'>): Exam {
    const exams = this.getExams();
    const newExam: Exam = {
      ...data,
      id: 'exam-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    exams.unshift(newExam);
    safeSet('ahl_quran_exams', exams);

    // Broadcast automated notification to students enrolled in this course!
    const students = this.getStudents().filter((s) => s.courseId === data.courseId);
    students.forEach((stud) => {
      this.addMessage({
        userId: stud.userId,
        title: `امتحان جديد متاح: ${newExam.title}`,
        content: `أعلنت إدارة الأكاديمية (أ/ سلوى بكر) عن امتحان جديد لدورة "${newExam.courseTitle}". مدة الامتحان ${newExam.durationMinutes} دقيقة والدرجة الكلية ${newExam.totalMarks}.`,
        type: 'exam_alert',
        courseId: newExam.courseId,
        courseTitle: newExam.courseTitle,
        read: false,
      });
    });

    return newExam;
  }

  public getSubmissions(): ExamSubmission[] {
    return safeGet<ExamSubmission[]>('ahl_quran_submissions', DEFAULT_SUBMISSIONS);
  }

  // Student takes exam -> Auto-graded -> Stored as pending_approval (Admin must approve before student sees result!)
  public submitExam(examId: string, answers: Record<string, number>): ExamSubmission {
    const user = this.getCurrentUser();
    if (!user) throw new Error('يرجى تسجيل الدخول لتقديم الامتحان');

    const exam = this.getExams().find((e) => e.id === examId);
    if (!exam) throw new Error('الامتحان غير موجود');

    // Auto-grade calculation based on answer key
    let earnedMarks = 0;
    exam.questions.forEach((q) => {
      const studentAns = answers[q.id];
      if (studentAns !== undefined && studentAns === q.correctAnswerIndex) {
        earnedMarks += q.points;
      }
    });

    const percentage = Math.round((earnedMarks / exam.totalMarks) * 100);

    const submission: ExamSubmission = {
      id: 'sub-' + Date.now(),
      examId,
      examTitle: exam.title,
      courseId: exam.courseId,
      studentId: user.id,
      studentName: user.name,
      whatsappNumber: user.phone || '01093165437',
      answers,
      score: earnedMarks,
      totalMarks: exam.totalMarks,
      percentage,
      status: 'pending_approval', // HIDDEN FROM STUDENT UNTIL ADMIN APPROVES!
      submittedAt: new Date().toLocaleString('ar-EG', { hour12: true }),
    };

    const subs = this.getSubmissions();
    // Replace if existing or unshift
    const idx = subs.findIndex((s) => s.examId === examId && s.studentId === user.id);
    if (idx !== -1) {
      subs[idx] = submission;
    } else {
      subs.unshift(submission);
    }
    safeSet('ahl_quran_submissions', subs);

    // Notify student that submission was received and is under admin review
    this.addMessage({
      userId: user.id,
      title: `تم تسليم ورقة إجابتك: ${exam.title}`,
      content: `تم تصحيح امتحانك آلياً وإرساله لإدارة الأكاديمية. ستظهر نتيجتك المعتمدة فور اعتمادها من أ/ سلوى بكر.`,
      type: 'reminder',
      courseId: exam.courseId,
      courseTitle: exam.courseTitle,
      read: false,
    });

    return submission;
  }

  // Admin approves student exam result -> Now visible to student!
  public approveSubmission(submissionId: string, feedback?: string): void {
    const subs = this.getSubmissions();
    const target = subs.find((s) => s.id === submissionId);
    if (!target) return;

    target.status = 'approved';
    target.approvedAt = new Date().toLocaleString('ar-EG', { hour12: true });
    if (feedback) target.feedback = feedback;
    safeSet('ahl_quran_submissions', subs);

    // Notify student with the approved result
    this.addMessage({
      userId: target.studentId,
      title: `اعتمدت الإدارة نتيجتك في: ${target.examTitle}`,
      content: `مبارك! اعتمدت أ/ سلوى بكر نتيجتك: ${target.score} من ${target.totalMarks} (${target.percentage}%). يمكنك الآن الاطلاع على النتيجة الكاملة وترتيبك في لوحة الشرف.`,
      type: 'approval',
      courseId: target.courseId,
      courseTitle: target.examTitle,
      read: false,
    });
  }

  // Leaderboard of approved top students sorted from highest to lowest
  public getLeaderboard(courseId?: string): ExamSubmission[] {
    const subs = this.getSubmissions().filter((s) => s.status === 'approved');
    const filtered = courseId ? subs.filter((s) => s.courseId === courseId) : subs;
    return filtered.sort((a, b) => b.score - a.score || b.percentage - a.percentage);
  }

  // --- Feedback & Reviews ---
  public getFeedbacks(): StudentFeedback[] {
    return safeGet<StudentFeedback[]>('ahl_quran_feedbacks', DEFAULT_FEEDBACKS);
  }

  public addFeedback(rating: number, comment: string, courseTitle?: string): StudentFeedback {
    const user = this.getCurrentUser();
    const fb: StudentFeedback = {
      id: 'fb-' + Date.now(),
      studentId: user?.id || 'guest',
      studentName: user?.name || 'طالب بأكاديمية أهل القرآن',
      courseTitle,
      rating,
      comment,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const fbs = this.getFeedbacks();
    fbs.unshift(fb);
    safeSet('ahl_quran_feedbacks', fbs);
    return fb;
  }

  // --- Messages ---
  public getMessages(userId?: string): AcademyMessage[] {
    const all = safeGet<AcademyMessage[]>('ahl_quran_messages', DEFAULT_MESSAGES);
    if (!userId) return all;
    return all.filter((m) => m.userId === userId || m.userId === 'all');
  }

  public addMessage(msg: Omit<AcademyMessage, 'id' | 'createdAt'>): AcademyMessage {
    const messages = safeGet<AcademyMessage[]>('ahl_quran_messages', DEFAULT_MESSAGES);
    const newMsg: AcademyMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      createdAt: new Date().toLocaleString('ar-EG', { hour12: true }),
    };
    messages.unshift(newMsg);
    safeSet('ahl_quran_messages', messages);
    return newMsg;
  }

  public markAsRead(id: string): void {
    const messages = safeGet<AcademyMessage[]>('ahl_quran_messages', DEFAULT_MESSAGES);
    const m = messages.find((x) => x.id === id);
    if (m) {
      m.read = true;
      safeSet('ahl_quran_messages', messages);
    }
  }

  public markAllAsRead(userId: string): void {
    const messages = safeGet<AcademyMessage[]>('ahl_quran_messages', DEFAULT_MESSAGES);
    messages.forEach((m) => {
      if (m.userId === userId || m.userId === 'all') m.read = true;
    });
    safeSet('ahl_quran_messages', messages);
  }

  public resetToDefault(): void {
    safeSet('ahl_quran_courses', DEFAULT_COURSES);
    safeSet('ahl_quran_requests', DEFAULT_REQUESTS);
    safeSet('ahl_quran_students', DEFAULT_STUDENTS);
    safeSet('ahl_quran_messages', DEFAULT_MESSAGES);
    safeSet('ahl_quran_teachers', DEFAULT_TEACHERS);
    safeSet('ahl_quran_exams', DEFAULT_EXAMS);
    safeSet('ahl_quran_submissions', DEFAULT_SUBMISSIONS);
    safeSet('ahl_quran_feedbacks', DEFAULT_FEEDBACKS);
    safeSet('ahl_quran_settings', DEFAULT_SETTINGS);
    safeSet('ahl_quran_admin_creds', DEFAULT_ADMIN_CREDENTIALS);
    safeSet('ahl_quran_users', DEFAULT_USERS);
    this.setCurrentUser(DEFAULT_USERS[0]);
    this.notify();
  }
}

export const store = new AcademyStore();
