import React, { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Navigation from './components/Navigation'
import Onboarding from './components/Onboarding'
import HomeDashboard from './components/HomeDashboard'
import EventsView from './components/EventsView'
import CalendarView from './components/CalendarView'
import AnalyticsView from './components/AnalyticsView'
import ProfileView from './components/ProfileView'
import TreasurerDashboard from './components/TreasurerDashboard'
import AdminDashboard from './components/AdminDashboard'
import EventDetailModal from './components/EventDetailModal'
import './App.css'

function MainAppContent() {
  const { currentUser, activeTab } = useApp();
  const [selectedEvent, setSelectedEvent] = useState(null);

  // If user is not authenticated, show onboarding/login views
  if (!currentUser) {
    return <Onboarding />;
  }

  // Render view corresponding to active tab selection
  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeDashboard setSelectedEvent={setSelectedEvent} />;
      case 'events':
        return <EventsView setSelectedEvent={setSelectedEvent} />;
      case 'calendar':
        return <CalendarView setSelectedEvent={setSelectedEvent} />;
      case 'analytics':
        return <AnalyticsView />;
      case 'profile':
        return <ProfileView />;
      case 'treasurer':
        return <TreasurerDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomeDashboard setSelectedEvent={setSelectedEvent} />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar (PC) / Bottom Nav (Mobile) */}
      <Navigation />

      {/* Main viewport area */}
      <main className="main-content">
        {renderActiveView()}
      </main>

      {/* Global Event detail popup card overlay */}
      {selectedEvent && (
        <EventDetailModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  )
}

export default App

