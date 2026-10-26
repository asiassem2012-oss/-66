import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Clock, 
  UserCheck, 
  Video, 
  CreditCard, 
  Sparkles,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Hourglass
} from 'lucide-react';
import { Course, EnrollmentRequest, StudentRecord } from '../types';

interface CoursesGridProps {
  courses: Course[];
  pendingRequests: EnrollmentRequest[];
  enrolledStudents: StudentRecord[];
  currentUserId: string;
  onEnrollClick: (course: Course) => void;
  onGoToMyCourses: () => void;
  onGoToPending: () => void;
}

export const CoursesGrid: React.FC<CoursesGridProps> = ({
  courses,
  pendingRequests,
  enrolledStudents,
  currentUserId,
  onEnrollClick,
  onGoToMyCourses,
  onGoToPending,
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'paid'>('all');

  // Check enrollment status for current user
  const isEnrolled = (courseId: string) => {
    return enrolledStudents.some((s) => s.courseId === courseId && s.userId === currentUserId);
  };

  const isPending = (courseId: string) => {
    return pendingRequests.some(
      (r) => r.courseId === courseId && r.userId === currentUserId && r.status === 'pending'
    );
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      filterType === 'all' ||
      (filterType === 'free' && course.type === 'free') ||
      (filterType === 'paid' && course.type === 'paid');

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8">
      {/* Search & Filter Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Title */}
          <div className="text-right w-full md:w-auto">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-800" />
              <span>دليل الحلقات والدورات القرآنية المتاحة</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              اختر الدورة المناسبة لمستواك وسجّل رقم الواتساب لبدء المتابعة وتلقي رابط الدرس المباشر
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="ابحث باسم الدورة أو الشيخ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg pr-9 pl-4 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
          </div>

        </div>

        {/* Filter Segmented Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
          <span className="text-xs text-stone-500 font-medium">تصنيف الدورات:</span>
          
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              جميع الدورات ({courses.length})
            </button>
            <button
              onClick={() => setFilterType('free')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filterType === 'free'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              مجانية لوجه الله ({courses.filter((c) => c.type === 'free').length})
            </button>
            <button
              onClick={() => setFilterType('paid')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filterType === 'paid'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              برامج مدفوعة ({courses.filter((c) => c.type === 'paid').length})
            </button>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">لا توجد دورات تطابق بحثك حالياً</h3>
          <p className="text-xs text-stone-500">جرب تعديل كلمات البحث أو اختيار تصنيف آخر.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredCourses.map((course) => {
            const userEnrolled = isEnrolled(course.id);
            const userPending = isPending(course.id);

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Course Image & Type Bar */}
                  <div className="relative h-48 w-full bg-emerald-950 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    {/* Top overlay tags */}
                    <div className="absolute top-3 right-3 left-3 flex items-center justify-between">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md shadow-xs ${
                        course.type === 'free'
                          ? 'bg-emerald-800 text-white'
                          : 'bg-amber-500 text-stone-950 font-extrabold'
                      }`}>
                        {course.type === 'free' ? 'دورة مجانية' : `مدفوعة · ${course.price} ${course.currency || 'ر.س'}`}
                      </span>

                      <span className="text-xs bg-stone-900/80 backdrop-blur-xs text-stone-200 px-2.5 py-1 rounded-md border border-white/10">
                        {course.level}
                      </span>
                    </div>

                    {/* Bottom overlay title */}
                    <div className="absolute bottom-3 right-3 left-3 text-right">
                      <h3 className="text-lg font-bold text-white line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-xs text-amber-300 font-medium line-clamp-1 mt-0.5">
                        فضيلة {course.instructor}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4 text-right">
                    
                    {/* Description */}
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-2">
                      {course.description}
                    </p>

                    {/* Unboxed Metadata (Zero-pill discipline) */}
                    <div className="py-2 border-y border-stone-100 space-y-2 text-xs text-stone-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                        <span>تاريخ البدء:</span>
                        <strong className="text-stone-800">{course.startDate}</strong>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate">{course.schedule}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-800" />
                          <span>الطلاب المسجلين: <strong className="text-stone-800 tabular-nums">{course.currentStudentsCount}</strong></span>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-900 font-medium">
                          <Video className="w-3.5 h-3.5 text-emerald-800" />
                          <span>بث مباشر تفاعلي (أونلاين)</span>
                        </div>
                      </div>
                    </div>

                    {/* Paid Notice with link if applicable */}
                    {course.type === 'paid' && course.paymentLink && (
                      <div className="bg-amber-50/80 border border-amber-200/80 rounded-lg p-2.5 flex items-center justify-between text-xs text-amber-900">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <CreditCard className="w-3.5 h-3.5 text-amber-700" />
                          <span>سعر الاشتراك: {course.price} {course.currency || 'ر.س'}</span>
                        </div>
                        <a
                          href={course.paymentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-800 hover:text-amber-950 font-bold underline inline-flex items-center gap-1"
                        >
                          <span>رابط الدفع</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="p-5 pt-0">
                  {userEnrolled ? (
                    <button
                      onClick={onGoToMyCourses}
                      className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>أنت ملتحق بالفعل بهذه الدورة · دخول صفحة الدرس</span>
                    </button>
                  ) : userPending ? (
                    <button
                      onClick={onGoToPending}
                      className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Hourglass className="w-4 h-4 text-amber-700" />
                      <span>طلبك قيد المراجعة لدى الإدارة · متابعة الحالة</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onEnrollClick(course)}
                      className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>اشتراك في الدورة الآن</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
