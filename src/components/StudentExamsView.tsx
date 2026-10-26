import React, { useState } from 'react';
import { 
  Award, 
  FileCheck, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle, 
  Send, 
  Trophy,
  ArrowRight,
  Lock
} from 'lucide-react';
import { store } from '../lib/store';
import { Exam, ExamSubmission, StudentRecord } from '../types';

interface StudentExamsViewProps {
  exams: Exam[];
  submissions: ExamSubmission[];
  enrolledCourses: StudentRecord[];
  currentUserId: string;
}

export const StudentExamsView: React.FC<StudentExamsViewProps> = ({
  exams,
  submissions,
  enrolledCourses,
  currentUserId,
}) => {
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submittedMessage, setSubmittedMessage] = useState(false);

  // Filter exams: ONLY courses where the student is enrolled & accepted!
  const myEnrolledCourseIds = enrolledCourses
    .filter((s) => s.userId === currentUserId)
    .map((s) => s.courseId);

  const availableExams = exams.filter((e) => myEnrolledCourseIds.includes(e.courseId));

  // Submissions for this student
  const mySubmissions = submissions.filter((s) => s.studentId === currentUserId);

  const handleSelectAnswer = (qId: string, optIdx: number) => {
    setAnswers({ ...answers, [qId]: optIdx });
  };

  const handleSubmitExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeExam) return;

    store.submitExam(activeExam.id, answers);
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setActiveExam(null);
      setAnswers({});
    }, 2500);
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-full text-xs font-bold">
            <Award className="w-3.5 h-3.5 text-emerald-700" />
            <span>الاختبارات الدورية وتقييم التجويد</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
            امتحانات الحلقات المسجل بها
          </h2>
          <p className="text-xs text-stone-500">
            تظهر هنا حصرياً الاختبارات المقررة لدوراتك المعتمدة مع إمكانية متابعة النتائج المعتمدة من أ/ سلوى بكر
          </p>
        </div>
      </div>

      {/* Taking Active Exam View */}
      {activeExam ? (
        <div className="bg-white rounded-2xl border-2 border-emerald-700 shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div>
              <span className="text-xs text-amber-800 font-bold bg-amber-50 px-2.5 py-0.5 rounded-md">
                {activeExam.courseTitle}
              </span>
              <h3 className="text-xl font-bold text-stone-900 mt-1">{activeExam.title}</h3>
              <p className="text-xs text-stone-500">{activeExam.description}</p>
            </div>
            <div className="text-left font-mono text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
              <div>الزمن المحدد: <strong>{activeExam.durationMinutes} دقيقة</strong></div>
              <div>الدرجة الكلية: <strong>{activeExam.totalMarks} درجة</strong></div>
            </div>
          </div>

          {submittedMessage ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-stone-900">تم تسليم ورقة إجابتك وتصحيحها آلياً!</h4>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                تم تصحيح إجابتك فورياً وإرسال النتيجة للإدارة. <strong>ستظهر درجتك في لوحة درجاتك بمجرد قيام أ/ سلوى بكر باعتماد النتيجة</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitExam} className="space-y-6">
              {activeExam.questions.map((q, idx) => (
                <div key={q.id} className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-900 text-sm">السؤال #{idx + 1}: {q.text}</span>
                    <span className="text-stone-500 font-mono">({q.points} درجات)</span>
                  </div>

                  <div className="space-y-2 pt-2">
                    {q.options.map((opt, optIdx) => (
                      <label
                        key={optIdx}
                        onClick={() => handleSelectAnswer(q.id, optIdx)}
                        className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer text-xs transition-colors ${
                          answers[q.id] === optIdx
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                            : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          checked={answers[q.id] === optIdx}
                          onChange={() => handleSelectAnswer(q.id, optIdx)}
                          className="cursor-pointer"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setActiveExam(null)}
                  className="px-4 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  تراجع
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>تسليم ورقة الامتحان للتصحيح والاعتماد</span>
                </button>
              </div>
            </form>
          )}

        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Available Exams to take */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold text-stone-800">الامتحانات المتاحة لك الآن:</h3>

            {availableExams.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-200 p-8 text-center space-y-2">
                <FileCheck className="w-10 h-10 text-stone-300 mx-auto" />
                <h4 className="text-sm font-bold text-stone-800">لا توجد امتحانات جديدة لحلقاتك حالياً</h4>
                <p className="text-xs text-stone-500">
                  {myEnrolledCourseIds.length === 0
                    ? 'يجب أن يتم قبولك في دورة أولاً لتظهر لك امتحاناتها المخصصة.'
                    : 'لقد أديت جميع الاختبارات المقررة أو لم تطرح الإدارة اختباراً جديداً بعد.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableExams.map((ex) => {
                  const submission = mySubmissions.find((s) => s.examId === ex.id);

                  return (
                    <div
                      key={ex.id}
                      className="bg-white rounded-xl border border-stone-200 p-5 space-y-3 shadow-xs hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {ex.courseTitle}
                        </span>
                        <span className="text-stone-400 font-mono">ينتهي في: {ex.closeDate}</span>
                      </div>

                      <h4 className="text-base font-bold text-stone-900">{ex.title}</h4>
                      <p className="text-xs text-stone-600">{ex.description}</p>

                      <div className="pt-2 flex items-center justify-between border-t border-stone-100 text-xs">
                        <span className="text-stone-500 font-mono">
                          {ex.questions.length} أسئلة · {ex.durationMinutes} دقيقة
                        </span>

                        {submission ? (
                          <span className="font-bold text-xs text-stone-600 bg-stone-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>تم التسليم</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => { setActiveExam(ex); setAnswers({}); }}
                            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <span>بدء الامتحان الآن</span>
                            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: My Submitted Exam Results & Approvals */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-stone-800">سجل نتائجك واعتماد الإدارة:</h3>

            {mySubmissions.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-200 p-6 text-center text-xs text-stone-500">
                لم تقدم أي اختبار بعد.
              </div>
            ) : (
              <div className="space-y-3">
                {mySubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-white rounded-xl border border-stone-200 p-4 space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-900 truncate max-w-[180px]">{sub.examTitle}</span>
                      <span className="text-[11px] text-stone-400">{sub.submittedAt}</span>
                    </div>

                    {/* Pending Approval Gate vs Approved Result */}
                    {sub.status === 'pending_approval' ? (
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-amber-700" />
                          <span>النتيجة قيد المراجعة والاعتماد</span>
                        </div>
                        <p className="text-[11px] text-stone-600 leading-normal">
                          تم استلام إجاباتك بنجاح، وستظهر نتيجتك فور قيام إدارة الأكاديمية (أ/ سلوى بكر) بمراجعتها واعتمادها رسمياً.
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-950 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span>نتيجة معتمدة من الإدارة</span>
                          </span>
                          <span className="font-bold font-mono text-emerald-900 text-sm">
                            {sub.score} / {sub.totalMarks} ({sub.percentage}%)
                          </span>
                        </div>
                        {sub.feedback && (
                          <div className="text-[11px] text-emerald-800 border-t border-emerald-200/60 pt-1">
                            <strong>ملاحظة الإدارة: </strong> {sub.feedback}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
