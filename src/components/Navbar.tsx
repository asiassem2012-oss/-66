import React, { useState } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Clock, 
  Bell, 
  ShieldCheck, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  Database, 
  Flame,
  Menu, 
  X,
  Sparkles,
  Award,
  UserCheck,
  Settings,
  Star
} from 'lucide-react';
import { User, ActiveTab } from '../types';
import { store } from '../lib/store';

interface NavbarProps {
  currentUser: User | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingCount: number;
  unreadMessagesCount: number;
  onOpenAuth: () => void;
  onOpenSupabase: () => void;
  onOpenFeedback: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  pendingCount,
  unreadMessagesCount,
  onOpenAuth,
  onOpenSupabase,
  onOpenFeedback,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const settings = store.getSettings();

  const isAdmin = currentUser?.role === 'admin';

  const handleRoleToggle = () => {
    store.switchRole(isAdmin ? 'student' : 'admin');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-emerald-950 text-emerald-100 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-400">أكاديمية {settings.academyName}:</span>
          <span>إدارة <strong className="text-white">{settings.directorName}</strong></span>
          <span className="hidden sm:inline text-stone-400">· هاتف الإدارة: {settings.contactPhone}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRoleToggle}
            className="text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-sm transition-colors flex items-center gap-1 cursor-pointer"
            title="تبديل فوري لتجربة الصلاحيات"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{isAdmin ? 'تحويل لحساب طالب' : 'تحويل لحساب الإدارة (أ/ سلوى)'}</span>
          </button>

          <button
            onClick={onOpenSupabase}
            className="text-stone-200 hover:text-white flex items-center gap-1.5 cursor-pointer bg-emerald-900/60 px-2 py-0.5 rounded-sm border border-emerald-700/60"
            title="إعدادات قاعدة بيانات Firebase و Supabase"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span className="hidden sm:inline font-semibold text-amber-300">Firebase متصل</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Wordmark (Zone 1) */}
          <div 
            onClick={() => setActiveTab(isAdmin ? 'admin-courses' : 'courses')}
            className="flex items-center gap-3 cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-900 text-amber-400 flex items-center justify-center shadow-xs border border-amber-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg font-bold text-emerald-950 leading-tight">
                أكاديمية أهل القرآن
              </div>
              <div className="text-xs text-amber-700 font-semibold">
                إدارة {settings.directorName}
              </div>
            </div>
          </div>

          {/* Navigation Links (Zone 2) */}
          <nav className="hidden xl:flex items-center gap-1">
            {!isAdmin ? (
              // Student Nav Links
              <>
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer ${
                    activeTab === 'courses' ? 'bg-emerald-50 text-emerald-950 font-bold' : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  الدورات المتاحة
                </button>

                <button
                  onClick={() => setActiveTab('my-courses')}
                  className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'my-courses' ? 'bg-emerald-50 text-emerald-950 font-bold' : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-emerald-700" />
                  <span>دوراتي</span>
                </button>

                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'pending' ? 'bg-emerald-50 text-emerald-950 font-bold' : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>الطلبات المعلقة</span>
                  {pendingCount > 0 && (
                    <span className="bg-amber-100 text-amber-900 text-xs px-1.5 py-0.5 rounded-full font-bold">
                      {pendingCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('exams')}
                  className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'exams' ? 'bg-amber-50 text-amber-950 font-bold border border-amber-200' : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>الامتحانات والنتائج</span>
                </button>

                <button
                  onClick={() => setActiveTab('messages')}
                  className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'messages' ? 'bg-emerald-50 text-emerald-950 font-bold' : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Bell className="w-4 h-4 text-stone-600" />
                  <span>الرسائل</span>
                  {unreadMessagesCount > 0 && (
                    <span className="bg-emerald-700 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                      {unreadMessagesCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={onOpenFeedback}
                  className="px-2.5 py-1.5 text-xs text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors cursor-pointer flex items-center gap-1 border border-amber-200"
                  title="تقييم الأكاديمية والدورات"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>تقييم الأكاديمية</span>
                </button>
              </>
            ) : (
              // Admin Nav Links
              <>
                <button
                  onClick={() => setActiveTab('admin-courses')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'admin-courses' ? 'bg-emerald-50 text-emerald-950' : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                  <span>الدورات</span>
                </button>

                <button
                  onClick={() => setActiveTab('admin-pending')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'admin-pending' ? 'bg-emerald-50 text-emerald-950' : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>الطلبات ({pendingCount})</span>
                </button>

                <button
                  onClick={() => setActiveTab('admin-students')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'admin-students' ? 'bg-emerald-50 text-emerald-950' : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                  <span>الطلاب</span>
                </button>

                <button
                  onClick={() => setActiveTab('admin-exams')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'admin-exams' ? 'bg-amber-100 text-amber-950 border border-amber-300' : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  <span>الامتحانات والاعتماد</span>
                </button>

                <button
                  onClick={() => setActiveTab('admin-teachers')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'admin-teachers' ? 'bg-emerald-50 text-emerald-950' : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>المشايخ</span>
                </button>

                <button
                  onClick={() => setActiveTab('admin-settings')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'admin-settings' ? 'bg-emerald-50 text-emerald-950' : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5 text-stone-600" />
                  <span>الإعدادات</span>
                </button>
              </>
            )}
          </nav>

          {/* User Profile & Actions (Zone 3) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 border border-stone-200 bg-stone-50/80 px-2.5 py-1 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-stone-900 truncate max-w-[120px]">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-stone-500">
                      {isAdmin ? 'إدارة الأكاديمية' : 'طالب مسجل'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => store.logout()}
                  className="p-2 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-300" />
                <span>تسجيل الدخول</span>
              </button>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-stone-200 p-4 space-y-2 text-right">
          {!isAdmin ? (
            <>
              <button onClick={() => { setActiveTab('courses'); setMobileMenuOpen(false); }} className="w-full text-right p-2 text-xs font-bold">الدورات المتاحة</button>
              <button onClick={() => { setActiveTab('my-courses'); setMobileMenuOpen(false); }} className="w-full text-right p-2 text-xs font-bold">دوراتي وحلقاتي</button>
              <button onClick={() => { setActiveTab('pending'); setMobileMenuOpen(false); }} className="w-full text-right p-2 text-xs font-bold">الطلبات المعلقة ({pendingCount})</button>
              <button onClick={() => { setActiveTab('exams'); setMobileMenuOpen(false); }} className="w-full text-right p-2 text-xs font-bold text-amber-800">الاختبارات والنتائج</button>
              <button onClick={() => { setActiveTab('messages'); setMobileMenuOpen(false); }} className="w-full text-right p-2 text-xs font-bold">الرسائل والإشعارات ({unreadMessagesCount})</button>
              <button onClick={() => { onOpenFeedback(); setMobileMenuOpen(false); }} className="w-full text-right p-2 text-xs font-bold text-emerald-800">تقييم الأكاديمية</button>
            </>
          ) : (
            <>
              <button onClick={() => { setActiveTab('admin-courses'); setMobileMenuOpen(false); }} className="w-full text-right p-2 text-xs font-bold">إدارة الدورات والحلقات</button>
              <button onClick={() => { setActiveTab('admin-pending'); setMobileMenuOpen(false); }} className="w-full text-right p-2 text-xs font-bold">الطلبات المعلقة ({pendingCount})</button>
              <button onClick={() => { setActiveTab('admin-students'); setMobileMenuOpen(false); }} className="w-full text-right p-2 text-xs font-bold">إدارة الطلاب المقبولين</button>
              <button onClick={() => { setActiveTab('admin-exams'); setMobileMenuOpen(false); }} className="w-full text-right p-2 text-xs font-bold text-amber-800">الامتحانات والاعتماد ولوحة الشرف</button>
              <button onClick={() => { setActiveTab('admin-teachers'); setMobileMenuOpen(false); }} className="w-full text-right p-2 text-xs font-bold">إدارة المشايخ والمعلمين</button>
              <button onClick={() => { setActiveTab('admin-settings'); setMobileMenuOpen(false); }} className="w-full text-right p-2 text-xs font-bold">إعدادات الأكاديمية وكلمة المرور</button>
            </>
          )}

          <div className="pt-2 border-t border-stone-200">
            <button
              onClick={() => { handleRoleToggle(); setMobileMenuOpen(false); }}
              className="w-full text-center py-2 text-xs font-bold bg-emerald-950 text-amber-300 rounded-lg"
            >
              التبديل إلى: {isAdmin ? 'طالب مسجل' : 'إدارة الأكاديمية (أ/ سلوى بكر)'}
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
