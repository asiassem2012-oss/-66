import React, { useState } from 'react';
import { X, Send, Phone, MessageSquare, CreditCard, ExternalLink, CheckCircle } from 'lucide-react';
import { Course } from '../types';

interface EnrollModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (courseId: string, whatsapp: string, notes?: string) => void;
}

export const EnrollModal: React.FC<EnrollModalProps> = ({
  course,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [whatsapp, setWhatsapp] = useState('');
  const [countryCode, setCountryCode] = useState('+966');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = whatsapp.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 7) {
      setError('يرجى إدخال رقم واتساب صحيح للتواصل');
      return;
    }
    setError('');
    const fullNumber = cleanPhone.startsWith('+') ? cleanPhone : `${countryCode}${cleanPhone}`;
    
    onSubmit(course.id, fullNumber, notes);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden text-right">
        
        {/* Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-amber-400">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">طلب الانضمام للدورة</h3>
              <p className="text-xs text-emerald-200">أكاديمية تحفيظ وتجويد القرآن الكريم</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-stone-900">تم إرسال طلبك بنجاح!</h4>
            <p className="text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
              حالة الطلب الآن: <span className="text-amber-700 font-bold">معلق (قيد المراجعة)</span>. ستتواصل معك إدارة الأكاديمية عبر الواتساب فور القبول.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Course Summary Card */}
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-4 space-y-2">
              <div className="text-xs font-semibold text-emerald-800">الدورة المختارة:</div>
              <div className="text-base font-bold text-stone-900">{course.title}</div>
              <div className="text-xs text-stone-600 flex flex-wrap gap-x-4 gap-y-1 pt-1">
                <span>المعلم: {course.instructor}</span>
                <span>الموعد: {course.schedule}</span>
              </div>

              {/* Price / Payment info if paid */}
              {course.type === 'paid' ? (
                <div className="mt-2 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                    <CreditCard className="w-4 h-4" />
                    <span>رسوم الدورة: {course.price} {course.currency || 'ر.س'}</span>
                  </div>
                  {course.paymentLink && (
                    <a
                      href={course.paymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 underline font-medium"
                    >
                      <span>رابط الدفع الإلكتروني</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ) : (
                <div className="mt-2 pt-2 border-t border-emerald-200/60 text-xs text-emerald-700 font-semibold">
                  ✓ دورة مجانية لوجه الله تعالى
                </div>
              )}
            </div>

            {/* WhatsApp Phone Input (Required as requested) */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-stone-800">
                رقم الواتساب للتواصل <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-2 text-xs font-medium text-stone-700 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  dir="ltr"
                >
                  <option value="+966">+966 (السعودية)</option>
                  <option value="+20">+20 (مصر)</option>
                  <option value="+971">+971 (الإمارات)</option>
                  <option value="+965">+965 (الكويت)</option>
                  <option value="+974">+974 (قطر)</option>
                  <option value="+968">+968 (عمان)</option>
                  <option value="+962">+962 (الأردن)</option>
                  <option value="+212">+212 (المغرب)</option>
                  <option value="+216">+216 (تونس)</option>
                  <option value="+213">+213 (الجزائر)</option>
                </select>

                <div className="relative flex-1">
                  <input
                    type="tel"
                    required
                    placeholder="50 123 4567"
                    value={whatsapp}
                    onChange={(e) => {
                      setWhatsapp(e.target.value);
                      if (error) setError('');
                    }}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    dir="ltr"
                  />
                </div>
              </div>
              <p className="text-xs text-stone-500 leading-normal">
                هام: سيتم استخدام هذا الرقم لإرسال تفاصيل القبول ورابط الدرس الأونلاين عبر الواتساب.
              </p>
              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
            </div>

            {/* Optional Notes */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-stone-800">
                ملاحظات أو مستوى الحفظ الحالي (اختياري)
              </label>
              <textarea
                rows={2}
                placeholder="مثلاً: أحفظ 3 أجزاء، أود التركيز على أحكام المد والوقف..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Notice */}
            <div className="text-xs text-stone-500 bg-stone-50 p-3 rounded-lg border border-stone-200/70">
              بالضغط على "تأكيد وإرسال الطلب"، ستنتقل حالتك مباشرة إلى <strong className="text-amber-800">الطلبات المعلقة</strong> حتى تقوم الإدارة بالمراجعة والموافقة.
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm transition-colors shadow-sm cursor-pointer flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>تأكيد وإرسال طلب الانضمام</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
