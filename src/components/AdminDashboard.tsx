import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  GraduationCap, 
  Plus, 
  Check, 
  X, 
  Trash2, 
  Phone, 
  ExternalLink, 
  Video, 
  CreditCard, 
  Calendar, 
  UserCheck, 
  UserX,
  MessageCircle,
  Megaphone,
  Edit2,
  AlertCircle,
  Award,
  Settings
} from 'lucide-react';
import { Course, CourseType, EnrollmentRequest, StudentRecord, Teacher, Exam, ExamSubmission } from '../types';
import { store } from '../lib/store';
import { TeacherManagementView } from './TeacherManagementView';
import { ExamsManagementView } from './ExamsManagementView';
import { AdminSettingsView } from './AdminSettingsView';

interface AdminDashboardProps {
  courses: Course[];
  requests: EnrollmentRequest[];
  students: StudentRecord[];
  teachers: Teacher[];
  exams: Exam[];
  submissions: ExamSubmission[];
  activeSubTab: 'admin-courses' | 'admin-pending' | 'admin-students' | 'admin-teachers' | 'admin-exams' | 'admin-settings';
  setActiveSubTab: (tab: 'admin-courses' | 'admin-pending' | 'admin-students' | 'admin-teachers' | 'admin-exams' | 'admin-settings') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  courses,
  requests,
  students,
  teachers,
  exams,
  submissions,
  activeSubTab,
  setActiveSubTab,
}) => {
  // Add Course Form State
  const [courseTitle, setCourseTitle] = useState('');
  const [instructor, setInstructor] = useState('الشيخ المقرئ د. أحمد النجار');
  const [startDate, setStartDate] = useState('2026-11-15');
  const [schedule, setSchedule] = useState('السبت والثلاثاء - 07:00 مساءً بتوقيت مكة');
  const [courseType, setCourseType] = useState<CourseType>('free');
  const [price, setPrice] = useState<number>(150);
  const [currency, setCurrency] = useState('ر.س');
  const [paymentLink, setPaymentLink] = useState('https://buy.stripe.com/demo-quran-tajweed');
  const [onlineLessonLink, setOnlineLessonLink] = useState('https://meet.google.com/quran-live-demo');
  const [level, setLevel] = useState<Course['level']>('متوسط');
  const [description, setDescription] = useState('');
  const [maxStudents, setMaxStudents] = useState<number>(30);
  const [formSuccessMessage, setFormSuccessMessage] = useState('');

  // Course Link Edit Modal State
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [updatedLink, setUpdatedLink] = useState('');

  // Student Removal Modal State
  const [studentToRemove, setStudentToRemove] = useState<StudentRecord | null>(null);
  const [removalReason, setRemovalReason] = useState('الغياب المتكرر عن الحلقات المباشرة دون عذر');

  // Request Rejection Modal State
  const [requestToReject, setRequestToReject] = useState<EnrollmentRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('عدم توافق الموعد أو اكتمال عدد المقاعد المتاحة');

  // Filter students by course
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');

  // Broadcast Message State
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState<string>('all');

  // Pending requests list
  const pendingRequests = requests.filter((r) => r.status === 'pending');

  // Handle Add Course
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    store.addCourse({
      title: courseTitle.trim(),
      instructor: instructor.trim() || 'مشرف الحلقة',
      startDate,
      schedule,
      type: courseType,
      price: courseType === 'paid' ? Number(price) : undefined,
      currency: courseType === 'paid' ? currency : undefined,
      paymentLink: courseType === 'paid' ? paymentLink.trim() : undefined,
      onlineLessonLink: onlineLessonLink.trim() || 'https://meet.google.com/live',
      level,
      description: description.trim() || 'دورة منهجية متخصصة في إتقان التلاوة وتصحيح التجويد مع متابعة فردية.',
      maxStudents: Number(maxStudents),
      image: '/src/assets/images/tajweed_recitation_session_1793044519992.jpg',
    });

    setFormSuccessMessage('تمت إضافة الدورة بنجاح ونشرها للطلاب!');
    setCourseTitle('');
    setDescription('');
    setTimeout(() => setFormSuccessMessage(''), 3000);
  };

  // Handle Save Online Link
  const handleSaveCourseLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse && updatedLink) {
      store.updateCourse(editingCourse.id, { onlineLessonLink: updatedLink });
      setEditingCourse(null);
    }
  };

  // Handle Delete Course
  const handleDeleteCourse = (courseId: string, title: string) => {
    if (window.confirm(`هل أنت متأكد من حذف دورة "${title}" وجميع بياناتها؟`)) {
      store.deleteCourse(courseId);
    }
  };

  // Handle Approve Request
  const handleApproveRequest = (requestId: string) => {
    store.approveRequest(requestId);
  };

  // Handle Reject Request
  const handleConfirmReject = () => {
    if (requestToReject) {
      store.rejectRequest(requestToReject.id, rejectionReason);
      setRequestToReject(null);
    }
  };

  // Handle Confirm Remove Student
  const handleConfirmRemoveStudent = () => {
    if (studentToRemove) {
      store.removeStudent(studentToRemove.id, removalReason);
      setStudentToRemove(null);
    }
  };

  // Handle Send Broadcast
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastContent) return;

    store.addMessage({
      userId: broadcastTarget,
      title: broadcastTitle,
      content: broadcastContent,
      type: 'announcement',
      read: false,
    });

    setShowBroadcastModal(false);
    setBroadcastTitle('');
    setBroadcastContent('');
  };

  // Filter students
  const filteredStudents = selectedCourseFilter === 'all'
    ? students
    : students.filter((s) => s.courseId === selectedCourseFilter);

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Admin Navigation Tabs */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950 text-amber-400 rounded-full text-xs font-semibold">
            <span>لوحة تحكم إدارة الأكاديمية</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
            إدارة الحلقات والطلبات والطلاب
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubTab('admin-courses')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'admin-courses'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>إضافة دورة جديدة</span>
          </button>

          <button
            onClick={() => setActiveSubTab('admin-pending')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'admin-pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>الطلبات المعلقة ({pendingRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('admin-students')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'admin-students'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>إدارة الطلاب ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('admin-exams')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'admin-exams'
                ? 'bg-amber-600 text-stone-950 shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>الامتحانات والاعتماد ({submissions.filter(s => s.status === 'pending_approval').length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('admin-teachers')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'admin-teachers'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>إدارة المشايخ ({teachers.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('admin-settings')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'admin-settings'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>إعدادات الأكاديمية</span>
          </button>

          <button
            onClick={() => setShowBroadcastModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            title="إرسال إشعار عام للطلاب"
          >
            <Megaphone className="w-3.5 h-3.5 text-amber-600" />
            <span>إرسال تعميم</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ADD COURSE & COURSES LIST                         */}
      {/* ======================================================== */}
      {activeSubTab === 'admin-courses' && (
        <div className="space-y-8">
          
          {/* Add Course Form Card */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold">إضافة دورة قرآنية جديدة</h3>
              </div>
              <span className="text-xs text-emerald-200">
                تظهر مباشرة للطلاب في واجهة التصفح
              </span>
            </div>

            {formSuccessMessage && (
              <div className="m-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-xl flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>{formSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleAddCourse} className="p-6 space-y-6">
              
              {/* Row 1: Course Title & Instructor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-800">
                    اسم الدورة / الحلقة <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: دورة إتقان مخارج الحروف والصفات - برواية حفص"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-800">
                    المعلم / المقرئ المشرف <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="فضيلة الشيخ..."
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Row 2: Start Date & Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-800">
                    تاريخ البداية <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-800">
                    موعد وأيام اللقاء الأسبوعي <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: الأحد والثلاثاء - 07:30 مساءً بتوقيت مكة"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Row 3: Online Lesson Link (Zoom / Meet) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-emerald-700" />
                    <span>رابط الدرس الأونلاين (Zoom / Google Meet) <span className="text-red-500">*</span></span>
                  </span>
                  <span className="text-[11px] text-stone-500 font-normal">
                    يظهر تلقائياً للطلاب المقبولين فقط في صفحة "دوراتي"
                  </span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://meet.google.com/xyz-abc or https://zoom.us/j/123456"
                  value={onlineLessonLink}
                  onChange={(e) => setOnlineLessonLink(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  dir="ltr"
                />
              </div>

              {/* Row 4: Course Type Toggle (Free vs Paid) as requested */}
              <div className="space-y-3 p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800">
                    نوع الدورة: <span className="text-emerald-800">اختر نوع الاشتراك</span>
                  </label>
                  
                  {/* The exact requested toggle: (مجانية / مدفوعة) */}
                  <div className="flex items-center gap-1 p-1 bg-white border border-stone-300 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setCourseType('free')}
                      className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                        courseType === 'free'
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      مجانية لوجه الله
                    </button>
                    <button
                      type="button"
                      onClick={() => setCourseType('paid')}
                      className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                        courseType === 'paid'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      دورة مدفوعة
                    </button>
                  </div>
                </div>

                {/* DYNAMIC FIELDS: If "مدفوعة" is selected -> (السعر + رابط الدفع) */}
                {courseType === 'paid' && (
                  <div className="pt-3 border-t border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-amber-900 flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>سعر الدورة <span className="text-red-500">*</span></span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          required
                          min={1}
                          placeholder="مثال: 150"
                          value={price}
                          onChange={(e) => setPrice(Number(e.target.value))}
                          className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                        />
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="bg-white border border-amber-300 rounded-lg px-2 text-xs font-medium text-stone-700"
                        >
                          <option value="ر.س">ر.س (SAR)</option>
                          <option value="USD">USD ($)</option>
                          <option value="د.إ">د.إ (AED)</option>
                          <option value="ج.م">ج.م (EGP)</option>
                          <option value="د.ك">د.ك (KWD)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-amber-900 flex items-center gap-1">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>رابط الدفع الإلكتروني <span className="text-red-500">*</span></span>
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://buy.stripe.com/... or https://paypal.me/..."
                        value={paymentLink}
                        onChange={(e) => setPaymentLink(e.target.value)}
                        className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                        dir="ltr"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Row 5: Level & Description */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-800">
                    المستوى المستهدف
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as Course['level'])}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="مبتدئ">مبتدئ (تصحيح تلاوة وجزء عم)</option>
                    <option value="متوسط">متوسط (حفظ وأحكام التجويد)</option>
                    <option value="متقدم">متقدم (ضبط المتشابهات والوقف والابتداء)</option>
                    <option value="إجازة وسند">إجازة وسند متصل بالقراءات</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-800">
                    الحد الأقصى للطلاب
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={maxStudents}
                    onChange={(e) => setMaxStudents(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-1">
                  <label className="block text-xs font-bold text-stone-800">
                    وصف مختصر للدورة
                  </label>
                  <input
                    type="text"
                    placeholder="أهداف الدورة ومنهج التلاوة..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>نشر الدورة وإتاحتها للتسجيل الآن</span>
                </button>
              </div>

            </form>
          </div>

          {/* Current Courses Management Table */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  قائمة الدورات والحلقات المتاحة حالياً ({courses.length})
                </h3>
                <p className="text-xs text-stone-500">
                  يمكنك تحديث رابط الدرس المباشر (Zoom/Meet) في أي وقت قبل بدء الحلقة
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4 font-bold">اسم الدورة</th>
                    <th className="py-3 px-4 font-bold">المشرف / المعلم</th>
                    <th className="py-3 px-4 font-bold">الموعد</th>
                    <th className="py-3 px-4 font-bold">النوع والسعر</th>
                    <th className="py-3 px-4 font-bold">الطلاب</th>
                    <th className="py-3 px-4 font-bold">رابط الدرس الأونلاين</th>
                    <th className="py-3 px-4 font-bold text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-stone-900 max-w-xs truncate">
                        {course.title}
                      </td>
                      <td className="py-3 px-4 text-stone-700">
                        {course.instructor}
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        <div>{course.startDate}</div>
                        <div className="text-[11px] text-stone-400">{course.schedule}</div>
                      </td>
                      <td className="py-3 px-4">
                        {course.type === 'free' ? (
                          <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                            مجانية
                          </span>
                        ) : (
                          <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                            {course.price} {course.currency || 'ر.س'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-800 tabular-nums">
                        {course.currentStudentsCount} طالب
                      </td>
                      <td className="py-3 px-4 text-left font-mono text-[11px] max-w-xs truncate text-stone-600" dir="ltr">
                        <a 
                          href={course.onlineLessonLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-emerald-800 hover:underline flex items-center gap-1"
                        >
                          <span className="truncate">{course.onlineLessonLink}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingCourse(course);
                              setUpdatedLink(course.onlineLessonLink);
                            }}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="تعديل رابط الدرس"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id, course.title)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="حذف الدورة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: PENDING REQUESTS PAGE (صفحة الطلبات المعلقة)        */}
      {/* ======================================================== */}
      {activeSubTab === 'admin-pending' && (
        <div className="space-y-6">
          <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="block text-sm font-bold mb-0.5">تعليمات مراجعة طلبات الانضمام:</strong>
              يظهر هنا الطلاب الذين أدخلوا أرقام الواتساب لطلب الاشتراك. يمكنك الضغط على زر الواتساب للمحادثة الفورية مع الطالب، ثم الضغط على <strong>[قبول]</strong> لنقل الطالب فوراً إلى قائمة الطلاب وإتاحة رابط البث المباشر له، أو <strong>[رفض]</strong> في حال عدم توافق المستوى.
            </div>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
              <Check className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-stone-800">لا توجد طلبات معلقة بانتظار المراجعة</h3>
              <p className="text-xs text-stone-500">تم البت في جميع طلبات الطلاب المسجلة.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-4 hover:border-amber-300 transition-colors"
                >
                  {/* Top line: Request Date & Status */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      طلب معلق
                    </span>
                    <span className="text-stone-400">{req.requestedAt}</span>
                  </div>

                  {/* Student & Course */}
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-stone-900">
                      {req.studentName}
                    </h4>
                    <p className="text-xs text-emerald-800 font-semibold">
                      الدورة المطلوبة: {req.courseTitle}
                    </p>
                    <p className="text-xs text-stone-500">
                      البريد الإلكتروني: {req.studentEmail}
                    </p>
                  </div>

                  {/* WhatsApp Action Box */}
                  <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 flex items-center justify-between gap-2">
                    <div className="text-xs">
                      <span className="text-stone-500 block">رقم الواتساب:</span>
                      <strong className="text-stone-900 font-mono text-sm" dir="ltr">
                        {req.whatsappNumber}
                      </strong>
                    </div>

                    <a
                      href={`https://wa.me/${req.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`السلام عليكم ورحمة الله، مرحباً بك يا ${req.studentName} في أكاديمية تحفيظ وتجويد القرآن الكريم بخصوص طلب انضمامك لدورة ${req.courseTitle}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                      title="مراسلة الطالب مباشرة عبر الواتساب"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>محادثة واتساب</span>
                    </a>
                  </div>

                  {req.notes && (
                    <div className="text-xs text-stone-600 bg-stone-100/50 p-2.5 rounded-md">
                      <strong className="text-stone-800">ملاحظات الطالب: </strong>
                      <span>{req.notes}</span>
                    </div>
                  )}

                  {/* Accept / Reject Buttons as requested */}
                  <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                    <button
                      onClick={() => handleApproveRequest(req.id)}
                      className="flex-1 py-2 px-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Check className="w-4 h-4 text-amber-300" />
                      <span>قبول وموافقة الأكاديمية</span>
                    </button>

                    <button
                      onClick={() => setRequestToReject(req)}
                      className="py-2 px-3 bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-700 border border-stone-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>رفض</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: STUDENTS MANAGEMENT PAGE (صفحة إدارة الطلاب)       */}
      {/* ======================================================== */}
      {activeSubTab === 'admin-students' && (
        <div className="space-y-6">
          
          {/* Filter Bar */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                إدارة الطلاب المقبولين في الحلقات
              </h3>
              <p className="text-xs text-stone-500">
                قائمة جميع الطلاب المعتمدين مع أرقام الواتساب وإمكانية إزالة الطالب في حال الغياب المتكرر
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-600 font-semibold">تصفية حسب الدورة:</span>
              <select
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="all">جميع الحلقات ({students.length} طالب)</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            {filteredStudents.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <GraduationCap className="w-10 h-10 text-stone-300 mx-auto" />
                <h4 className="text-sm font-bold text-stone-800">لا يوجد طلاب مسجلين في هذا القسم</h4>
                <p className="text-xs text-stone-500">قم بقبول طلبات الطلاب المعلقة لإضافتهم هنا.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4 font-bold">اسم الطالب</th>
                      <th className="py-3 px-4 font-bold">الدورة القرآنية</th>
                      <th className="py-3 px-4 font-bold">رقم الواتساب</th>
                      <th className="py-3 px-4 font-bold">تاريخ الانضمام</th>
                      <th className="py-3 px-4 font-bold">نسبة الحضور</th>
                      <th className="py-3 px-4 font-bold text-center">إجراءات الإدارة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredStudents.map((stud) => (
                      <tr key={stud.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-stone-900">
                          <div>{stud.studentName}</div>
                          <div className="text-[11px] text-stone-400 font-normal">{stud.studentEmail}</div>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-emerald-900 max-w-xs">
                          {stud.courseTitle}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-medium text-stone-800" dir="ltr">
                          <div className="flex items-center gap-2">
                            <span>{stud.whatsappNumber}</span>
                            <a
                              href={`https://wa.me/${stud.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`السلام عليكم يا ${stud.studentName}، نتواصل معك من إدارة أكاديمية القرآن الكريم بخصوص حلقة ${stud.courseTitle}.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-md transition-colors"
                              title="إرسال رسالة واتساب"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-stone-600">
                          {stud.joinedDate}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`font-bold tabular-nums px-2 py-0.5 rounded-md ${
                            stud.attendanceRate >= 90
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-amber-50 text-amber-800'
                          }`}>
                            {stud.attendanceRate}%
                          </span>
                        </td>

                        {/* Remove Student Button as requested */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => setStudentToRemove(stud)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                            title="إلغاء اشتراك الطالب في حال الغياب المتكرر"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>حذف / إزالة الطالب</span>
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: EXAMS & GRADING SYSTEM                            */}
      {/* ======================================================== */}
      {activeSubTab === 'admin-exams' && (
        <ExamsManagementView
          exams={exams}
          submissions={submissions}
          courses={courses}
        />
      )}

      {/* ======================================================== */}
      {/* TAB 5: TEACHERS MANAGEMENT                               */}
      {/* ======================================================== */}
      {activeSubTab === 'admin-teachers' && (
        <TeacherManagementView
          teachers={teachers}
          courses={courses}
        />
      )}

      {/* ======================================================== */}
      {/* TAB 6: ADMIN SETTINGS & CONTACT INFO                     */}
      {/* ======================================================== */}
      {activeSubTab === 'admin-settings' && (
        <AdminSettingsView />
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT ONLINE LESSON LINK                           */}
      {/* ======================================================== */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden text-right">
            <div className="bg-emerald-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">تحديث رابط الدرس الأونلاين</h3>
              <button onClick={() => setEditingCourse(null)} className="text-emerald-200 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveCourseLink} className="p-5 space-y-4">
              <div className="text-xs text-stone-600">
                تعديل رابط البث المباشر (Google Meet أو Zoom) لدورة:
                <strong className="block text-stone-900 mt-1">{editingCourse.title}</strong>
              </div>
              <input
                type="url"
                required
                value={updatedLink}
                onChange={(e) => setUpdatedLink(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 font-mono"
                dir="ltr"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-md"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 text-white text-xs font-bold rounded-md hover:bg-emerald-700"
                >
                  حفظ الرابط الجديد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: REMOVE STUDENT CONFIRMATION                       */}
      {/* ======================================================== */}
      {studentToRemove && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden text-right">
            <div className="bg-red-700 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>تأكيد إزالة الطالب من الدورة</span>
              </h3>
              <button onClick={() => setStudentToRemove(null)} className="text-red-200 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-stone-700 leading-relaxed">
                هل أنت متأكد من إزالة الطالب <strong className="text-stone-900">{studentToRemove.studentName}</strong> من دورة <strong className="text-stone-900">{studentToRemove.courseTitle}</strong>؟
              </p>
              
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-800">
                  سبب الإلغاء (يصل للطالب كإشعار):
                </label>
                <input
                  type="text"
                  value={removalReason}
                  onChange={(e) => setRemovalReason(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setStudentToRemove(null)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-md"
                >
                  تراجع
                </button>
                <button
                  onClick={handleConfirmRemoveStudent}
                  className="px-4 py-1.5 bg-red-700 text-white text-xs font-bold rounded-md hover:bg-red-800"
                >
                  تأكيد إزالة الطالب
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: REJECT REQUEST CONFIRMATION                       */}
      {/* ======================================================== */}
      {requestToReject && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden text-right">
            <div className="bg-stone-800 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">رفض طلب الانضمام</h3>
              <button onClick={() => setRequestToReject(null)} className="text-stone-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-stone-700 leading-relaxed">
                رفض طلب الطالب: <strong className="text-stone-900">{requestToReject.studentName}</strong> لدورة <strong className="text-stone-900">{requestToReject.courseTitle}</strong>.
              </p>
              
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-800">
                  سبب الرفض الموجه للطالب:
                </label>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setRequestToReject(null)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-md"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded-md hover:bg-red-700"
                >
                  تأكيد الرفض
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: SEND BROADCAST ANNOUNCEMENT                       */}
      {/* ======================================================== */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden text-right">
            <div className="bg-emerald-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-amber-400" />
                <span>إرسال تعميم أو رسالة للطلاب</span>
              </h3>
              <button onClick={() => setShowBroadcastModal(false)} className="text-emerald-200 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSendBroadcast} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-800">
                  عنوان الإشعار
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تنبيه بخصوص موعد اختبار التجويد..."
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-800">
                  نص الرسالة
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="اكتب التوجيهات أو التعليمات للطلاب هنا..."
                  value={broadcastContent}
                  onChange={(e) => setBroadcastContent(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-md"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 text-white text-xs font-bold rounded-md hover:bg-emerald-700"
                >
                  إرسال الإشعار لجميع الطلاب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
