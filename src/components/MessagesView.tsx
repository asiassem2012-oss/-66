import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Video, 
  ExternalLink, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  Megaphone,
  Clock
} from 'lucide-react';
import { AcademyMessage } from '../types';

interface MessagesViewProps {
  messages: AcademyMessage[];
  currentUserId: string;
  onMarkAsRead: (messageId: string) => void;
  onMarkAllAsRead: () => void;
  onNavigateToCourse: (courseId?: string) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  messages,
  currentUserId,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigateToCourse,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Filter messages for current user or broadcast to all
  const userMessages = messages.filter(
    (m) => m.userId === currentUserId || m.userId === 'all'
  );

  const filtered = userMessages.filter((m) => {
    if (filter === 'unread') return !m.read;
    return true;
  });

  const unreadCount = userMessages.filter((m) => !m.read).length;

  const getIcon = (type: AcademyMessage['type']) => {
    switch (type) {
      case 'approval':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'announcement':
        return <Megaphone className="w-5 h-5 text-amber-500" />;
      case 'lesson_link':
        return <Video className="w-5 h-5 text-emerald-700" />;
      case 'rejection':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-stone-500" />;
    }
  };

  return (
    <div className="space-y-6 text-right">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full text-xs text-emerald-800 font-semibold border border-emerald-200">
            <Bell className="w-3.5 h-3.5 text-emerald-700" />
            <span>صندوق الرسائل والإشعارات</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            رسائل وتنبيهات إدارة الأكاديمية
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            تصلك هنا إشعارات قبولك في الحلقات، وروابط البث المباشر، ومواعيد الاختبارات الدورية
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>تحديد الكل كمقروء</span>
            </button>
          )}

          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              الكل ({userMessages.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filter === 'unread' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              غير المقروءة ({unreadCount})
            </button>
          </div>
        </div>
      </div>

      {/* Messages List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
          <Bell className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">لا توجد رسائل في هذا التبويب</h3>
          <p className="text-xs text-stone-500">
            {filter === 'unread' ? 'لقد قمت بقراءة جميع الرسائل الواردة!' : 'صندوق الوارد فارغ حالياً.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              onClick={() => !msg.read && onMarkAsRead(msg.id)}
              className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
                !msg.read
                  ? 'bg-emerald-50/50 border-emerald-200/90 shadow-xs'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-stone-200 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(msg.type)}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-stone-900">
                        {msg.title}
                      </h4>
                      {!msg.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600" title="رسالة جديدة" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{msg.createdAt}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
                    {msg.content}
                  </p>

                  {/* Optional Meeting or Course Link Action */}
                  {msg.link && (
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <a
                        href={msg.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Video className="w-3.5 h-3.5 text-amber-300" />
                        <span>فتح رابط الدرس المباشر</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      {msg.courseId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToCourse(msg.courseId);
                          }}
                          className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold underline"
                        >
                          عرض تفاصيل الدورة
                        </button>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
