import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, MapPin, Share2, BookOpen, Video, CheckCircle2, UserCheck } from 'lucide-react';
import InitialsAvatar from './InitialsAvatar';

const EventDetailModal = ({ event, onClose }) => {
  const { profiles } = useApp();
  
  if (!event) return null;

  // Resolve coordinators list (assigned leaders profiles)
  const coordinatorsList = profiles.filter(
    p => event.coordinators && event.coordinators.includes(p.id)
  );
  
  // Fallback if none assigned
  const fallbackProfile = profiles.find(p => p.id === event.createdBy) || profiles[0];
  const organizers = coordinatorsList.length > 0 
    ? coordinatorsList 
    : fallbackProfile ? [fallbackProfile] : [];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${event.title}\n${event.description}\nVenue: ${event.venue}`);
      alert('Event details copied to clipboard!');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content liquid-glass-card slide-up" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-close-btn" onClick={onClose}>✕</div>
        
        <div className="event-details-popup">
          <span className={`event-tag ${event.tag === 'Ceremony' ? 'tag-ceremony' : event.tag === 'Community Service' ? 'tag-community' : 'tag-professional'}`}>
            {event.tag}
          </span>
          <h3>{event.title}</h3>
          
          <p className="description">{event.description || 'No description provided.'}</p>
          
          <div className="info-section">
            <div className="info-item">
              <Calendar size={18} />
              <span>{new Date(event.startTime).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="info-item">
              <Clock size={18} />
              <span>
                {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="info-item">
              <MapPin size={18} />
              <span>{event.venue}</span>
            </div>
          </div>
          
          {/* Leadership & Contact Section (Multiple coordinator profiles) */}
          <div className="leadership-contact">
            <h5>EVENT LEADERS / COORDINATORS</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              {organizers.map(organizer => (
                <div key={organizer.id} className="contact-person" style={{ background: 'var(--bg-primary)', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <InitialsAvatar name={organizer.name} size={40} />
                  <div className="contact-person-info">
                    <h6>{organizer.name}</h6>
                    <p>{organizer.isBOD ? 'Board Member' : 'Club Member'} • {organizer.rotaractId}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links Grid (Refined alignments, removed Register Now) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
            
            {/* Sibling secondary row */}
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button 
                className="btn-secondary" 
                onClick={handleShare}
                style={{ flex: 1, border: '1px solid var(--border-color)', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', borderRadius: '12px' }}
              >
                <Share2 size={15} />
                <span>Share Event</span>
              </button>

              {event.googleRulebookUrl && (
                <button 
                  className="btn-secondary" 
                  onClick={() => window.open(event.googleRulebookUrl, '_blank')}
                  style={{ flex: 1, border: '1px solid var(--border-color)', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', borderRadius: '12px' }}
                >
                  <BookOpen size={15} />
                  <span>Rulebook</span>
                </button>
              )}
            </div>

            {/* Bottom full CTA */}
            {event.meetLink && (
              <button 
                className="btn-secondary" 
                onClick={() => window.open(event.meetLink, '_blank')}
                style={{ width: '100%', border: '1px solid var(--border-color)', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', borderRadius: '12px' }}
              >
                <Video size={16} />
                <span>Join Online Meeting</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
