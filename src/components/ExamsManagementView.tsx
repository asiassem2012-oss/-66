import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  CheckCircle, 
  Clock, 
  Award, 
  Trophy, 
  Check, 
  X, 
  AlertCircle, 
  Calendar, 
  Send,
  Eye,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { store } from '../lib/store';
import { Exam, ExamQuestion, ExamSubmission, Course } from '../types';

interface ExamsManagementViewProps {
  exams: Exam[];
  submissions: ExamSubmission[];
  courses: Course[];
}

export const ExamsManagementView: React.FC<ExamsManagementViewProps> = ({
  exams,
  submissions,
  courses,
}) => {
  const [subTab, setSubTab] = useState<'exams_list' | 'create_exam' | 'submissions' | 'leaderboard'>('submissions');
  
  // Create exam form state
  const [targetCourseId, setTargetCourseId] = useState(courses[0]?.id || '');
  const [examTitle, setExamTitle] = useState('');
  const [examDesc, setExamDesc] = useState('');
  const [openDate, setOpenDate] = useState('2026-10-26');
  const [closeDate, setCloseDate] = useState('2026-11-30');
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [passingMarks, setPassingMarks] = useState(12);

  // Dynamic questions builder
  const [questions, setQuestions] = useState<ExamQuestion[]>([
    {
      id: 'q1',
      text: 'ما حكم النون الساكنة في قوله تعالى: ﴿مِنْ خَوْفٍ﴾؟',
      options: ['إظهار حلقي', 'إدغام بغنة', 'إخفاء حقيقي', 'إقلاب'],
      correctAnswerIndex: 0,
      points: 5,
    },
    {
      id: 'q2',
      text: 'ما هو مقدار مد البدل عند الإمام حفص عن عاصم من طريق الشاطبية؟',
      options: ['حركتان فقط', 'أربع حركات', 'ست حركات', 'يجوز حركتان أو أربع'],
      correctAnswerIndex: 0,
      points: 5,
    }
  ]);

  // Review submission modal state
  const [selectedSubmission, setSelectedSubmission] = useState<ExamSubmission | null>(null);
  const [adminFeedback, setAdminFeedback] = useState('');

  // Handle add question
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: 'q' + (questions.length + 1),
        text: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        points: 5,
      }
    ]);
  };

  const handleUpdateQuestionText = (idx: number, text: string) => {
    const updated = [...questions];
    updated[idx].text = text;
    setQuestions(updated);
  };

  const handleUpdateOption = (qIdx: number, optIdx: number, val: string) => {
    const updated = [...questions];
    updated[qIdx].options[optIdx] = val;
    setQuestions(updated);
  };

  const handleSetCorrectAnswer = (qIdx: number, correctIdx: number) => {
    const updated = [...questions];
    updated[qIdx].correctAnswerIndex = correctIdx;
    setQuestions(updated);
  };

  // Submit new exam
  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim() || questions.length === 0) return;

    const course = courses.find((c) => c.id === targetCourseId);
    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 5), 0);

    store.addExam({
      courseId: targetCourseId,
      courseTitle: course?.title || 'دورة قرآنية',
      title: examTitle.trim(),
      description: examDesc.trim() || 'امتحان دوري لقياس مستوى الحفظ والتجويد.',
      openDate,
      closeDate,
      durationMinutes: Number(durationMinutes),
      totalMarks: totalPoints,
      passingMarks: Number(passingMarks),
      questions,
    });

    setSubTab('exams_list');
    setExamTitle('');
    setExamDesc('');
  };

  // Handle Approve Submission
  const handleApprove = (submissionId: string) => {
    store.approveSubmission(submissionId, adminFeedback);
    setSelectedSubmission(null);
    setAdminFeedback('');
  };

  const pendingSubmissions = submissions.filter((s) => s.status === 'pending_approval');
  const approvedSubmissions = submissions.filter((s) => s.status === 'approved');
  const leaderboard = store.getLeaderboard();

  return (
    <div className="space-y-6 text-right">
      
      {/* Navigation Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-xs font-bold">
            <Award className="w-4 h-4 text-amber-600" />
            <span>نظام الامتحانات والتصحيح الآلي والاعتماد</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
            إدارة الاختبارات واعتماد النتائج ولوحة الشرف
          </h2>
        </div>

        {/* Sub-tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSubTab('submissions')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              subTab === 'submissions' ? 'bg-amber-600 text-stone-950 shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>إجابات الطلاب ({pendingSubmissions.length} بانتظار الاعتماد)</span>
          </button>

          <button
            onClick={() => setSubTab('create_exam')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              subTab === 'create_exam' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-amber-300" />
            <span>إنشاء امتحان جديد للدورة</span>
          </button>

          <button
            onClick={() => setSubTab('exams_list')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              subTab === 'exams_list' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>الامتحانات الحالية ({exams.length})</span>
          </button>

          <button
            onClick={() => setSubTab('leaderboard')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              subTab === 'leaderboard' ? 'bg-emerald-950 text-amber-400 shadow-xs' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>لوحة المتفوقين (Leaderboard)</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: SUBMISSIONS & ADMIN APPROVAL (CRITICAL REQUIREMENT) */}
      {/* ========================================================= */}
      {subTab === 'submissions' && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm font-bold mb-0.5">آلية عمل التصحيح والاعتماد:</strong>
              يتم تصحيح الامتحان إلكترونياً وفورياً بناءً على نموذج الإجابة، <strong>ولا تظهر الدرجة للطالب إطلاقاً إلا بعد قيام الأدمن بالضغط على [اعتماد النتيجة]</strong>، وفور الاعتماد تضاف النتيجة لترتيب لوحة الشرف ويتلقى الطالب إشعاراً رسمياً.
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>إجابات بانتظار اعتماد الإدارة ({pendingSubmissions.length})</span>
            </h3>

            {pendingSubmissions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-stone-800">لا توجد إجابات معلقة حالياً</h4>
                <p className="text-xs text-stone-500">تم اعتماد كافة أوراق امتحانات الطلاب المسلمة.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-white rounded-xl border-2 border-amber-300 p-5 space-y-3.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md">
                        تم التصحيح الآلي · بانتظار اعتمادك
                      </span>
                      <span className="text-stone-400">{sub.submittedAt}</span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-stone-900">{sub.studentName}</h4>
                      <p className="text-xs text-emerald-800 font-semibold">{sub.examTitle}</p>
                      <p className="text-[11px] text-stone-500">واتساب: {sub.whatsappNumber}</p>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-700">الدرجة المحسوبة آلياً:</span>
                      <div className="text-left font-mono">
                        <strong className="text-lg text-emerald-900">{sub.score}</strong>
                        <span className="text-xs text-stone-500"> / {sub.totalMarks} ({sub.percentage}%)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        <span>مراجعة و[اعتماد النتيجة للطالب]</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approved Submissions History */}
          {approvedSubmissions.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-stone-200">
              <h3 className="text-sm font-bold text-stone-800">النتائج المعتمدة رسمياً ({approvedSubmissions.length})</h3>
              <div className="bg-white rounded-xl border border-stone-200 overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-3 font-bold">اسم الطالب</th>
                      <th className="py-2.5 px-3 font-bold">الامتحان</th>
                      <th className="py-2.5 px-3 font-bold">الدرجة المعتمدة</th>
                      <th className="py-2.5 px-3 font-bold">النسبة</th>
                      <th className="py-2.5 px-3 font-bold">تاريخ الاعتماد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {approvedSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-stone-50/60">
                        <td className="py-2.5 px-3 font-bold text-stone-900">{sub.studentName}</td>
                        <td className="py-2.5 px-3 text-stone-700">{sub.examTitle}</td>
                        <td className="py-2.5 px-3 font-bold text-emerald-800">{sub.score} / {sub.totalMarks}</td>
                        <td className="py-2.5 px-3 font-bold text-amber-700">{sub.percentage}%</td>
                        <td className="py-2.5 px-3 text-stone-500">{sub.approvedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: CREATE EXAM FORM WITH ANSWER KEY & TARGET COURSE    */}
      {/* ========================================================= */}
      {subTab === 'create_exam' && (
        <form onSubmit={handleCreateExam} className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-stone-900">إنشاء اختبار دوري جديد وتحديد نموذج الإجابة</h3>
              <p className="text-xs text-stone-500">يظهر الاختبار حصرياً لطلاب الدورة المحددة فقط</p>
            </div>
          </div>

          {/* Row 1: Target Course */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">
                الدورة المستهدفة <span className="text-red-500">* (يظهر الامتحان لطلابها فقط)</span>
              </label>
              <select
                value={targetCourseId}
                onChange={(e) => setTargetCourseId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 font-semibold"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.instructor})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">عنوان الامتحان <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder="مثال: الاختبار الدوري لأحكام الراءات والمدود"
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900"
              />
            </div>
          </div>

          {/* Row 2: Dates and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">تاريخ فتح الامتحان</label>
              <input
                type="date"
                required
                value={openDate}
                onChange={(e) => setOpenDate(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">تاريخ إغلاق الامتحان</label>
              <input
                type="date"
                required
                value={closeDate}
                onChange={(e) => setCloseDate(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">مدة الامتحان (بالدقائق)</label>
              <input
                type="number"
                min={5}
                max={120}
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
              />
            </div>
          </div>

          {/* Questions Builder with Answer Key */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-stone-900">
                أسئلة الامتحان ونموذج الإجابة النموذجي للتصحيح الآلي ({questions.length} أسئلة)
              </h4>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة سؤال آخر</span>
              </button>
            </div>

            {questions.map((q, qIdx) => (
              <div key={q.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950">السؤال #{qIdx + 1}:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-600">الدرجة:</span>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={q.points}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[qIdx].points = Number(e.target.value);
                        setQuestions(updated);
                      }}
                      className="w-16 bg-white border border-stone-300 rounded px-2 py-0.5 text-xs text-center"
                    />
                  </div>
                </div>

                <input
                  type="text"
                  required
                  placeholder="نص السؤال (مثال: ما هو حكم الميم الساكنة في...)"
                  value={q.text}
                  onChange={(e) => handleUpdateQuestionText(qIdx, e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs text-stone-900 font-medium"
                />

                {/* Options and radio for correct answer */}
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-semibold text-stone-600">
                    خيارات الإجابة (اختر الدائرة بجانب الإجابة الصحيحة لتكون نموذج التصحيح الآلي):
                  </div>
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${q.id}`}
                        checked={q.correctAnswerIndex === optIdx}
                        onChange={() => handleSetCorrectAnswer(qIdx, optIdx)}
                        className="cursor-pointer"
                        title="تحديد كإجابة صحيحة"
                      />
                      <input
                        type="text"
                        required
                        placeholder={`الخيار ${optIdx + 1}`}
                        value={opt}
                        onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                        className={`flex-1 bg-white border rounded-lg p-1.5 text-xs ${
                          q.correctAnswerIndex === optIdx ? 'border-emerald-500 bg-emerald-50/30' : 'border-stone-300'
                        }`}
                      />
                      {q.correctAnswerIndex === optIdx && (
                        <span className="text-[10px] text-emerald-700 font-bold">✓ الإجابة الصحيحة</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setSubTab('exams_list')}
              className="px-4 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-xl"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <Send className="w-4 h-4 text-amber-300" />
              <span>نشر الامتحان وإرسال تنبيه فوري لطلاب الدورة</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* TAB 3: EXAMS LIST                                         */}
      {/* ========================================================= */}
      {subTab === 'exams_list' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exams.map((ex) => (
              <div key={ex.id} className="bg-white rounded-xl border border-stone-200 p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold px-2.5 py-0.5 rounded-md">
                    {ex.courseTitle}
                  </span>
                  <span className="text-stone-400 font-mono">المدة: {ex.durationMinutes} دقيقة</span>
                </div>

                <h4 className="text-base font-bold text-stone-900">{ex.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{ex.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
                  <div>الدرجة الكلية: <strong className="text-stone-900 font-bold">{ex.totalMarks}</strong></div>
                  <div>عدد الأسئلة: <strong className="text-stone-900 font-bold">{ex.questions.length}</strong></div>
                  <div>تاريخ الإغلاق: {ex.closeDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: LEADERBOARD OF TOP STUDENTS (جدول ترتيب المتفوقين) */}
      {/* ========================================================= */}
      {subTab === 'leaderboard' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 rounded-2xl border border-emerald-800 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-500/40">
                <Trophy className="w-3.5 h-3.5" />
                <span>لوحة شرف الأكاديمية</span>
              </div>
              <h3 className="text-2xl font-bold">ترتيب المتفوقين في الاختبارات القرآنية</h3>
              <p className="text-xs text-stone-300">يتم ترتيب الطلاب آلياً من الأعلى درجة إلى الأقل وفق النتائج المعتمدة من أ/ سلوى بكر.</p>
            </div>
            <Award className="w-16 h-16 text-amber-400 opacity-80 hidden sm:block" />
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            {leaderboard.length === 0 ? (
              <div className="p-12 text-center text-xs text-stone-500">لا توجد نتائج معتمدة في لوحة الشرف حتى الآن.</div>
            ) : (
              <table className="w-full text-right text-xs">
                <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4 font-bold text-center">الترتيب</th>
                    <th className="py-3 px-4 font-bold">اسم الطالب</th>
                    <th className="py-3 px-4 font-bold">الاختبار القرآني</th>
                    <th className="py-3 px-4 font-bold">الدرجة</th>
                    <th className="py-3 px-4 font-bold">النسبة المئوية</th>
                    <th className="py-3 px-4 font-bold">التقدير</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {leaderboard.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3 px-4 text-center font-bold">
                        {idx === 0 && <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-stone-950 font-bold">🥇 1</span>}
                        {idx === 1 && <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-stone-200 text-stone-800 font-bold">🥈 2</span>}
                        {idx === 2 && <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white font-bold">🥉 3</span>}
                        {idx > 2 && <span className="text-stone-500 font-bold">{idx + 1}</span>}
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900">{item.studentName}</td>
                      <td className="py-3 px-4 text-stone-700">{item.examTitle}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-900">{item.score} / {item.totalMarks}</td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-700">{item.percentage}%</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          item.percentage >= 90 ? 'bg-emerald-100 text-emerald-900' : 'bg-blue-100 text-blue-900'
                        }`}>
                          {item.percentage >= 90 ? 'ممتاز مرتفع' : 'جيد جداً'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Review & Approve Submission Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden text-right">
            <div className="bg-emerald-950 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">اعتماد نتيجة الامتحان للطالب</h3>
              <button onClick={() => setSelectedSubmission(null)} className="text-stone-300 hover:text-white">✕</button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <div className="text-xs text-stone-500">اسم الطالب:</div>
                <div className="text-base font-bold text-stone-900">{selectedSubmission.studentName}</div>
                <div className="text-xs text-emerald-800">{selectedSubmission.examTitle}</div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center space-y-1">
                <div className="text-xs text-emerald-900 font-semibold">الدرجة الناتجة عن التصحيح الآلي:</div>
                <div className="text-2xl font-bold font-mono text-emerald-950">
                  {selectedSubmission.score} / {selectedSubmission.totalMarks}
                </div>
                <div className="text-xs text-amber-700 font-bold">{selectedSubmission.percentage}%</div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-800">
                  كلمة تشجيعية أو ملاحظة من إدارة الأكاديمية (أ/ سلوى بكر):
                </label>
                <input
                  type="text"
                  placeholder="مثال: بارك الله فيك، إجابات متميزة في أحكام التجويد."
                  value={adminFeedback}
                  onChange={(e) => setAdminFeedback(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="text-[11px] text-stone-500">
                بمجرد الضغط على [اعتماد النتيجة]، سيتمكن الطالب من رؤية ورقته ودرجته وإشعاره فوراً.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-md"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(selectedSubmission.id)}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                >
                  تأكيد [اعتماد النتيجة للطالب]
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
