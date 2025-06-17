import React from 'react';

const DemoButton = ({ onDemo }) => {
  const handleDemo = () => {
    // Simulate dropping the Users table into Code Generator
    const demoData = {
      entityId: 1,
      name: 'Users',
      fields: ['id (PK)', 'username', 'email', 'created_at'],
      type: 'er-entity',
      timestamp: new Date().toISOString(),
      droppedAt: new Date().toLocaleTimeString(),
      dropZone: 'codeGenerator'
    };
    
    onDemo('codeGenerator', demoData);
    
    // After a delay, also demo dropping Orders into Documentation
    setTimeout(() => {
      const demoData2 = {
        entityId: 2,
        name: 'Orders',
        fields: ['id (PK)', 'user_id (FK)', 'total', 'status'],
        type: 'er-entity',
        timestamp: new Date().toISOString(),
        droppedAt: new Date().toLocaleTimeString(),
        dropZone: 'documentation'
      };
      onDemo('documentation', demoData2);
    }, 1000);
    
    // And finally demo dropping Products into Query Builder
    setTimeout(() => {
      const demoData3 = {
        entityId: 3,
        name: 'Products',
        fields: ['id (PK)', 'name', 'price', 'category'],
        type: 'er-entity',
        timestamp: new Date().toISOString(),
        droppedAt: new Date().toLocaleTimeString(),
        dropZone: 'queryBuilder'
      };
      onDemo('queryBuilder', demoData3);
    }, 2000);
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      <button
        onClick={handleDemo}
        style={{
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,123,255,0.3)',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.background = '#0056b3';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseOut={(e) => {
          e.target.style.background = '#007bff';
          e.target.style.transform = 'translateY(0)';
        }}
      >
        🎯 Demo Drag & Drop Functionality
      </button>
      <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
        Click to see automated drag and drop demonstration
      </p>
    </div>
  );
};

export default DemoButton;