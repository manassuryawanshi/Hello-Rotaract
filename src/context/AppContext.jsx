import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  initDb, 
  authService, 
  paymentService, 
  eventService, 
  taskService, 
  noticeService, 
  notificationService,
  getUsers,
  getProfiles,
  getEvents,
  getTasks,
  getNotices,
  getAttendance,
  getPayments,
  getNotifications,
  getPreApprovedList
} from '../data/mockDb';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [activeRole, setActiveRole] = useState('MEMBER'); // Toggleable roles: 'MEMBER', 'TREASURER', 'ADMIN'
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'events', 'analytics', 'profile', 'treasurer', 'admin'
  
  // Custom Accents and Theme settings
  const [accentColor, setAccentColor] = useState('#d91c5c');
  const [theme, setTheme] = useState('light');
  
  // Realtime Database-like triggers to reactively re-render components
  const [dbTrigger, setDbTrigger] = useState(0);

  useEffect(() => {
    // Initialize DB
    initDb();
    
    // Check if session exists
    const session = authService.getCurrentSession();
    if (session) {
      setCurrentUser(session.user);
      setCurrentProfile(session.profile);
      setActiveRole(session.user.role);
    }
    
    // Load setting accents
    const storedAccent = localStorage.getItem('hr_accent');
    if (storedAccent) setAccentColor(storedAccent);
    
    const storedTheme = localStorage.getItem('hr_theme') || 'light';
    setTheme(storedTheme);
    document.documentElement.setAttribute('data-theme', storedTheme);
  }, []);

  const triggerUpdate = () => {
    setDbTrigger(prev => prev + 1);
  };

  // Auth Operations
  const login = (emailOrRid, password) => {
    try {
      const session = authService.login(emailOrRid, password);
      setCurrentUser(session.user);
      setCurrentProfile(session.profile);
      setActiveRole(session.user.role);
      setActiveTab('home');
      return session;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentProfile(null);
    setActiveTab('home');
  };

  const registerMember = (regData) => {
    try {
      return authService.submitRegisterDetails(regData);
    } catch (err) {
      throw err;
    }
  };

  // Custom Debug Role Swapping (Allows showing user flow of other roles instantly)
  const swapRole = (role) => {
    setActiveRole(role);
    triggerUpdate();
  };

  // Color / Theme Operations
  const changeAccent = (color) => {
    setAccentColor(color);
    localStorage.setItem('hr_accent', color);
    
    let hex = color.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    document.documentElement.style.setProperty('--accent-color', color);
    document.documentElement.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
  };

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('hr_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Task Operations
  const deleteTask = (taskId) => {
    try {
      taskService.deleteTask(taskId, currentProfile.id);
      triggerUpdate();
    } catch (err) {
      alert(err.message);
    }
  };

  // Notifications Operations
  const markNotificationsAsRead = () => {
    if (currentProfile) {
      notificationService.markAllAsRead(currentProfile.id);
      triggerUpdate();
    }
  };

  // DB Sync Getters
  const events = getEvents();
  const tasks = getTasks();
  const notices = getNotices();
  const attendance = getAttendance();
  const payments = getPayments();
  const users = getUsers();
  const profiles = getProfiles();
  const preApprovedList = getPreApprovedList();
  
  // Reactively fetch user notifications
  const userNotifications = currentProfile 
    ? notificationService.getMemberNotifications(currentProfile.id)
    : [];

  return (
    <AppContext.Provider value={{
      currentUser,
      currentProfile,
      activeRole,
      activeTab,
      setActiveTab,
      accentColor,
      changeAccent,
      theme,
      toggleTheme,
      swapRole,
      login,
      logout,
      registerMember,
      deleteTask,
      markNotificationsAsRead,
      userNotifications,
      dbTrigger,
      triggerUpdate,
      // Shared DB states
      events,
      tasks,
      notices,
      attendance,
      payments,
      users,
      profiles,
      preApprovedList
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
