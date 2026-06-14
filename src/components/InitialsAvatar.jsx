import React from 'react';

const InitialsAvatar = ({ name = '', size = 40, style = {}, onClick }) => {
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '?';
  const colors = ['#f43f5e', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#06b6d4'];
  const charCode = name.charCodeAt(0) || 0;
  const bgColor = colors[charCode % colors.length];

  return (
    <div 
      className="initials-avatar"
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: bgColor,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
        fontSize: size * 0.4,
        flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
    >
      {initials}
    </div>
  );
};

export default InitialsAvatar;
