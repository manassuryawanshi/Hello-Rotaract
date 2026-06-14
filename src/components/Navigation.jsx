import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Calendar, CalendarDays, BarChart2, User, Landmark, ShieldAlert, LogOut } from 'lucide-react';
import InitialsAvatar from './InitialsAvatar';

const Navigation = () => {
  const { 
    activeTab, 
    setActiveTab, 
    activeRole, 
    logout, 
    currentProfile 
  } = useApp();

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, roles: ['MEMBER', 'TREASURER', 'ADMIN'] },
    { id: 'events', label: 'Events', icon: Calendar, roles: ['MEMBER', 'TREASURER', 'ADMIN'] },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays, roles: ['MEMBER', 'TREASURER', 'ADMIN'] },
    { id: 'analytics', label: 'Network', icon: BarChart2, roles: ['MEMBER', 'TREASURER', 'ADMIN'] },
    { id: 'treasurer', label: 'Treasury', icon: Landmark, roles: ['TREASURER'] },
    { id: 'admin', label: 'Admin', icon: ShieldAlert, roles: ['ADMIN'] }
  ];

  // Filtering menu items based on ACTIVE role
  const visibleMenuItems = menuItems.filter(item => item.roles.includes(activeRole));

  return (
    <>
      {/* PC Sidebar */}
      <aside className="sidebar">
        <div>
          <div className="sidebar-logo">
            <img src="/icon.png" alt="Logo" />
            <h1>Rotaract</h1>
          </div>
          
          <nav className="sidebar-menu">
            {visibleMenuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <div 
                  key={item.id}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={20} fill={isActive ? 'currentColor' : 'none'} />
                  <span>{item.label}</span>
                </div>
              );
            })}
            {/* Adding Profile explicitly to sidebar since it's removed from main array */}
            <div 
              className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={20} fill={activeTab === 'profile' ? 'currentColor' : 'none'} />
              <span>Profile</span>
            </div>
          </nav>
        </div>

        {currentProfile && (
          <div>
            <div className="sidebar-profile" style={{ marginBottom: '16px', cursor: 'pointer' }} onClick={() => setActiveTab('profile')}>
              <InitialsAvatar name={currentProfile.name} size={40} />
              <div style={{ overflow: 'hidden' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {currentProfile.name}
                </h4>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{currentProfile.rotaractId}</p>
              </div>
            </div>
            
            <div className="sidebar-item" onClick={logout} style={{ color: 'var(--error-color)' }}>
              <LogOut size={20} />
              <span>Log Out</span>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav">
        {visibleMenuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div 
              key={item.id}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={22} fill={isActive ? 'currentColor' : 'none'} strokeWidth={isActive ? 2 : 1.5} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>
    </>
  );
};

export default Navigation;
