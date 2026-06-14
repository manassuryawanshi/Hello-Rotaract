import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

const ReportGenerator = forwardRef(({ event, organizers, attendanceCount, images }, ref) => {
  const reportRef = useRef(null);

  useImperativeHandle(ref, () => ({
    generatePDF: async () => {
      if (!reportRef.current) return;
      
      try {
        // We temporarily display the element to screenshot it, then hide it again.
        // Or we just keep it off-screen but visible to the DOM (position absolute, left: -9999px)
        const canvas = await html2canvas(reportRef.current, {
          scale: 2, // High resolution
          useCORS: true,
          logging: false
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        // A4 paper dimensions
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${event.title.replace(/\s+/g, '_')}_Report.pdf`);
        return true;
      } catch (err) {
        console.error("Failed to generate PDF", err);
        throw err;
      }
    }
  }));

  // Render the report off-screen
  return (
    <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', pointerEvents: 'none' }}>
      <div 
        ref={reportRef} 
        style={{ 
          width: '800px', // Fixed width for consistent screenshot rendering
          padding: '40px',
          backgroundColor: '#ffffff',
          color: '#1a1a1a',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        {/* Header */}
        <div style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '20px', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 10px 0', color: '#111827' }}>
            Event Report: {event.title}
          </h1>
          <div style={{ display: 'flex', gap: '20px', color: '#4b5563', fontSize: '14px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} />
              {new Date(event.startTime).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} />
              {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} />
              {event.venue}
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: '#374151' }}>Description</h3>
          <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#4b5563', whiteSpace: 'pre-wrap' }}>
            {event.description || 'No description provided.'}
          </p>
        </div>

        {/* Stats & Leadership Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
          {/* Attendance Stats */}
          <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} />
              Attendance Summary
            </h3>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#111827' }}>
              {attendanceCount}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Total Attendees</div>
          </div>

          {/* Coordinators */}
          <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px', color: '#374151' }}>
              Event Leaders / Coordinators
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {organizers.map(organizer => (
                <div key={organizer.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: '#4b5563', fontSize: '14px' }}>
                    {organizer.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{organizer.name}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{organizer.isBOD ? 'Board Member' : 'Club Member'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Images Grid */}
        {images && images.length > 0 && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '15px', color: '#374151' }}>Event Gallery</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {images.map((imgSrc, index) => (
                <div key={index} style={{ height: '200px', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={imgSrc} alt={`Event shot ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e5e7eb', textAlign: 'center', color: '#9ca3af', fontSize: '12px' }}>
          Automated Report Generated by Hello-Rotaract • {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
});

export default ReportGenerator;
