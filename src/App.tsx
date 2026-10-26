import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CoursesGrid } from './components/CoursesGrid';
import { MyCoursesView } from './components/MyCoursesView';
import { PendingRequestsView } from './components/PendingRequestsView';
import { MessagesView } from './components/MessagesView';
import { StudentExamsView } from './components/StudentExamsView';
import { AdminDashboard } from './components/AdminDashboard';
import { EnrollModal } from './components/EnrollModal';
import { AuthModal } from './components/AuthModal';
import { FeedbackModal } from './components/FeedbackModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { store } from './lib/store';
import { Course, ActiveTab, User, Teacher, Exam, ExamSubmission } from './types';
import { BookOpen, Phone, Video, ShieldCheck, Heart, Sparkles, Trophy, Star } from 'lucide-react';

export default function App() {
  // Store reactive state
  const [currentUser, setCurrentUser] = useState<User | null>(() => store.getCurrentUser());
  const [courses, setCourses] = useState(() => store.getCourses());
  const [requests, setRequests] = useState(() => store.getRequests());
  const [students, setStudents] = useState(() => store.getStudents());
  const [messages, setMessages] = useState(() => store.getMessages());
  const [teachers, setTeachers] = useState(() => store.getTeachers());
  const [exams, setExams] = useState(() => store.getExams());
  const [submissions, setSubmissions] = useState(() => store.getSubmissions());
  const settings = store.getSettings();

  // UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>('courses');
  const [enrollModalCourse, setEnrollModalCourse] = useState<Course | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCurrentUser(store.getCurrentUser());
      setCourses(store.getCourses());
      setRequests(store.getRequests());
      setStudents(store.getStudents());
      setMessages(store.getMessages());
      setTeachers(store.getTeachers());
      setExams(store.getExams());
      setSubmissions(store.getSubmissions());
    });
    return () => unsubscribe();
  }, []);

  // When switching role to admin, route to admin-courses if currently on a student-only tab
  useEffect(() => {
    if (currentUser?.role === 'admin' && (activeTab === 'my-courses' || activeTab === 'pending' || activeTab === 'messages' || activeTab === 'exams')) {
      setActiveTab('admin-courses');
    } else if (currentUser?.role === 'student' && (activeTab.startsWith('admin-'))) {
      setActiveTab('courses');
    }
  }, [currentUser?.role]);

  const isAdmin = currentUser?.role === 'admin';

  // Counts for badges
  const pendingCountForStudent = currentUser
    ? requests.filter((r) => r.userId === currentUser.id && r.status === 'pending').length
    : 0;

  const pendingCountForAdmin = requests.filter((r) => r.status === 'pending').length;

  const unreadMessagesCount = currentUser
    ? messages.filter((m) => (m.userId === currentUser.id || m.userId === 'all') && !m.read).length
    : 0;

  // Handle enrollment submit
  const handleEnrollSubmit = (courseId: string, whatsapp: string, notes?: string) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    store.requestEnrollment(courseId, whatsapp, notes);
    setTimeout(() => {
      setActiveTab('pending');
    }, 1200);
  };

  // Handle cancel request
  const handleCancelRequest = (requestId: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟')) {
      store.rejectRequest(requestId, 'تم الإلغاء بطلب من الطالب');
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-stone-900 flex flex-col selection:bg-emerald-700 selection:text-white relative" dir="rtl">
      
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={isAdmin ? pendingCountForAdmin : pendingCountForStudent}
        unreadMessagesCount={unreadMessagesCount}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenSupabase={() => setSupabaseModalOpen(true)}
        onOpenFeedback={() => setFeedbackModalOpen(true)}
      />

      {/* Hero Banner (Shown when exploring all courses) */}
      {activeTab === 'courses' && (
        <HeroBanner
          onExploreCourses={() => {
            const el = document.getElementById('courses-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onMyCourses={() => setActiveTab('my-courses')}
          isAdmin={isAdmin}
          onAdminAddCourse={() => setActiveTab('admin-courses')}
        />
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div id="courses-section">
          
          {/* TAB: COURSES DIRECTORY */}
          {activeTab === 'courses' && (
            <CoursesGrid
              courses={courses}
              pendingRequests={requests}
              enrolledStudents={students}
              currentUserId={currentUser?.id || ''}
              onEnrollClick={(course) => {
                if (!currentUser) {
                  setAuthModalOpen(true);
                } else {
                  setEnrollModalCourse(course);
                }
              }}
              onGoToMyCourses={() => setActiveTab('my-courses')}
              onGoToPending={() => setActiveTab('pending')}
            />
          )}

          {/* TAB: MY COURSES */}
          {activeTab === 'my-courses' && (
            <MyCoursesView
              enrolledStudents={students}
              courses={courses}
              currentUserId={currentUser?.id || ''}
              onExploreCourses={() => setActiveTab('courses')}
              onOpenExams={() => setActiveTab('exams')}
            />
          )}

          {/* TAB: PENDING REQUESTS */}
          {activeTab === 'pending' && (
            <PendingRequestsView
              requests={requests}
              currentUserId={currentUser?.id || ''}
              onExploreCourses={() => setActiveTab('courses')}
              onCancelRequest={handleCancelRequest}
            />
          )}

          {/* TAB: STUDENT EXAMS & RESULTS */}
          {activeTab === 'exams' && (
            <StudentExamsView
              exams={exams}
              submissions={submissions}
              enrolledCourses={students}
              currentUserId={currentUser?.id || ''}
            />
          )}

          {/* TAB: MESSAGES & INBOX */}
          {activeTab === 'messages' && (
            <MessagesView
              messages={messages}
              currentUserId={currentUser?.id || ''}
              onMarkAsRead={(id) => store.markAsRead(id)}
              onMarkAllAsRead={() => currentUser && store.markAllAsRead(currentUser.id)}
              onNavigateToCourse={() => setActiveTab('courses')}
            />
          )}

          {/* TABS: ADMIN DASHBOARD */}
          {(activeTab.startsWith('admin-')) && (
            <AdminDashboard
              courses={courses}
              requests={requests}
              students={students}
              teachers={teachers}
              exams={exams}
              submissions={submissions}
              activeSubTab={activeTab as 'admin-courses' | 'admin-pending' | 'admin-students' | 'admin-teachers' | 'admin-exams' | 'admin-settings'}
              setActiveSubTab={(sub) => setActiveTab(sub)}
            />
          )}

        </div>
      </main>

      {/* Floating WhatsApp Action (01093165437) */}
      <FloatingWhatsApp
        phone={settings.whatsappPhone}
        directorName={settings.directorName}
      />

      {/* Enrollment Flow Modal */}
      {enrollModalCourse && (
        <EnrollModal
          course={enrollModalCourse}
          isOpen={!!enrollModalCourse}
          onClose={() => setEnrollModalCourse(null)}
          onSubmit={handleEnrollSubmit}
        />
      )}

      {/* Student Feedback & Rating Modal */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        courses={courses}
      />

      {/* Auth & Roles Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
      />

      {/* Supabase Config & Schema Modal */}
      <SupabaseConfigModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
      />

      {/* Islamic Production-Ready Footer */}
      <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-900 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-right">
            
            {/* Col 1 */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-400 flex items-center justify-center border border-amber-500/40">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-white">
                  أكاديمية {settings.academyName} (إدارة {settings.directorName})
                </h3>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed max-w-md font-light">
                {settings.welcomeMessage}. منصة متكاملة للحلقات المباشرة، تصحيح التلاوة، الامتحانات الدورية، والإجازة بالسند المتصل برواية حفص عن عاصم.
              </p>
              <div className="text-xs text-amber-400 font-quran pt-1">
                ﴿ إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ ﴾ [الإسراء: 9]
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                أقسام الأكاديمية
              </h4>
              <ul className="space-y-1.5 text-xs text-stone-300">
                <li>
                  <button onClick={() => setActiveTab('courses')} className="hover:text-amber-400 transition-colors">
                    دليل الحلقات والدورات
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('my-courses')} className="hover:text-amber-400 transition-colors">
                    دوراتي وحلقاتي المباشرة
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('exams')} className="hover:text-amber-400 transition-colors">
                    الاختبارات ولوحة الشرف
                  </button>
                </li>
                <li>
                  <button onClick={() => setFeedbackModalOpen(true)} className="hover:text-amber-400 transition-colors">
                    تقييم الأكاديمية والمقترحات
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                تواصل الإدارة المباشر
              </h4>
              <div className="space-y-1.5 text-xs text-stone-300">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold text-amber-300" dir="ltr">{settings.contactPhone}</span>
                </div>
                <div className="text-xs text-stone-400">
                  الإشراف العام: <strong>{settings.directorName}</strong>
                </div>
                <div className="flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-emerald-400" />
                  <span>غرف Zoom & Google Meet المباشرة</span>
                </div>
                <div className="text-[11px] text-stone-400 pt-1">
                  المقر: {settings.address}
                </div>
              </div>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-2">
            <div>
              جميع الحقوق محفوظة © {new Date().getFullYear()} لأكاديمية أهل القرآن (إدارة أ/ سلوى بكر)
            </div>
            <div className="flex items-center gap-3">
              <span>جاهز للنشر على Netlify / Vercel / Hostinger</span>
              <span aria-hidden="true">·</span>
              <span>تكامل Firebase & Supabase</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
