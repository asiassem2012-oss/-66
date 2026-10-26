import React, { useState } from 'react';
import { UserCheck, Plus, Trash2, Edit2, Shield, Phone, Mail, Award, Check } from 'lucide-react';
import { store } from '../lib/store';
import { Teacher, Course } from '../types';

interface TeacherManagementViewProps {
  teachers: Teacher[];
  courses: Course[];
}

export const TeacherManagementView: React.FC<TeacherManagementViewProps> = ({
  teachers,
  courses,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('01093165437');
  const [specialization, setSpecialization] = useState('إجازة في التجويد والقراءات');
  const [manageExams, setManageExams] = useState(true);
  const [manageCourses, setManageCourses] = useState(true);
  const [manageAttendance, setManageAttendance] = useState(true);
  const [assignedCourse, setAssignedCourse] = useState(courses[0]?.id || '');

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    store.addTeacher({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      specialization: specialization.trim(),
      permissions: {
        manageExams,
        manageCourses,
        manageAttendance,
      },
      assignedCourses: assignedCourse ? [assignedCourse] : [],
    });

    setShowAddModal(false);
    setName('');
    setEmail('');
  };

  const handleDeleteTeacher = (id: string, teacherName: string) => {
    if (window.confirm(`هل أنت متأكد من حذف حساب المعلم: ${teacherName}؟`)) {
      store.deleteTeacher(id);
    }
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-900 rounded-full text-xs font-bold border border-emerald-200">
            <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>الهيئة التعليمية والمشايخ</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
            إدارة حسابات الشيوخ والمعلمين وصلاحياتهم
          </h2>
          <p className="text-xs text-stone-500">
            إضافة مشايخ جدد، تحديد الحلقات المسندة إليهم، وضبط صلاحيات وضع الامتحانات وإدارة الحضور
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>إضافة معلم / شيخ جديد</span>
        </button>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-4 hover:border-emerald-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-900 text-amber-300 font-bold flex items-center justify-center text-lg shadow-xs">
                {teacher.name.charAt(0)}
              </div>
              <button
                onClick={() => handleDeleteTeacher(teacher.id, teacher.name)}
                className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="حذف الحساب"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900">{teacher.name}</h3>
              <p className="text-xs text-amber-700 font-semibold">{teacher.specialization}</p>
            </div>

            {/* Contact details */}
            <div className="text-xs text-stone-600 space-y-1 pt-2 border-t border-stone-100">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                <span>{teacher.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span dir="ltr">{teacher.phone}</span>
              </div>
            </div>

            {/* Permissions list */}
            <div className="bg-stone-50 rounded-lg p-3 space-y-1.5 border border-stone-200/70">
              <div className="text-[11px] font-bold text-stone-700">الصلاحيات الممنوحة:</div>
              <div className="flex flex-wrap gap-1.5">
                {teacher.permissions.manageExams && (
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                    ✓ وضع الامتحانات
                  </span>
                )}
                {teacher.permissions.manageCourses && (
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                    ✓ تعديل الحلقات
                  </span>
                )}
                {teacher.permissions.manageAttendance && (
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                    ✓ متابعة الحضور
                  </span>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden text-right">
            <div className="bg-emerald-950 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">إضافة شيخ أو معلم جديد للأكاديمية</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-300 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTeacher} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-800">الاسم الكامل</label>
                  <input
                    type="text"
                    required
                    placeholder="فضيلة الشيخ..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-800">التخصص والإجازة</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: مجاز بالقراءات العشر"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-800">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-800">رقم الهاتف للتواصل</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Permissions Checkboxes */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <label className="block text-xs font-bold text-stone-800">تحديد صلاحيات المعلم:</label>
                <div className="space-y-1.5 text-xs text-stone-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={manageExams}
                      onChange={(e) => setManageExams(e.target.checked)}
                      className="rounded text-emerald-800"
                    />
                    <span>صلاحية إضافة الامتحانات والأسئلة</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={manageCourses}
                      onChange={(e) => setManageCourses(e.target.checked)}
                      className="rounded text-emerald-800"
                    />
                    <span>صلاحية تحديث محتوى الحلقات ورابط البث</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={manageAttendance}
                      onChange={(e) => setManageAttendance(e.target.checked)}
                      className="rounded text-emerald-800"
                    />
                    <span>صلاحية رصد درجات الحضور والتلاوة</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-md"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 text-white font-bold text-xs rounded-xl hover:bg-emerald-700"
                >
                  حفظ الحساب
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
