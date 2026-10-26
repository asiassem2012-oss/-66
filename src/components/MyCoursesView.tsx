import React, { useState } from 'react';
import { 
  GraduationCap, 
  Video, 
  ExternalLink, 
  Copy, 
  Check, 
  Calendar, 
  Clock, 
  BookOpen, 
  Volume2, 
  Sparkles,
  ArrowRight,
  Lock,
  AlertCircle
} from 'lucide-react';
import { Course, StudentRecord } from '../types';
import { store } from '../lib/store';

interface MyCoursesViewProps {
  enrolledStudents: StudentRecord[];
  courses: Course[];
  currentUserId: string;
  onExploreCourses: () => void;
  onOpenExams: () => void;
}

export const MyCoursesView: React.FC<MyCoursesViewProps> = ({
  enrolledStudents,
  courses,
  currentUserId,
  onExploreCourses,
  onOpenExams,
}) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState(false);
  // Allow toggling simulate 30-min window for testing
  const [simulateActiveRoom, setSimulateActiveRoom] = useState(true);

  // Filter students to get this student's enrollments
  const myEnrollments = enrolledStudents.filter((s) => s.userId === currentUserId);

  const myCoursesList = myEnrollments
    .map((enrollment) => {
      const course = courses.find((c) => c.id === enrollment.courseId);
      return {
        enrollment,
        course,
      };
    })
    .filter((item): item is { enrollment: StudentRecord; course: Course } => item.course !== undefined);

  const handleCopy = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="space-y-8 text-right">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 sm:p-8 rounded-2xl border border-emerald-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-800/80 rounded-full text-xs text-amber-300 font-semibold">
            <GraduationCap className="w-4 h-4" />
            <span>حلقاتك القرآنية المعتمدة · أكاديمية أهل القرآن</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            دوراتي وحلقاتي المباشرة (إدارة أ/ سلوى بكر)
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
            الحلقات التي تم قبولك فيها رسمياً. يظهر رابط الدرس الأونلاين المباشر تلقائياً قبل بدء موعد الحلقة بـ 30 دقيقة فقط لحفظ النظام.
          </p>
        </div>
      </div>

      {myCoursesList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4 max-w-xl mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 mx-auto flex items-center justify-center">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">لا توجد دورات مقبولة لك حالياً</h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            عند تقديمك لطلب انضمام في أي دورة وموافقة إدارة الأكاديمية (أ/ سلوى بكر)، ستظهر الدورة ورابط الدرس هنا تلقائياً.
          </p>
          <div className="pt-2">
            <button
              onClick={onExploreCourses}
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <span>استعراض الدورات المتاحة والتسجيل</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {myCoursesList.map(({ enrollment, course }) => {
            const meetingStatus = store.isMeetingLinkActive(course);
            const isLinkUnlocked = simulateActiveRoom || meetingStatus.active;

            return (
              <div
                key={enrollment.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden"
              >
                {/* Active Course Banner */}
                <div className="bg-emerald-50/80 px-6 py-3 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-emerald-900">
                      حالة الاشتراك: طالب معتمد ومقبول رسمياً
                    </span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span className="text-xs text-stone-600">
                      تاريخ الالتحاق: {enrollment.joinedDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onOpenExams}
                      className="text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      الاختبارات والنتائج
                    </button>
                  </div>
                </div>

                {/* Main Content Card */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Course Details (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-amber-700">
                        {course.level} · {course.type === 'free' ? 'دورة مجانية' : 'برنامج مدفوع'}
                      </span>
                      <h3 className="text-xl font-bold text-stone-900 leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600">
                        المعلم المشرف: <strong className="text-stone-800">{course.instructor}</strong>
                      </p>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Schedule Details */}
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-stone-600 pt-2 border-t border-stone-100">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-emerald-800" />
                        <span>تاريخ الانطلاق: <strong className="text-stone-800">{course.startDate}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-emerald-800" />
                        <span>الموعد الأسبوعي: <strong className="text-stone-800">{course.schedule}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Live Lesson Room (30-MINUTE RULE) (5 cols) */}
                  <div className="lg:col-span-5 bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center">
                          <Video className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900">رابط الدرس الأونلاين المباشر</div>
                          <div className="text-[11px] text-stone-500">Google Meet / Zoom</div>
                        </div>
                      </div>
                      
                      {isLinkUnlocked ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          <span>نشط ومتاح الآن</span>
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-700" />
                          <span>يُفتح قبل الموعد بـ 30 دقيقة</span>
                        </span>
                      )}
                    </div>

                    {/* Policy Notice as requested */}
                    <div className="text-[11px] text-stone-600 bg-white p-2.5 rounded-lg border border-stone-200 flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        نظام الأكاديمية: يظهر رابط الدرس تلقائياً للطلاب المشتركين قبل موعد الدرس بنصف ساعة فقط (30 دقيقة) حرصاً على تنظيم الحضور.
                      </span>
                    </div>

                    {isLinkUnlocked ? (
                      <>
                        <div className="bg-white border border-stone-300 rounded-lg p-2.5 flex items-center justify-between gap-2 text-xs text-stone-700" dir="ltr">
                          <span className="truncate font-mono text-[11px] select-all">
                            {course.onlineLessonLink}
                          </span>
                          <button
                            onClick={() => handleCopy(course.onlineLessonLink)}
                            className="p-1 text-stone-500 hover:text-emerald-800 hover:bg-stone-100 rounded-md transition-colors cursor-pointer shrink-0"
                            title="نسخ الرابط"
                          >
                            {copiedLink === course.onlineLessonLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>

                        <a
                          href={course.onlineLessonLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 text-center"
                        >
                          <Video className="w-4 h-4 text-amber-300" />
                          <span>دخول الدرس الأونلاين المباشر الآن</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </>
                    ) : (
                      <div className="p-3 bg-stone-100 rounded-xl text-center space-y-1">
                        <Lock className="w-6 h-6 text-stone-400 mx-auto" />
                        <div className="text-xs font-bold text-stone-700">رابط الدرس محمي ومغلق حالياً</div>
                        <div className="text-[11px] text-stone-500">سيعمل الرابط تلقائياً قبل بدء الحلقة بـ 30 دقيقة</div>
                      </div>
                    )}

                    {/* Simulation toggle button for immediate testing */}
                    <div className="pt-1 text-center">
                      <button
                        onClick={() => setSimulateActiveRoom(!simulateActiveRoom)}
                        className="text-[10px] text-stone-400 hover:text-stone-700 underline"
                      >
                        [تجربة الفحص]: {simulateActiveRoom ? 'محاكاة وقت سابق للدرس (إغلاق الرابط)' : 'محاكاة موعد الدرس (فتح الرابط)'}
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
