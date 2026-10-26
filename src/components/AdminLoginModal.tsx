import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  X, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { store } from '../lib/store';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState('admin_salwa');
  const [password, setPassword] = useState('salwa_quran_2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور');
      setIsLoading(false);
      return;
    }

    const res = store.loginAdmin(username.trim(), password.trim());
    setIsLoading(false);

    if (res.success) {
      setSuccess(res.message);
      setTimeout(() => {
        setSuccess(null);
        onClose();
        onSuccess();
      }, 700);
    } else {
      setError(res.message || 'اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden text-right animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white p-5 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">تسجيل دخول إدارة الأكاديمية</h3>
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

        {/* Security Notice */}
        <div className="bg-amber-50 border-b border-amber-200 p-3.5 flex items-start gap-2.5">
          <KeyRound className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 leading-relaxed">
            لوحة الإدارة محمية برمز أمان خاص. يُرجى إدخال اسم مستخدم الإدارة وكلمة المرور المعتمدة للمتابعة والتحكم في الحلقات والطلاب.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              اسم مستخدم الإدارة
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم مستخدم الأدمن"
                className="w-full pl-3 pr-10 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                required
              />
              <UserIcon className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              كلمة مرور الإدارة
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة مرور الأدمن"
                className="w-full pl-10 pr-10 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                required
              />
              <Lock className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Credential Helper Banner */}
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 text-[11px] text-stone-600 space-y-1">
            <div className="font-semibold text-stone-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>بيانات الدخول الافتراضية المعتمدة:</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-1 text-stone-700 pt-0.5">
              <span>اسم المستخدم: <code className="bg-white px-1.5 py-0.5 rounded border border-stone-200 font-mono text-emerald-800 font-bold">admin_salwa</code></span>
              <span>كلمة المرور: <code className="bg-white px-1.5 py-0.5 rounded border border-stone-200 font-mono text-emerald-800 font-bold">salwa_quran_2026</code></span>
            </div>
            <p className="text-[10px] text-stone-500 pt-1 border-t border-stone-200">
              * يمكنك تغيير اسم المستخدم وكلمة المرور في أي وقت بعد الدخول من تبويب «إعدادات الأكاديمية».
            </p>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>{isLoading ? 'جاري التحقق...' : 'دخول لوحة تحكم الإدارة'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
