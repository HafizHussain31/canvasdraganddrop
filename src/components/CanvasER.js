import React, { useRef, useEffect, useState, useCallback } from 'react';

const CanvasER = () => {
  const canvasRef = useRef();
  const [entities, setEntities] = useState([]);
  const [hoveredEntity, setHoveredEntity] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Sample ER entities
  const sampleEntities = [
    {
      id: 1,
      name: 'Users',
      x: 50,
      y: 50,
      width: 120,
      height: 100,
      fields: ['id (PK)', 'username', 'email', 'created_at'],
      color: '#4CAF50'
    },
    {
      id: 2,
      name: 'Orders',
      x: 250,
      y: 50,
      width: 120,
      height: 100,
      fields: ['id (PK)', 'user_id (FK)', 'total', 'status'],
      color: '#2196F3'
    },
    {
      id: 3,
      name: 'Products',
      x: 450,
      y: 50,
      width: 120,
      height: 100,
      fields: ['id (PK)', 'name', 'price', 'category'],
      color: '#FF9800'
    },
    {
      id: 4,
      name: 'OrderItems',
      x: 150,
      y: 200,
      width: 120,
      height: 100,
      fields: ['id (PK)', 'order_id (FK)', 'product_id (FK)', 'quantity'],
      color: '#9C27B0'
    }
  ];

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw relationships first (lines behind entities)
    drawRelationships(ctx);

    // Draw entities
    entities.forEach(entity => {
      drawEntity(ctx, entity, entity.id === hoveredEntity?.id);
    });
  }, [entities, hoveredEntity]);

  useEffect(() => {
    setEntities(sampleEntities);
  }, []);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const drawEntity = (ctx, entity, isHovered) => {
    const { x, y, width, height, name, fields, color } = entity;

    // Shadow for hover effect
    if (isHovered) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
    }

    // Draw main rectangle
    ctx.fillStyle = isHovered ? lightenColor(color, 20) : color;
    ctx.fillRect(x, y, width, height);

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw border
    ctx.strokeStyle = isHovered ? '#333' : '#666';
    ctx.lineWidth = isHovered ? 2 : 1;
    ctx.strokeRect(x, y, width, height);

    // Draw title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(name, x + width / 2, y + 20);

    // Draw separator line
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 5, y + 25);
    ctx.lineTo(x + width - 5, y + 25);
    ctx.stroke();

    // Draw fields
    ctx.font = '11px Arial';
    ctx.textAlign = 'left';
    fields.forEach((field, index) => {
      ctx.fillText(field, x + 8, y + 40 + index * 15);
    });
  };

  const drawRelationships = (ctx) => {
    // Draw some sample relationships
    const relationships = [
      { from: entities[0], to: entities[1] }, // Users to Orders
      { from: entities[1], to: entities[3] }, // Orders to OrderItems
      { from: entities[2], to: entities[3] }  // Products to OrderItems
    ];

    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;

    relationships.forEach(rel => {
      if (rel.from && rel.to) {
        const fromX = rel.from.x + rel.from.width;
        const fromY = rel.from.y + rel.from.height / 2;
        const toX = rel.to.x;
        const toY = rel.to.y + rel.to.height / 2;

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
      }
    });
  };

  const lightenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  const detectEntityAt = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return entities.find(entity =>
      x >= entity.x &&
      x <= entity.x + entity.width &&
      y >= entity.y &&
      y <= entity.y + entity.height
    );
  };

  const handleMouseDown = (event) => {
    const entity = detectEntityAt(event);
    if (!entity) return;

    console.log('Starting drag for entity:', entity.name);

    // Create a simple draggable element (initially hidden)
    const dragElement = document.createElement('div');
    dragElement.innerHTML = `📊 ${entity.name}`;
    dragElement.style.cssText = `
      position: fixed;
      background: ${entity.color};
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      left: ${event.clientX - 60}px;
      top: ${event.clientY - 20}px;
      transform: rotate(-5deg);
      pointer-events: auto;
      cursor: grabbing;
      opacity: 0;
      visibility: hidden;
    `;
    dragElement.draggable = true;

    document.body.appendChild(dragElement);

    // Prepare drag data
    const dragData = {
      entityId: entity.id,
      name: entity.name,
      fields: entity.fields,
      type: 'er-entity',
      timestamp: new Date().toISOString()
    };

    let isDragging = false;

    // Set up drag events
    dragElement.addEventListener('dragstart', (e) => {
      console.log('Drag start event triggered');
      isDragging = true;
      
      // Show the drag element only when drag starts
      dragElement.style.opacity = '1';
      dragElement.style.visibility = 'visible';
      
      // Only set data if dataTransfer exists and has the methods
      if (e.dataTransfer && typeof e.dataTransfer.setData === 'function') {
        e.dataTransfer.setData("text/plain", JSON.stringify(dragData));
        e.dataTransfer.setData("application/json", JSON.stringify(dragData));
        e.dataTransfer.effectAllowed = "copy";
        
        // Only use setDragImage if it's available
        if (typeof e.dataTransfer.setDragImage === 'function') {
          const dragImage = document.createElement('div');
          dragImage.innerHTML = `📊 ${entity.name}`;
          dragImage.style.cssText = `
            background: ${entity.color};
            color: white;
            padding: 10px 15px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: bold;
            position: absolute;
            top: -1000px;
            left: -1000px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          `;
          document.body.appendChild(dragImage);
          
          try {
            e.dataTransfer.setDragImage(dragImage, 60, 20);
          } catch (error) {
            console.log('setDragImage not supported:', error);
          }
          
          setTimeout(() => {
            if (document.body.contains(dragImage)) {
              document.body.removeChild(dragImage);
            }
          }, 100);
        }
      }
    });

    dragElement.addEventListener('dragend', () => {
      console.log('Drag end event triggered');
      isDragging = false;
      if (document.body.contains(dragElement)) {
        document.body.removeChild(dragElement);
      }
    });

    // Mouse tracking for visual feedback (only when not using HTML5 drag)
    const handleMouseMove = (e) => {
      if (!isDragging) {
        dragElement.style.left = (e.clientX - 60) + 'px';
        dragElement.style.top = (e.clientY - 20) + 'px';
        dragElement.style.opacity = '1';
        dragElement.style.visibility = 'visible';
      }
    };

    const handleMouseUp = (e) => {
      console.log('Mouse up event triggered');
      
      // Only handle custom drop if HTML5 drag didn't work
      if (!isDragging) {
        const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
        const dropZone = elementBelow?.closest('.drop-zone');
        
        if (dropZone) {
          console.log('Dropped on zone:', dropZone);
          const dropEvent = new CustomEvent('entityDrop', {
            detail: dragData,
            bubbles: true
          });
          dropZone.dispatchEvent(dropEvent);
        }
      }

      // Clean up
      if (document.body.contains(dragElement)) {
        document.body.removeChild(dragElement);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Focus the element and start dragging
    dragElement.focus();
    
    // Try to trigger drag start, but don't force it if it fails
    setTimeout(() => {
      try {
        // Simple approach - just make the element visible and let native drag work
        dragElement.style.opacity = '1';
        dragElement.style.visibility = 'visible';
        
        // The element is already draggable=true, so native drag should work
        console.log('Drag element ready for native drag operation');
      } catch (error) {
        console.log('Drag initialization error:', error);
      }
    }, 50);
  };

  const handleMouseMove = (event) => {
    setMousePos({ x: event.clientX, y: event.clientY });

    const entity = detectEntityAt(event);
    setHoveredEntity(entity);

    // Change cursor
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = entity ? 'grab' : 'default';
    }
  };

  const handleMouseLeave = () => {
    setHoveredEntity(null);
  };

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={600}
        height={350}
        className="canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: hoveredEntity ? 'grab' : 'default' }}
      />
      
      {hoveredEntity && (
        <div
          className="entity-info"
          style={{
            left: mousePos.x + 10,
            top: mousePos.y - 50
          }}
        >
          <strong>{hoveredEntity.name}</strong>
          <br />
          Fields: {hoveredEntity.fields.length}
          <br />
          Click and drag to external tools
        </div>
      )}
    </div>
  );
};

export default CanvasER;