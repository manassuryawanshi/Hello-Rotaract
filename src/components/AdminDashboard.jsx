import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { eventService, noticeService, taskService } from '../data/mockDb.js';
import { ShieldAlert, UserCheck, CalendarCheck, Check, X, Send, ClipboardList } from 'lucide-react';
import InitialsAvatar from './InitialsAvatar';

const AdminDashboard = () => {
  const { currentProfile, profiles, events, attendance, triggerUpdate } = useApp();
  
  // Tab/section selection state
  const [adminSection, setAdminSection] = useState('attendance');
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');
  const [toastMessage, setToastMessage] = useState('');
  
  // Modal states
  const [noticeModal, setNoticeModal] = useState({ show: false, user: null, message: '' });
  const [taskModal, setTaskModal] = useState({ show: false, user: null, title: '' });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSendNotice = async () => {
    try {
      await noticeService.createNotice({ title: 'Admin Notice', content: noticeModal.message });
      showToast(`Notice sent to ${noticeModal.user ? noticeModal.user.name : 'all members'}`);
      setNoticeModal({ show: false, user: null, message: '' });
      triggerUpdate();
    } catch (err) { alert(err.message); }
  };

  const handleAssignTask = async () => {
    try {
      await taskService.createTask({
        title: taskModal.title,
        description: 'Assigned from directory',
        assignedTo: taskModal.user ? taskModal.user.id : null,
        endDate: new Date(Date.now() + 86400000 * 3).toISOString() // 3 days
      });
      showToast(`Task assigned to ${taskModal.user ? taskModal.user.name : 'all members'}`);
      setTaskModal({ show: false, user: null, title: '' });
      triggerUpdate();
    } catch (err) { alert(err.message); }
  };

  const handleToggleAttendance = async (profileId, isChecked) => {
    try {
      if (isChecked) {
        await eventService.markAttendance(selectedEventId, profileId);
      } else {
        await eventService.unmarkAttendance(selectedEventId, profileId);
      }
      triggerUpdate();
    } catch (err) { alert(err.message); }
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.03em' }}>Admin Control Center</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Authorize member credentials and compile event attendance logs</p>
      </div>

      <div className="dashboard-card" style={{ marginBottom: '24px' }}>
        <h3>Quick Actions</h3>
        <div className="quick-links-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          <div className="quick-link-button" onClick={() => setNoticeModal({ show: true, user: null, message: '' })}>
            <Send size={20} style={{ color: 'var(--accent-color)' }} />
            <span>Send Notice to All</span>
          </div>
          <div className="quick-link-button" onClick={() => setTaskModal({ show: true, user: null, title: '' })}>
            <ClipboardList size={20} style={{ color: 'var(--accent-color)' }} />
            <span>Assign Global Task</span>
          </div>
        </div>
      </div>

      {/* Admin Tab selection */}
      <div className="tab-bar-container" style={{ maxWidth: '400px', marginBottom: '24px' }}>
        <div 
          className={`tab-bar-item ${adminSection === 'attendance' ? 'active' : ''}`}
          onClick={() => setAdminSection('attendance')}
        >
          <CalendarCheck size={16} />
          <span>Attendance</span>
        </div>
        <div 
          className={`tab-bar-item ${adminSection === 'directory' ? 'active' : ''}`}
          onClick={() => setAdminSection('directory')}
        >
          <UserCheck size={16} />
          <span>Directory</span>
        </div>
      </div>

      {/* SECTION 2: Attendance Sheets */}
      {adminSection === 'attendance' && (
        <div className="dashboard-card">
          <h3>Manual Event Attendance Logging</h3>
          
          <div style={{ margin: '20px 0 24px' }}>
            <div className="form-group">
              <label>SELECT EVENT TO AUDIT</label>
              <select 
                className="form-input" 
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                style={{ width: '100%', marginTop: '4px' }}
              >
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({new Date(ev.startTime).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedEventId ? (
            <div>
              <h5 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                MEMBER ROSTER
              </h5>
              
              <div className="attendance-grid">
                {profiles.map(memberProfile => {
                  const isChecked = attendance.some(a => a.eventId === selectedEventId && a.profileId === memberProfile.id);
                  return (
                    <div key={memberProfile.id} className="attendance-row">
                      <div className="attendance-member">
                        <InitialsAvatar name={memberProfile.name} size={36} />
                        <div>
                          <span>{memberProfile.name}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>
                            {memberProfile.rotaractId}
                          </span>
                        </div>
                      </div>

                      <label className="apple-switch">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleToggleAttendance(memberProfile.id, e.target.checked)}
                        />
                        <span className="apple-slider"></span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px' }}>
              Create an event first to log member participation.
            </p>
          )}
        </div>
      )}

      {/* SECTION 3: Members Directory (Admin Quick Actions) */}
      {adminSection === 'directory' && (
        <div className="dashboard-card">
          <h3>Club Active Members Directory</h3>
          
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 8px', fontWeight: '600' }}>MEMBER NAME</th>
                  <th style={{ padding: '12px 8px', fontWeight: '600' }}>ROTARACT ID</th>
                  <th style={{ padding: '12px 8px', fontWeight: '600', textAlign: 'right' }}>QUICK ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <InitialsAvatar name={p.name} size={28} />
                      <span>{p.name}</span>
                    </td>
                    <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>{p.rotaractId}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => setNoticeModal({ show: true, user: p, message: '' })}
                        >
                          <Send size={12} /> Notice
                        </button>
                        <button 
                          className="btn-primary" 
                          style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => setTaskModal({ show: true, user: p, title: '' })}
                        >
                          <ClipboardList size={12} /> Task
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', background: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '12px 24px', borderRadius: '99px', fontSize: '14px', fontWeight: '600', boxShadow: 'var(--shadow-lg)', zIndex: 9999, transition: 'var(--transition-spring)' }}>
          {toastMessage}
        </div>
      )}

      {noticeModal.show && (
        <div className="modal-overlay" onClick={() => setNoticeModal({ show: false, user: null, message: '' })}>
          <div className="modal-content liquid-glass-card slide-up" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px' }}>Send Notice to {noticeModal.user ? noticeModal.user.name : 'All Members'}</h3>
            <div className="form-group">
              <label>Notice Message</label>
              <textarea 
                rows="4"
                className="input-modern"
                value={noticeModal.message} 
                onChange={e => setNoticeModal({...noticeModal, message: e.target.value})}
                placeholder="Type your notice here..."
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', marginTop: '8px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleSendNotice}>Dispatch Notice</button>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setNoticeModal({ show: false, user: null, message: '' })}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {taskModal.show && (
        <div className="modal-overlay" onClick={() => setTaskModal({ show: false, user: null, title: '' })}>
          <div className="modal-content liquid-glass-card slide-up" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px' }}>Assign Task to {taskModal.user ? taskModal.user.name : 'All Members'}</h3>
            <div className="form-group">
              <label>Task Title</label>
              <input 
                type="text"
                className="input-modern"
                value={taskModal.title} 
                onChange={e => setTaskModal({...taskModal, title: e.target.value})}
                placeholder="e.g. Complete survey"
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', marginTop: '8px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleAssignTask}>Assign Task</button>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setTaskModal({ show: false, user: null, title: '' })}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
