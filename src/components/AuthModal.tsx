import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  GraduationCap, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  Sparkles,
  CheckCircle2,
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { User, UserRole } from '../types';
import { store } from '../lib/store';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  forced?: boolean; // When mandatory login is required
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  forced = false,
}) => {
  const [tab, setTab] = useState<'student_login' | 'student_register' | 'admin_login'>('student_login');
  
  // Student Login/Register
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Admin Login
  const [adminUsername, setAdminUsername] = useState('admin_salwa');
  const [adminPassword, setAdminPassword] = useState('salwa_quran_2026');

  const [message, setMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  if (!isOpen) return null;

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage({ text: 'يرجى إدخال البريد الإلكتروني أو اسم المستخدم', isError: true });
      return;
    }
    const res = store.loginWithCredentials(email, password);
    setMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 1000);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = store.loginWithCredentials(adminUsername, adminPassword);
    setMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 1000);
    }
  };

  const handleStudentRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setMessage({ text: 'يرجى إدخال كافة البيانات ورقم الواتساب الصحيح لمنع الحسابات الوهمية', isError: true });
      return;
    }
    store.register(name.trim(), email.trim(), 'student', phone.trim());
    setMessage({ text: `تم إنشاء حسابك بنجاح يا ${name}! مرحباً بك في أكاديمية أهل القرآن.` });
    setTimeout(() => {
      setMessage(null);
      onClose();
    }, 1200);
  };

  const handleQuickRole = (role: UserRole) => {
    store.switchRole(role);
    setMessage({ text: `تم التبديل بنجاح إلى حساب ${role === 'admin' ? 'الإدارة (أ/ سلوى بكر)' : 'الطالب'}` });
    setTimeout(() => {
      setMessage(null);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden text-right">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white p-5 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">بوابة تسجيل الدخول الإجباري</h3>
              <p className="text-xs text-amber-300">أكاديمية أهل القرآن (إدارة أ/ سلوى بكر)</p>
            </div>
          </div>
          {!forced && (
            <button
              onClick={onClose}
              className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Current Active Account Indicator */}
        {currentUser && (
          <div className="bg-stone-50 border-b border-stone-200 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-amber-300 font-bold flex items-center justify-center text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">{currentUser.name}</div>
                <div className="text-[10px] text-stone-500">{currentUser.email}</div>
              </div>
            </div>
            <button
              onClick={() => store.logout()}
              className="text-xs text-red-600 hover:text-red-800 font-semibold"
            >
              تسجيل الخروج
            </button>
          </div>
        )}

        {/* Fast 1-Click Evaluation Switchers */}
        <div className="p-3 bg-amber-50/70 border-b border-amber-200/80 space-y-1.5">
          <div className="text-[11px] font-bold text-amber-950 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>تسجيل فوري للاختبار والتقييم:</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickRole('admin')}
              className={`p-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                currentUser?.role === 'admin'
                  ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-xs'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
              <span>دخول إدارة الأكاديمية</span>
            </button>

            <button
              onClick={() => handleQuickRole('student')}
              className={`p-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                currentUser?.role === 'student'
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-300" />
              <span>دخول طالب مسجل</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 text-xs font-bold">
          <button
            onClick={() => { setTab('student_login'); setMessage(null); }}
            className={`flex-1 py-2.5 transition-colors cursor-pointer ${
              tab === 'student_login'
                ? 'bg-white text-emerald-950 border-b-2 border-emerald-800'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            دخول الطالب
          </button>
          <button
            onClick={() => { setTab('student_register'); setMessage(null); }}
            className={`flex-1 py-2.5 transition-colors cursor-pointer ${
              tab === 'student_register'
                ? 'bg-white text-emerald-950 border-b-2 border-emerald-800'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            حساب جديد
          </button>
          <button
            onClick={() => { setTab('admin_login'); setMessage(null); }}
            className={`flex-1 py-2.5 transition-colors cursor-pointer ${
              tab === 'admin_login'
                ? 'bg-white text-amber-900 border-b-2 border-amber-600'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            لوحة الإدارة
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {message && (
            <div className={`p-3 rounded-lg text-xs font-bold mb-4 flex items-center gap-2 ${
              message.isError
                ? 'bg-red-50 border border-red-200 text-red-800'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            }`}>
              {message.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          {/* TAB 1: STUDENT LOGIN */}
          {tab === 'student_login' && (
            <div className="space-y-4">
              {/* Google Button */}
              <button
                type="button"
                onClick={async () => {
                  const res = await store.loginWithGoogle();
                  setMessage({ text: res.message, isError: !res.success });
                  if (res.success) {
                    setTimeout(() => {
                      setMessage(null);
                      onClose();
                    }, 1000);
                  }
                }}
                className="w-full py-2.5 px-3 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>الدخول السريع عبر Google (Firebase)</span>
              </button>

              <div className="relative my-2 text-center">
                <span className="bg-white px-2 text-[10px] text-stone-400 font-semibold relative z-10">
                  أو بالبريد الإلكتروني
                </span>
                <div className="absolute inset-0 top-2 border-t border-stone-200" />
              </div>

              <form onSubmit={handleStudentLogin} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-800">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="student@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-3 pr-8 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500"
                      dir="ltr"
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-800">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-3 pr-8 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500"
                      dir="ltr"
                    />
                    <Lock className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <LogIn className="w-4 h-4 text-amber-300" />
                  <span>دخول إلى حساب الطالب</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: STUDENT REGISTER (Real info to prevent fake accounts) */}
          {tab === 'student_register' && (
            <form onSubmit={handleStudentRegister} className="space-y-3">
              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-900 leading-normal">
                تسجيل الدخول والبيانات إجباري لمنع الحسابات الوهمية وضمان التواصل الفوري مع الإدارة.
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-800">
                  الاسم الرباعي للطالب <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="مثال: عبد الله أحمد حسن"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg pr-8 pl-3 py-2 text-xs text-stone-900"
                  />
                  <UserIcon className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-800">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-3 pr-8 py-2 text-xs text-stone-900"
                    dir="ltr"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-800">
                  رقم الواتساب الفعلي (مطلوب للتأكيد) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="010XXXXXXXX أو +2010..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-3 pr-8 py-2 text-xs text-stone-900"
                    dir="ltr"
                  />
                  <Phone className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-800">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-3 pr-8 py-2 text-xs text-stone-900"
                    dir="ltr"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <UserPlus className="w-4 h-4 text-amber-300" />
                <span>إنشاء الحساب وبدء التعلم</span>
              </button>
            </form>
          )}

          {/* TAB 3: ADMIN LOGIN (Username & Password protected) */}
          {tab === 'admin_login' && (
            <form onSubmit={handleAdminLogin} className="space-y-3.5">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-700" />
                  <span>دخول مخصص لإدارة الأكاديمية (أ/ سلوى بكر)</span>
                </div>
                <p className="text-[11px] text-stone-600">
                  لوحة التحكم محمية بكلمة سر مخصصة، ويمكنك تعديل بيانات الدخول من صفحة الإعدادات في أي وقت.
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-800">
                  اسم المستخدم (Username)
                </label>
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="admin_salwa"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 font-mono"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-800">
                  كلمة مرور الإدارة (Password)
                </label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 font-mono"
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>دخول لوحة تحكم الإدارة</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
