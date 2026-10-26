import React from 'react';
import { 
  Clock, 
  Phone, 
  MessageCircle, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { EnrollmentRequest } from '../types';

interface PendingRequestsViewProps {
  requests: EnrollmentRequest[];
  currentUserId: string;
  onExploreCourses: () => void;
  onCancelRequest: (requestId: string) => void;
}

export const PendingRequestsView: React.FC<PendingRequestsViewProps> = ({
  requests,
  currentUserId,
  onExploreCourses,
  onCancelRequest,
}) => {
  // Filter for this student
  const studentRequests = requests.filter((r) => r.userId === currentUserId);
  const pendingRequests = studentRequests.filter((r) => r.status === 'pending');
  const pastRequests = studentRequests.filter((r) => r.status !== 'pending');

  return (
    <div className="space-y-8 text-right">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full text-xs text-amber-800 font-semibold border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>متابعة حالة الاشتراكات</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
          طلبات الالتحاق المعلقة وفي انتظار الموافقة
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
          توضح هذه الصفحة جميع الدورات التي أرسلت طلب انضمام إليها. تقوم إدارة الأكاديمية بمراجعة الطلبات والتحقق من رقم الواتساب قبل تأكيد القبول وتفعيل رابط الدرس.
        </p>
      </div>

      {/* Active Pending Requests */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>الطلبات قيد المراجعة حالياً ({pendingRequests.length})</span>
        </h3>

        {pendingRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-base font-bold text-stone-800">لا توجد طلبات معلقة حالياً</h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              جميع طلباتك تمت مراجعتها، أو لم تقم بالتسجيل في دورة جديدة بعد. يمكنك استعراض الدورات المتاحة والتسجيل.
            </p>
            <div className="pt-2">
              <button
                onClick={onExploreCourses}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <span>استعراض الدورات المتاحة</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-amber-200/80 shadow-xs p-5 space-y-4 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 left-0 h-1 bg-amber-500" />

                {/* Status Bar */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 animate-spin-slow text-amber-600" />
                    <span>قيد المراجعة بواسطة إدارة الأكاديمية</span>
                  </span>
                  <span className="text-stone-400">{req.requestedAt}</span>
                </div>

                {/* Course Title */}
                <div>
                  <h4 className="text-base font-bold text-stone-900 leading-snug">
                    {req.courseTitle}
                  </h4>
                </div>

                {/* Registered Phone */}
                <div className="bg-stone-50 border border-stone-200/80 rounded-lg p-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-stone-600">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-700" />
                      <span>رقم الواتساب المسجل:</span>
                    </span>
                    <strong className="text-stone-900 font-mono" dir="ltr">
                      {req.whatsappNumber}
                    </strong>
                  </div>

                  {req.notes && (
                    <div className="text-stone-500 pt-1 border-t border-stone-200/60">
                      <span>ملاحظاتك: </span>
                      <span className="text-stone-700">{req.notes}</span>
                    </div>
                  )}
                </div>

                {/* Guidance message */}
                <div className="text-[11px] text-stone-500 leading-relaxed bg-amber-50/50 p-2.5 rounded-lg border border-amber-100 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    ستقوم الإدارة بالاتصال بك أو مراسلتك عبر الواتساب لتأكيد الموعد وإرسال رابط حلقة الدرس.
                  </span>
                </div>

                {/* Action button */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => onCancelRequest(req.id)}
                    className="text-xs text-stone-400 hover:text-red-600 font-medium transition-colors cursor-pointer"
                  >
                    إلغاء هذا الطلب
                  </button>

                  <a
                    href={`https://wa.me/966509876543?text=${encodeURIComponent(`السلام عليكم، أود الاستفسار عن حالة طلبي في دورة: ${req.courseTitle}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-emerald-800 hover:text-emerald-950 font-bold bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>مراسلة المشرف</span>
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Previously Reviewed History */}
      {pastRequests.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-stone-200">
          <h3 className="text-sm font-bold text-stone-700">
            سجل الطلبات السابقة ({pastRequests.length})
          </h3>

          <div className="space-y-2">
            {pastRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-lg border border-stone-200 p-3.5 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-stone-900">{req.courseTitle}</div>
                  <div className="text-stone-500">تاريخ الطلب: {req.requestedAt}</div>
                  {req.rejectionReason && (
                    <div className="text-red-600 text-[11px]">السبب: {req.rejectionReason}</div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {req.status === 'accepted' ? (
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                      <span>تم القبول والاعتماد</span>
                    </span>
                  ) : (
                    <span className="bg-stone-100 text-stone-700 font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-red-500" />
                      <span>مرفوض أو ملغى</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
