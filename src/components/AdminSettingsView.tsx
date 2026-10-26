import React, { useState } from 'react';
import { ShieldCheck, KeyRound, Phone, MapPin, Save, Check, RefreshCw, UserCheck } from 'lucide-react';
import { store } from '../lib/store';
import { AcademySettings } from '../types';

export const AdminSettingsView: React.FC = () => {
  const currentCreds = store.getAdminCredentials();
  const currentSettings = store.getSettings();

  // Admin Credentials form
  const [username, setUsername] = useState(currentCreds.username);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [credMsg, setCredMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  // Academy Info form
  const [settings, setSettings] = useState<AcademySettings>(currentSettings);
  const [settingsMsg, setSettingsMsg] = useState<string | null>(null);

  const handleUpdateCreds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setCredMsg({ text: 'يجب أن لا تقل كلمة المرور الجديدة عن 6 أحرف', isError: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      setCredMsg({ text: 'كلمتا المرور غير متطابقتين', isError: true });
      return;
    }
    store.updateAdminCredentials(username.trim(), newPassword.trim());
    setCredMsg({ text: 'تم تحديث اسم مستخدم وكلمة مرور الأدمن بنجاح!' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setCredMsg(null), 3000);
  };

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings(settings);
    setSettingsMsg('تم حفظ وتحديث بيانات ومعلومات التواصل للأكاديمية بنجاح!');
    setTimeout(() => setSettingsMsg(null), 3000);
  };

  return (
    <div className="space-y-8 text-right max-w-4xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>إعدادات النظام والأمان</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
          إدارة حساب الأدمن والبيانات الأساسية للأكاديمية
        </h2>
        <p className="text-xs text-stone-500">
          تعديل كلمة مرور الإدارة، اسم المسؤولة، وأرقام التواصل والواتساب
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD 1: ADMIN CREDENTIALS */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="bg-emerald-950 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm">تغيير اسم المستخدم وكلمة المرور</h3>
            </div>
          </div>

          <form onSubmit={handleUpdateCreds} className="p-5 space-y-4">
            {credMsg && (
              <div className={`p-3 rounded-lg text-xs font-bold flex items-center gap-2 ${
                credMsg.isError ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                <span>{credMsg.text}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">
                اسم مستخدم الأدمن (Username)
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-mono"
                dir="ltr"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">
                كلمة المرور الجديدة (New Password)
              </label>
              <input
                type="password"
                required
                placeholder="أدخل كلمة مرور قوية جديدة"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-mono"
                dir="ltr"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">
                تأكيد كلمة المرور الجديدة
              </label>
              <input
                type="password"
                required
                placeholder="أعد إدخال كلمة المرور"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-mono"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>حفظ وتحديث بيانات الدخول</span>
            </button>
          </form>
        </div>

        {/* CARD 2: ACADEMY CONTACT & DIRECTOR INFO */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="bg-emerald-950 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm">بيانات وهوية الأكاديمية والتواصل</h3>
            </div>
          </div>

          <form onSubmit={handleUpdateSettings} className="p-5 space-y-4">
            {settingsMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{settingsMsg}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">
                اسم الأكاديمية
              </label>
              <input
                type="text"
                required
                value={settings.academyName}
                onChange={(e) => setSettings({ ...settings, academyName: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">
                اسم المشرفة / الإدارة المسؤولة
              </label>
              <input
                type="text"
                required
                value={settings.directorName}
                onChange={(e) => setSettings({ ...settings, directorName: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-800">
                  رقم الواتساب الرسمي
                </label>
                <input
                  type="text"
                  required
                  value={settings.whatsappPhone}
                  onChange={(e) => setSettings({ ...settings, whatsappPhone: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-mono"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-800">
                  رقم الهاتف للتواصل
                </label>
                <input
                  type="text"
                  required
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">
                العنوان والمقر
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>حفظ معلومات الأكاديمية والتواصل</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
