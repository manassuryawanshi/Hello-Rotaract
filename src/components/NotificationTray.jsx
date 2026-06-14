import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckSquare, Shield, Clock } from 'lucide-react';

const NotificationTray = ({ onClose }) => {
  const { userNotifications, markNotificationsAsRead } = useApp();

  const handleMarkAll = () => {
    markNotificationsAsRead();
    alert('All notifications marked as read.');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content liquid-glass-card slide-up" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-close-btn" onClick={onClose}>✕</div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} style={{ color: 'var(--accent-color)' }} />
            <span>Notifications</span>
          </h3>
          
          {userNotifications.some(n => !n.read) && (
            <button 
              onClick={handleMarkAll}
              style={{ background: 'none', color: 'var(--accent-color)', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              Mark all read
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '60vh', overflowY: 'auto' }} className="no-scrollbar">
          {userNotifications.length > 0 ? (
            userNotifications.map(notif => (
              <div 
                key={notif.id}
                style={{ 
                  padding: '16px', 
                  background: notif.read ? 'var(--bg-secondary)' : 'rgba(var(--accent-rgb), 0.04)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '16px',
                  display: 'flex',
                  gap: '12px',
                  position: 'relative'
                }}
              >
                {!notif.read && (
                  <span 
                    style={{ 
                      position: 'absolute', 
                      top: '16px', 
                      right: '16px', 
                      width: '6px', 
                      height: '6px', 
                      background: 'var(--accent-color)', 
                      borderRadius: '50%' 
                    }}
                  />
                )}
                
                <div style={{ marginTop: '2px', color: 'var(--accent-color)' }}>
                  {notif.title.includes('Approved') || notif.title.includes('Welcome') ? (
                    <Shield size={18} />
                  ) : (
                    <Clock size={18} />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{notif.title}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
                    {notif.content}
                  </p>
                  <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '6px', display: 'block' }}>
                    {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlignment: 'center', padding: '32px 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
              No notifications logged.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationTray;
