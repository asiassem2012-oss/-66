import React, { useState } from 'react';
import { Database, X, Check, Copy, Flame, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { store } from '../lib/store';
import firebaseConfig from '../../firebase-applet-config.json';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'firebase' | 'supabase'>('firebase');
  const [supabaseUrl, setSupabaseUrl] = useState(() => {
    return localStorage.getItem('quran_supabase_url') || 'https://demo-quran-academy.supabase.co';
  });
  const [anonKey, setAnonKey] = useState(() => {
    return localStorage.getItem('quran_supabase_anon_key') || 'sb_anon_demo_key_quran_academy_2026';
  });
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('quran_supabase_url', supabaseUrl.trim());
    localStorage.setItem('quran_supabase_anon_key', anonKey.trim());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const sqlSchema = `-- ========================================================
-- Supabase / PostgreSQL Schema for Quran Academy
-- ========================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT CHECK (role IN ('admin', 'student')) DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  instructor TEXT NOT NULL,
  start_date DATE NOT NULL,
  schedule TEXT NOT NULL,
  type TEXT CHECK (type IN ('free', 'paid')) NOT NULL DEFAULT 'free',
  price NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'ر.س',
  payment_link TEXT,
  online_lesson_link TEXT NOT NULL,
  level TEXT DEFAULT 'متوسط',
  max_students INT DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.enrollment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  notes TEXT,
  rejection_reason TEXT,
  requested_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.enrolled_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES public.enrollment_requests(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  joined_date DATE DEFAULT CURRENT_DATE,
  attendance_rate INT DEFAULT 100
);
`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetData = () => {
    if (window.confirm('هل تريد إعادة تعيين بيانات التطبيق إلى البيانات النموذجية الأولية؟')) {
      store.resetToDefault();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden text-right">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white p-5 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">إعدادات قاعدة البيانات والربط السحابي</h3>
              <p className="text-xs text-amber-300">Firebase Firestore & Cloud Architecture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Firebase vs Supabase */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('firebase')}
            className={`py-2 px-4 text-xs font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'firebase'
                ? 'bg-white text-emerald-950 border-t-2 border-amber-500 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Firebase (نشط ومُهيأ)</span>
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`py-2 px-4 text-xs font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'supabase'
                ? 'bg-white text-emerald-950 border-t-2 border-emerald-700 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-700" />
            <span>Supabase / PostgreSQL SQL</span>
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {activeTab === 'firebase' ? (
            <div className="space-y-5">
              {/* Active Firebase Cloud State */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-bold text-emerald-950">
                      قاعدة بيانات Firebase Firestore مهيأة ومربوطة بنجاح
                    </span>
                  </div>
                  <span className="text-[11px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                    Cloud Provisioned
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 border-t border-emerald-200/60">
                  <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                    <span className="text-stone-500 block text-[11px]">معرّف المشروع (Project ID):</span>
                    <strong className="text-stone-800 font-mono" dir="ltr">{firebaseConfig.projectId}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                    <span className="text-stone-500 block text-[11px]">معرّف قاعدة البيانات (Database ID):</span>
                    <strong className="text-stone-800 font-mono text-[11px] truncate block" dir="ltr">
                      {firebaseConfig.firestoreDatabaseId}
                    </strong>
                  </div>
                </div>

                <div className="text-xs text-stone-600 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>تم نشر قواعد الحماية الأمنية (firestore.rules) لمنع التعديل غير المصرح به.</span>
                </div>
              </div>

              {/* Collections Status */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-800">
                  المجموعات (Collections) النشطة في قاعدة البيانات:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg">
                    <div className="font-mono text-stone-900 font-bold" dir="ltr">/courses</div>
                    <div className="text-[11px] text-stone-500">حلقات ودورات القرآن</div>
                  </div>
                  <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg">
                    <div className="font-mono text-stone-900 font-bold" dir="ltr">/enrollment_requests</div>
                    <div className="text-[11px] text-stone-500">طلبات الواتساب المعلقة</div>
                  </div>
                  <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg">
                    <div className="font-mono text-stone-900 font-bold" dir="ltr">/enrolled_students</div>
                    <div className="text-[11px] text-stone-500">الطلاب المقبولين بالحلقات</div>
                  </div>
                  <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg">
                    <div className="font-mono text-stone-900 font-bold" dir="ltr">/messages</div>
                    <div className="text-[11px] text-stone-500">إشعارات وروابط الدروس</div>
                  </div>
                  <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg">
                    <div className="font-mono text-stone-900 font-bold" dir="ltr">/profiles</div>
                    <div className="text-[11px] text-stone-500">أدوار المشرفين والطلاب</div>
                  </div>
                  <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-center">
                    <button
                      onClick={handleResetData}
                      className="text-xs text-stone-600 hover:text-emerald-800 font-semibold"
                    >
                      إعادة تهيئة البيانات
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-5">
              {/* Supabase SQL Migration Script */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>مخطط جداول SQL الجاهزة للتنفيذ في Supabase SQL Editor:</span>
                  </label>
                  <button
                    onClick={handleCopySql}
                    className="text-xs text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-md cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'تم النسخ!' : 'نسخ كود SQL'}</span>
                  </button>
                </div>

                <pre className="p-3 bg-stone-900 text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed" dir="ltr">
                  {sqlSchema}
                </pre>
              </div>

              {/* Supabase Connection Form */}
              <form onSubmit={handleSave} className="space-y-3 pt-3 border-t border-stone-200">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-800">
                    Supabase Project URL (اختياري للربط السحابي بـ Supabase)
                  </label>
                  <input
                    type="text"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://your-project.supabase.co"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs font-mono text-stone-900"
                    dir="ltr"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  {saveSuccess && (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      <span>تم حفظ التكوين بنجاح</span>
                    </span>
                  )}
                  <button
                    type="submit"
                    className="mr-auto px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    حفظ إعدادات Supabase
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
