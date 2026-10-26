import React from 'react';
import { Sparkles, CheckCircle2, Video, Award } from 'lucide-react';

interface HeroBannerProps {
  onExploreCourses: () => void;
  onMyCourses: () => void;
  isAdmin: boolean;
  onAdminAddCourse: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreCourses,
  onMyCourses,
  isAdmin,
  onAdminAddCourse,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white border-b border-emerald-800">
      {/* Subtle arabesque background pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10 bg-repeat pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(212, 175, 55, 0.25) 2%, transparent 0%)`,
          backgroundSize: '100px 100px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left / Main text content */}
          <div className="lg:col-span-7 space-y-6 text-right">
            
            {/* Spiritual Quote Header */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-700/60 text-amber-300 text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-quran text-base sm:text-lg">«خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ»</span>
              <span className="text-emerald-300 text-xs">· صحيح البخاري</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              أكاديمية
              <span className="text-amber-400 mr-2 font-quran text-4xl sm:text-5xl lg:text-6xl font-normal">
                أهل القرآن
              </span>
              <span className="block text-emerald-200 text-lg sm:text-2xl font-bold mt-2">
                برعاية وإدارة: أ/ سلوى بكر
              </span>
            </h1>

            {/* Secondary Prose */}
            <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-2xl font-light">
              صرح قرآني رائد لإتقان التلاوة وتصحيح مخارج الحروف وحفظ كتاب الله. حلقات مباشرة عبر (Zoom / Google Meet) تُفتح روابطها قبل موعد الحلقة بـ 30 دقيقة، مع نظام امتحانات ذكي وتصحيح آلي معتمد ولوحة شرف للمتفوقين.
            </p>

            {/* Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 bg-emerald-900/60 border border-emerald-700/50 p-2.5 rounded-lg text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>حلقات مباشرة وتصحيح فوري</span>
              </div>
              <div className="flex items-center gap-2.5 bg-emerald-900/60 border border-emerald-700/50 p-2.5 rounded-lg text-xs sm:text-sm">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>إجازات وأسانيد متصلة</span>
              </div>
              <div className="flex items-center gap-2.5 bg-emerald-900/60 border border-emerald-700/50 p-2.5 rounded-lg text-xs sm:text-sm">
                <Video className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>روابط الدروس وحفظ المواعيد</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              {!isAdmin ? (
                <>
                  <button
                    onClick={onExploreCourses}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-lg text-sm sm:text-base shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>تصفح الدورات والتسجيل</span>
                  </button>
                  <button
                    onClick={onMyCourses}
                    className="px-5 py-3 bg-emerald-800/90 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm sm:text-base border border-emerald-600 transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Video className="w-4 h-4 text-amber-400" />
                    <span>الانتقال إلى دوراتي المباشرة</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onAdminAddCourse}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-lg text-sm sm:text-base shadow-md transition-all cursor-pointer"
                  >
                    <span>+ إضافة دورة وحلقة جديدة</span>
                  </button>
                  <button
                    onClick={onExploreCourses}
                    className="px-5 py-3 bg-emerald-800/90 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm sm:text-base border border-emerald-600 transition-colors cursor-pointer"
                  >
                    <span>عرض الدورات كما يراها الطالب</span>
                  </button>
                </>
              )}
            </div>

          </div>

          {/* Right Image Canvas */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-2xl bg-emerald-900">
              <img
                src="/src/assets/images/hero_quran_academy_1793044519373.jpg"
                alt="المصحف الشريف وأجواء حلقات التحفيظ"
                className="w-full h-[280px] sm:h-[360px] object-cover object-center transform hover:scale-102 transition-transform duration-500"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/30 to-transparent" />
              
              {/* Floating Bottom Card on Image */}
              <div className="absolute bottom-3 right-3 left-3 p-3 bg-emerald-950/85 backdrop-blur-md rounded-xl border border-emerald-700/60 text-right">
                <div className="text-amber-400 font-quran text-lg leading-tight">
                  «وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا»
                </div>
                <div className="text-xs text-stone-300 mt-1">
                  دورات متخصصة تبدأ أسبوعياً مع نخبة من القراء المجازين
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
