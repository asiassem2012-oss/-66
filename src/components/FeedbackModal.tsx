import React, { useState } from 'react';
import { Star, X, Send, Heart, CheckCircle2 } from 'lucide-react';
import { store } from '../lib/store';
import { Course } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  courses,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedCourse, setSelectedCourse] = useState<string>('تقييم عام للأكاديمية');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    store.addFeedback(rating, comment.trim(), selectedCourse);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setComment('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden text-right">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white p-5 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">تقييم تجربة الطالب</h3>
              <p className="text-xs text-amber-300">أكاديمية أهل القرآن (إدارة أ/ سلوى بكر)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-stone-900">شكراً جزيلاً لتقييمك الكريم!</h4>
            <p className="text-xs text-stone-600">
              تسعد إدارة الأكاديمية (أ/ سلوى بكر) بملاحظاتكم لتطوير جودة الحلقات ومتابعة إتقان كتاب الله.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Star Rating Selector */}
            <div className="text-center space-y-2 py-2 bg-stone-50 rounded-xl border border-stone-200/80">
              <div className="text-xs font-bold text-stone-800">ما هو تقييمك لمستوى الحلقات والمتابعة؟</div>
              <div className="flex items-center justify-center gap-1.5" dir="ltr">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-hidden"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-[11px] font-semibold text-emerald-800">
                {rating === 5 && 'ممتاز جداً - بارك الله في جهود الأكاديمية'}
                {rating === 4 && 'جيد جداً - حلقة متميزة'}
                {rating === 3 && 'جيد - مستوى مرضي'}
                {rating === 2 && 'مقبول - يحتاج لتحسين'}
                {rating === 1 && 'دون المستوى'}
              </div>
            </div>

            {/* Target Course */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">
                تقييم خاص بـ:
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="تقييم عام للأكاديمية">تقييم عام للأكاديمية وإدارة أ/ سلوى بكر</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Comment */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">
                رأيك وتوصياتك للإدارة <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="اكتب انطباعك عن الشرح، الالتزام بالمواعيد، وتجويد التلاوة..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5 text-amber-300" />
                <span>إرسال التقييم</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
