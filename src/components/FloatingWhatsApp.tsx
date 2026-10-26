import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  phone?: string;
  directorName?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phone = '01093165437',
  directorName = 'أ/ سلوى بكر',
}) => {
  // Egypt international format: +20 1093165437
  const cleanPhone = phone.replace(/^0/, '20');
  const message = encodeURIComponent(
    `السلام عليكم ورحمة الله، أتواصل مع إدارة أكاديمية أهل القرآن (إدارة ${directorName}) بخصوص الاستفسار والتسجيل في الحلقات القرآنية.`
  );
  const waUrl = `https://wa.me/${cleanPhone}?text=${message}`;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 group">
      {/* Tooltip banner on hover */}
      <div className="hidden sm:flex items-center bg-emerald-950/95 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-lg border border-emerald-700/80 transform translate-x-1 group-hover:translate-x-0 transition-all pointer-events-none">
        <div className="text-right">
          <div className="text-amber-300 font-bold">تواصل مباشر مع الإدارة</div>
          <div className="text-[11px] text-stone-300">{directorName} · {phone}</div>
        </div>
      </div>

      {/* Floating Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="مراسلة إدارة الأكاديمية عبر الواتساب"
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white cursor-pointer relative"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full" />
        <MessageCircle className="w-8 h-8 fill-current" />
      </a>
    </div>
  );
};
