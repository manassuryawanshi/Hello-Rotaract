import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cqiluweftrorvwdzvwko.supabase.co';
const supabaseKey = 'sb_publishable_XNLq_zMMsXmCHWozaSndtA_Vkt0H_cM';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Hello Rotaract Mock Database & Microservices Logic Layer
// Simulates the microservices architecture using LocalStorage for true persistence.

const STORAGE_KEYS = {
  USERS: 'hr_users',
  PROFILES: 'hr_profiles',
  PAYMENTS: 'hr_payments',
  EVENTS: 'hr_events',
  TASKS: 'hr_tasks',
  NOTICES: 'hr_notices',
  ATTENDANCE: 'hr_attendance',
  SESSION: 'hr_session',
  NOTIFICATIONS: 'hr_notifications'
};

// Excel Sheet Manual Database (Pre-approved club members)
const preApprovedMembers = [
  { email: 'member@rotaract.org', rotaractId: 'RID-7703', name: 'Riya Sharma', clubId: 'CID-505' },
  { email: 'treasurer@rotaract.org', rotaractId: 'RID-8802', name: 'Siddharth Sen', clubId: 'CID-505' },
  { email: 'admin@rotaract.org', rotaractId: 'RID-9901', name: 'Aarav Mehta', clubId: 'CID-505' },
  { email: 'john@rotaract.org', rotaractId: 'RID-1102', name: 'John Doe', clubId: 'CID-505' },
  { email: 'jane@rotaract.org', rotaractId: 'RID-1103', name: 'Jane Smith', clubId: 'CID-505' }
];

// Seed Data
const initialUsers = [
  {
    id: 'u-admin',
    email: 'admin@rotaract.org',
    phone: '9876543210',
    passwordHash: 'admin123',
    role: 'ADMIN',
    status: 'APPROVED',
    emailVerified: true
  },
  {
    id: 'u-treasurer',
    email: 'treasurer@rotaract.org',
    phone: '9876543211',
    passwordHash: 'treasurer123',
    role: 'TREASURER',
    status: 'APPROVED',
    emailVerified: true
  },
  {
    id: 'u-member',
    email: 'member@rotaract.org',
    phone: '9876543212',
    passwordHash: 'member123',
    role: 'MEMBER',
    status: 'APPROVED',
    emailVerified: true
  }
];

const initialProfiles = [
  {
    id: 'p-admin',
    userId: 'u-admin',
    name: 'Aarav Mehta',
    rotaractId: 'RID-9901',
    clubId: 'CID-505',
    clubName: 'Rotaract Club of Midtown',
    parentRotary: 'Rotary Club of Midtown Metro',
    district: 'RID 3141',
    isBOD: true,
    avatarUrl: ''
  },
  {
    id: 'p-treasurer',
    userId: 'u-treasurer',
    name: 'Siddharth Sen',
    rotaractId: 'RID-8802',
    clubId: 'CID-505',
    clubName: 'Rotaract Club of Midtown',
    parentRotary: 'Rotary Club of Midtown Metro',
    district: 'RID 3141',
    isBOD: true,
    avatarUrl: ''
  },
  {
    id: 'p-member',
    userId: 'u-member',
    name: 'Riya Sharma',
    rotaractId: 'RID-7703',
    clubId: 'CID-505',
    clubName: 'Rotaract Club of Midtown',
    parentRotary: 'Rotary Club of Midtown Metro',
    district: 'RID 3141',
    isBOD: false,
    avatarUrl: ''
  }
];

const initialPayments = [
  {
    id: 'pay-1',
    profileId: 'p-member',
    amountDue: 1500,
    status: 'UNPAID',
    upiTransactionRef: '',
    receiptScreenshotUrl: '',
    remarks: 'Annual Membership Dues Outstanding',
    verifiedBy: '',
    verifiedAt: null,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pay-2',
    profileId: 'p-admin',
    amountDue: 0,
    status: 'PAID',
    upiTransactionRef: 'UPI-9876543211',
    receiptScreenshotUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=400&q=80',
    remarks: 'BOD Contribution',
    verifiedBy: 'p-treasurer',
    verifiedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pay-3',
    profileId: 'p-treasurer',
    amountDue: 0,
    status: 'PAID',
    upiTransactionRef: 'SYSTEM-AUTO',
    receiptScreenshotUrl: '',
    remarks: 'Auto approved',
    verifiedBy: 'p-treasurer',
    verifiedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
];

// Helper to calculate date relative to today
const relativeDate = (daysOffset, hour = 10, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const initialEvents = [
  {
    id: 'ev-1',
    title: 'Rotaract Installation Ceremony 2026',
    description: 'Join us for the installation of our new Board of Directors. Formal attire required. Dinner will be served.',
    startTime: relativeDate(1, 18, 0),
    endTime: relativeDate(1, 21, 0),
    venue: 'Taj Land End, Crystal Room, Bandra',
    tag: 'Ceremony',
    googleRulebookUrl: 'https://example.com/rules-installation',
    meetLink: 'https://meet.google.com/abc-defg-hij',
    coordinators: ['p-admin', 'p-treasurer'], // Array of Profile IDs
    createdBy: 'p-admin'
  },
  {
    id: 'ev-2',
    title: 'Beach Cleanup Drive',
    description: 'Weekly environment preservation activity. Meet at Versova beach gate 2. Gloves and trash bags will be provided.',
    startTime: relativeDate(3, 7, 0),
    endTime: relativeDate(3, 10, 0),
    venue: 'Versova Beach, Mumbai',
    tag: 'Community Service',
    googleRulebookUrl: 'https://example.com/rules-cleanup',
    meetLink: 'https://meet.google.com/xyz-pdqr-lmn',
    coordinators: ['p-admin'],
    createdBy: 'p-admin'
  },
  {
    id: 'ev-3',
    title: 'Web3 & AI Career Seminar',
    description: 'Learn from tech leaders about emerging jobs, resumes, and interview protocols in artificial intelligence and blockchain fields.',
    startTime: relativeDate(-2, 14, 0), // Past event
    endTime: relativeDate(-2, 16, 0),
    venue: 'St. Xavier College Seminar Hall',
    tag: 'Professional Dev',
    googleRulebookUrl: 'https://example.com/seminar-info',
    meetLink: 'https://meet.google.com/tuv-wxyz-abc',
    coordinators: ['p-member'],
    createdBy: 'p-admin'
  }
];

const initialTasks = [
  {
    id: 't-1',
    title: 'Design poster for Beach Cleanup',
    description: 'Create a clean, minimalist poster highlighting venue, timing, and contact. Share in the main group.',
    assignedTo: 'p-member',
    createdBy: 'p-admin',
    startDate: relativeDate(0),
    endDate: relativeDate(2),
    status: 'IN_PROGRESS'
  },
  {
    id: 't-2',
    title: 'Submit quarterly budget sheet',
    description: 'Summarize all subscription receipts and installation expenditures in an excel document.',
    assignedTo: 'p-treasurer',
    createdBy: 'p-admin',
    startDate: relativeDate(-1),
    endDate: relativeDate(1),
    status: 'PENDING'
  },
  {
    id: 't-3',
    title: 'Prepare onboarding presentation',
    description: 'Create slides explaining club protocols and committee structures for new inductees.',
    assignedTo: 'p-member',
    createdBy: 'p-member',
    startDate: relativeDate(0),
    endDate: relativeDate(4),
    status: 'COMPLETED'
  }
];

const initialNotices = [
  {
    id: 'n-1',
    title: 'Urgent: Annual Membership Dues',
    content: 'All members are requested to pay their annual membership dues of ₹1500 before the end of this month. Please upload your payment receipts under the Profile tab for the Treasurer to verify.',
    createdBy: 'p-admin',
    createdAt: relativeDate(-5)
  },
  {
    id: 'n-2',
    title: 'BOD Meeting: Installation Prep',
    content: 'Board of Directors meeting scheduled on Sunday 4:00 PM at the parent Rotary Club office. Attendance is mandatory for all directors.',
    createdBy: 'p-admin',
    createdAt: relativeDate(-1)
  }
];

const initialAttendance = [
  { eventId: 'ev-3', profileId: 'p-member', attendedByAdminId: 'p-admin', attendedAt: relativeDate(-2, 14, 30) },
  { eventId: 'ev-3', profileId: 'p-treasurer', attendedByAdminId: 'p-admin', attendedAt: relativeDate(-2, 14, 15) }
];

const initialNotifications = [
  {
    id: 'notif-1',
    profileId: 'p-member',
    title: 'Welcome to Hello Rotaract',
    content: 'Your member credentials are fully validated. Explore your dashboard schedules and upcoming services!',
    read: false,
    createdAt: relativeDate(-2)
  },
  {
    id: 'notif-2',
    profileId: 'p-member',
    title: 'Annual Subscription Due',
    content: 'Please clear your membership dues of ₹1500 to retain active status.',
    read: false,
    createdAt: relativeDate(0)
  }
];

// LocalStorage engine functions
const load = (key, seed) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(seed));
    // Push initial seed to supabase asynchronously
    supabase.from('app_state').upsert({ key, value: seed }).then(res => {
       if (res.error) console.error('Supabase seed error:', res.error);
    });
    return seed;
  }
  return JSON.parse(data);
};

const save = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
  // Fire and forget push to Supabase
  supabase.from('app_state').upsert({ key, value: data }).then(res => {
     if (res.error) console.error('Supabase sync error:', res.error);
  });
};

export const syncFromSupabase = async () => {
  try {
    const { data, error } = await supabase.from('app_state').select('*');
    if (data && data.length > 0) {
      data.forEach(row => {
        localStorage.setItem(row.key, JSON.stringify(row.value));
      });
    }
  } catch (err) {
    console.error('Failed to sync from Supabase', err);
  }
};

// Database Initialization
export const initDb = () => {
  load(STORAGE_KEYS.USERS, initialUsers);
  load(STORAGE_KEYS.PROFILES, initialProfiles);
  load(STORAGE_KEYS.PAYMENTS, initialPayments);
  load(STORAGE_KEYS.EVENTS, initialEvents);
  load(STORAGE_KEYS.TASKS, initialTasks);
  load(STORAGE_KEYS.NOTICES, initialNotices);
  load(STORAGE_KEYS.ATTENDANCE, initialAttendance);
  load(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
};

// Database Getters
export const getUsers = () => load(STORAGE_KEYS.USERS, initialUsers);
export const getProfiles = () => load(STORAGE_KEYS.PROFILES, initialProfiles);
export const getPayments = () => load(STORAGE_KEYS.PAYMENTS, initialPayments);
export const getEvents = () => load(STORAGE_KEYS.EVENTS, initialEvents);
export const getTasks = () => load(STORAGE_KEYS.TASKS, initialTasks);
export const getNotices = () => load(STORAGE_KEYS.NOTICES, initialNotices);
export const getAttendance = () => load(STORAGE_KEYS.ATTENDANCE, initialAttendance);
export const getNotifications = () => load(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
export const getPreApprovedList = () => preApprovedMembers;

// -------------------------------------------------------------
// MICROSERVICES SIMULATORS
// -------------------------------------------------------------

// Onboarding & Authentication Service
export const authService = {
  login: (emailOrRid, password) => {
    const users = getUsers();
    const profiles = getProfiles();
    
    let user = null;
    let profile = null;
    
    if (emailOrRid.includes('@')) {
      user = users.find(u => u.email.toLowerCase() === emailOrRid.toLowerCase());
    } else {
      profile = profiles.find(p => p.rotaractId.toLowerCase() === emailOrRid.toLowerCase());
      if (profile) {
        user = users.find(u => u.id === profile.userId);
      }
    }
    
    if (!user || user.passwordHash !== password) {
      throw new Error('Invalid credentials');
    }
    
    if (user.status === 'PENDING_APPROVAL') {
      throw new Error('Awaiting Club Admin approval.');
    }
    
    if (user.status === 'REJECTED') {
      throw new Error('Your onboarding request was rejected.');
    }
    
    if (!profile) {
      profile = profiles.find(p => p.userId === user.id);
    }
    
    const session = { user, profile };
    save(STORAGE_KEYS.SESSION, session);
    return session;
  },

  getCurrentSession: () => {
    const sessionStr = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!sessionStr) return null;
    const session = JSON.parse(sessionStr);
    
    const users = getUsers();
    const profiles = getProfiles();
    const updatedUser = users.find(u => u.id === session.user.id);
    const updatedProfile = profiles.find(p => p.userId === session.user.id);
    if (!updatedUser) return null;
    return { user: updatedUser, profile: updatedProfile };
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  // Initiate Registration (Step 1)
  initiateRegister: (email) => {
    const users = getUsers();
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error('User with this email already exists');
    }
    
    // Send simulated OTP code
    return { email, otp: '123456' };
  },

  // Complete Registration Details (Step 2)
  submitRegisterDetails: (regData) => {
    const { email, password, name, rotaractId, clubId, clubName, parentRotary, district } = regData;
    
    const users = getUsers();
    const profiles = getProfiles();
    
    const userId = 'u-' + Date.now();
    const profileId = 'p-' + Date.now();
    
    // Check against pre-approved manual database list (Email + RID comparison)
    const matchedApproval = preApprovedMembers.find(
      m => m.email.toLowerCase() === email.toLowerCase() && 
           m.rotaractId.toLowerCase() === rotaractId.toLowerCase()
    );

    const initialStatus = matchedApproval ? 'APPROVED' : 'PENDING_APPROVAL';
    
    const newUser = {
      id: userId,
      email,
      phone: '',
      passwordHash: password,
      role: 'MEMBER',
      status: initialStatus,
      emailVerified: true
    };
    
    const newProfile = {
      id: profileId,
      userId,
      name: matchedApproval ? matchedApproval.name : name,
      rotaractId: rotaractId,
      clubId: clubId || 'CID-505',
      clubName: clubName || 'Rotaract Club of Midtown',
      parentRotary: parentRotary || 'Rotary Club of Midtown Metro',
      district: district || 'RID 3141',
      isBOD: false,
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`
    };
    
    users.push(newUser);
    profiles.push(newProfile);
    
    save(STORAGE_KEYS.USERS, users);
    save(STORAGE_KEYS.PROFILES, profiles);
    
    // Seed payment dues for the new member
    const payments = getPayments();
    payments.push({
      id: 'pay-' + Date.now(),
      profileId: profileId,
      amountDue: 1500,
      status: 'UNPAID',
      upiTransactionRef: '',
      receiptScreenshotUrl: '',
      remarks: 'Annual Membership Dues',
      verifiedBy: '',
      verifiedAt: null,
      createdAt: new Date().toISOString()
    });
    save(STORAGE_KEYS.PAYMENTS, payments);

    // Welcome Notifications
    const notifications = getNotifications();
    notifications.push({
      id: 'notif-' + Date.now(),
      profileId: profileId,
      title: 'Welcome to Hello Rotaract!',
      content: matchedApproval 
        ? 'Your account was automatically approved against club records!' 
        : 'Your account is under admin verification review.',
      read: false,
      createdAt: new Date().toISOString()
    });
    save(STORAGE_KEYS.NOTIFICATIONS, notifications);
    
    return newUser;
  },

  updateProfile: (profileId, userId, { name, email, phone, avatarUrl }) => {
    const profiles = getProfiles();
    const pIdx = profiles.findIndex(p => p.id === profileId);
    if (pIdx > -1) {
      profiles[pIdx].name = name;
      profiles[pIdx].avatarUrl = avatarUrl;
      save(STORAGE_KEYS.PROFILES, profiles);
    }
    
    const users = getUsers();
    const uIdx = users.findIndex(u => u.id === userId);
    if (uIdx > -1) {
      users[uIdx].email = email;
      users[uIdx].phone = phone;
      save(STORAGE_KEYS.USERS, users);
    }
  },

  getPendingApprovals: () => {
    const users = getUsers();
    const profiles = getProfiles();
    
    return users
      .filter(u => u.status === 'PENDING_APPROVAL')
      .map(u => {
        const p = profiles.find(prof => prof.userId === u.id);
        return { user: u, profile: p };
      });
  },

  approveUser: (userId, action) => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex > -1) {
      users[userIndex].status = action;
      save(STORAGE_KEYS.USERS, users);

      if (action === 'APPROVED') {
        const profiles = getProfiles();
        const prof = profiles.find(p => p.userId === userId);
        if (prof) {
          const notifications = getNotifications();
          notifications.push({
            id: 'notif-' + Date.now(),
            profileId: prof.id,
            title: 'Account Approved',
            content: 'Congratulations, the club administrator approved your onboarding request.',
            read: false,
            createdAt: new Date().toISOString()
          });
          save(STORAGE_KEYS.NOTIFICATIONS, notifications);
        }
      }
    }
  }
};

// Payment / Dues Service
export const paymentService = {
  getMemberDues: (profileId) => {
    const payments = getPayments();
    return payments.find(p => p.profileId === profileId);
  },

  submitPaymentProof: (profileId, transactionRef, screenshotBase64) => {
    const payments = getPayments();
    const payIndex = payments.findIndex(p => p.profileId === profileId && p.status !== 'PAID');
    
    if (payIndex > -1) {
      payments[payIndex].status = 'PENDING_VERIFICATION';
      payments[payIndex].upiTransactionRef = transactionRef;
      payments[payIndex].receiptScreenshotUrl = screenshotBase64 || 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=400&q=80';
      payments[payIndex].createdAt = new Date().toISOString();
      
      save(STORAGE_KEYS.PAYMENTS, payments);
      return payments[payIndex];
    } else {
      const newPay = {
        id: 'pay-' + Date.now(),
        profileId,
        amountDue: 1500,
        status: 'PENDING_VERIFICATION',
        upiTransactionRef: transactionRef,
        receiptScreenshotUrl: screenshotBase64 || 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=400&q=80',
        remarks: 'Membership Dues Submission',
        verifiedBy: '',
        verifiedAt: null,
        createdAt: new Date().toISOString()
      };
      payments.push(newPay);
      save(STORAGE_KEYS.PAYMENTS, payments);
      return newPay;
    }
  },

  getPendingPayments: () => {
    const payments = getPayments();
    const profiles = getProfiles();
    
    return payments
      .filter(p => p.status === 'PENDING_VERIFICATION')
      .map(p => {
        const prof = profiles.find(profile => profile.id === p.profileId);
        return { payment: p, profile: prof };
      });
  },

  verifyPayment: (paymentId, isApproved, treasurerProfileId, rejectionRemarks = '') => {
    const payments = getPayments();
    const payIndex = payments.findIndex(p => p.id === paymentId);
    
    if (payIndex > -1) {
      const targetProfileId = payments[payIndex].profileId;
      const notifications = getNotifications();

      if (isApproved) {
        payments[payIndex].status = 'PAID';
        payments[payIndex].amountDue = 0;
        payments[payIndex].verifiedBy = treasurerProfileId;
        payments[payIndex].verifiedAt = new Date().toISOString();

        notifications.push({
          id: 'notif-' + Date.now(),
          profileId: targetProfileId,
          title: 'Membership Payment Approved',
          content: 'Treasurer verified your UPI transaction reference receipt. You are now fully active.',
          read: false,
          createdAt: new Date().toISOString()
        });
      } else {
        payments[payIndex].status = 'UNPAID';
        payments[payIndex].remarks = `Rejected: ${rejectionRemarks}`;

        notifications.push({
          id: 'notif-' + Date.now(),
          profileId: targetProfileId,
          title: 'Dues Receipt Rejected',
          content: `Rejection reason: "${rejectionRemarks}". Please re-upload screenshot receipt.`,
          read: false,
          createdAt: new Date().toISOString()
        });
      }
      save(STORAGE_KEYS.PAYMENTS, payments);
      save(STORAGE_KEYS.NOTIFICATIONS, notifications);
      return payments[payIndex];
    }
    throw new Error('Payment record not found');
  }
};

// Events & Attendance Service (Multi coordinator support)
export const eventService = {
  createEvent: (eventData, profileId) => {
    const events = getEvents();
    const newEvent = {
      id: 'ev-' + Date.now(),
      title: eventData.title,
      description: eventData.description,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      venue: eventData.venue,
      tag: eventData.tag,
      googleRulebookUrl: eventData.googleRulebookUrl,
      meetLink: eventData.meetLink,
      coordinators: eventData.coordinators || [profileId], // Array of coordinator Profile IDs
      createdBy: profileId
    };
    events.push(newEvent);
    save(STORAGE_KEYS.EVENTS, events);
    return newEvent;
  },

  markAttendance: (eventId, profileId, adminId) => {
    const attendance = getAttendance();
    const exists = attendance.some(a => a.eventId === eventId && a.profileId === profileId);
    
    if (!exists) {
      attendance.push({
        eventId,
        profileId,
        attendedByAdminId: adminId,
        attendedAt: new Date().toISOString()
      });
      save(STORAGE_KEYS.ATTENDANCE, attendance);

      // Notify member they were marked attended
      const notifications = getNotifications();
      const events = getEvents();
      const ev = events.find(e => e.id === eventId);
      notifications.push({
        id: 'notif-' + Date.now(),
        profileId,
        title: 'Attendance Confirmed',
        content: `Your attendance at "${ev?.title || 'Event'}" has been successfully logged by admin.`,
        read: false,
        createdAt: new Date().toISOString()
      });
      save(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }
    return attendance;
  },

  unmarkAttendance: (eventId, profileId) => {
    let attendance = getAttendance();
    attendance = attendance.filter(a => !(a.eventId === eventId && a.profileId === profileId));
    save(STORAGE_KEYS.ATTENDANCE, attendance);
    return attendance;
  },

  getAttendanceForEvent: (eventId) => {
    const attendance = getAttendance();
    return attendance.filter(a => a.eventId === eventId);
  }
};

// Tasks Service (Support toggle checkbox and deletion)
export const taskService = {
  createTask: (taskData, creatorProfileId) => {
    const tasks = getTasks();
    const newTask = {
      id: 't-' + Date.now(),
      title: taskData.title,
      description: taskData.description,
      assignedTo: taskData.assignedTo || null,
      createdBy: creatorProfileId,
      startDate: taskData.startDate || new Date().toISOString(),
      endDate: taskData.endDate || relativeDate(3),
      status: 'PENDING'
    };
    tasks.push(newTask);
    save(STORAGE_KEYS.TASKS, tasks);
    return newTask;
  },

  updateTaskStatus: (taskId, newStatus) => {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex > -1) {
      tasks[taskIndex].status = newStatus;
      save(STORAGE_KEYS.TASKS, tasks);
      return tasks[taskIndex];
    }
    throw new Error('Task not found');
  },

  deleteTask: (taskId, profileId) => {
    let tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
      // Allow deletion only if user created it self
      if (task.createdBy === profileId) {
        tasks = tasks.filter(t => t.id !== taskId);
        save(STORAGE_KEYS.TASKS, tasks);
        return true;
      }
      throw new Error('Cannot delete administrative tasks.');
    }
    throw new Error('Task not found');
  }
};

// Notices Service
export const noticeService = {
  createNotice: (noticeData, adminProfileId) => {
    const notices = getNotices();
    const newNotice = {
      id: 'n-' + Date.now(),
      title: noticeData.title,
      content: noticeData.content,
      createdBy: adminProfileId,
      createdAt: new Date().toISOString()
    };
    notices.push(newNotice);
    save(STORAGE_KEYS.NOTICES, notices);

    // Create notifications for all active members
    const profiles = getProfiles();
    const notifications = getNotifications();
    profiles.forEach(p => {
      if (p.id !== adminProfileId) {
        notifications.push({
          id: 'notif-' + Date.now() + '-' + p.id,
          profileId: p.id,
          title: `New Notice: ${noticeData.title}`,
          content: noticeData.content.substring(0, 100) + '...',
          read: false,
          createdAt: new Date().toISOString()
        });
      }
    });
    save(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return newNotice;
  }
};

// Notification Service CRUD
export const notificationService = {
  getMemberNotifications: (profileId) => {
    const notifications = getNotifications();
    return notifications.filter(n => n.profileId === profileId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  
  markAllAsRead: (profileId) => {
    const notifications = getNotifications();
    notifications.forEach(n => {
      if (n.profileId === profileId) n.read = true;
    });
    save(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }
};
