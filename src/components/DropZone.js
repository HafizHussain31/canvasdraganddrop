import React, { useState, useEffect, useRef } from 'react';

const DropZone = ({ title, description, zone, items, onDrop, onClear }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const dropZoneRef = useRef();

  useEffect(() => {
    const dropZone = dropZoneRef.current;
    if (!dropZone) return;

    // Handle custom entity drop events
    const handleEntityDrop = (e) => {
      setIsDragOver(false);
      const data = e.detail;
      
      if (data.type === 'er-entity') {
        onDrop(zone, {
          ...data,
          droppedAt: new Date().toLocaleTimeString(),
          dropZone: zone
        });
      }
    };

    dropZone.addEventListener('entityDrop', handleEntityDrop);

    return () => {
      dropZone.removeEventListener('entityDrop', handleEntityDrop);
    };
  }, [zone, onDrop]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    // Only set drag over to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      // Try to get JSON data first
      let data;
      const jsonData = e.dataTransfer.getData("application/json");
      const textData = e.dataTransfer.getData("text/plain");

      if (jsonData) {
        data = JSON.parse(jsonData);
      } else if (textData) {
        data = JSON.parse(textData);
      } else {
        console.warn('No valid data found in drop event');
        return;
      }

      // Validate that it's an ER entity
      if (data.type === 'er-entity') {
        onDrop(zone, {
          ...data,
          droppedAt: new Date().toLocaleTimeString(),
          dropZone: zone
        });
      } else {
        console.warn('Invalid data type dropped:', data.type);
      }
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  };

  const handleMouseEnter = () => {
    setIsDragOver(true);
  };

  const handleMouseLeave = () => {
    setIsDragOver(false);
  };

  const formatFieldsList = (fields) => {
    return fields.join(', ');
  };

  const getZoneIcon = (zone) => {
    switch (zone) {
      case 'codeGenerator':
        return '⚡';
      case 'documentation':
        return '📚';
      case 'queryBuilder':
        return '🔍';
      default:
        return '📦';
    }
  };

  const getZoneAction = (zone) => {
    switch (zone) {
      case 'codeGenerator':
        return 'Generate Code';
      case 'documentation':
        return 'Create Documentation';
      case 'queryBuilder':
        return 'Build Query';
      default:
        return 'Process';
    }
  };

  return (
    <div
      ref={dropZoneRef}
      className={`drop-zone ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h3>
        {getZoneIcon(zone)} {title}
      </h3>
      <p>{description}</p>
      
      {items.length === 0 ? (
        <div style={{ color: '#ccc', fontStyle: 'italic' }}>
          Drop ER entities here
        </div>
      ) : (
        <div className="dropped-items">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <small style={{ color: '#666' }}>
              {items.length} item{items.length !== 1 ? 's' : ''} dropped
            </small>
            <button
              onClick={onClear}
              style={{
                background: '#ff4757',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          </div>
          
          {items.map((item, index) => (
            <div key={`${item.entityId}-${index}`} className="dropped-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <strong>{item.name}</strong>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    Fields: {formatFieldsList(item.fields)}
                  </div>
                  <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                    Dropped at: {item.droppedAt}
                  </div>
                </div>
                <button
                  style={{
                    background: '#2ecc71',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    marginLeft: '8px'
                  }}
                  onClick={() => {
                    alert(`${getZoneAction(zone)} for "${item.name}" table!\n\nFields: ${item.fields.join(', ')}\n\nThis would typically trigger the actual ${zone} functionality.`);
                  }}
                >
                  {getZoneAction(zone)}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropZone;