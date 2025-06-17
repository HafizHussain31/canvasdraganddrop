import React, { useState } from 'react';
import CanvasER from './components/CanvasER';
import DropZone from './components/DropZone';
import DemoButton from './components/DemoButton';

function App() {
  const [droppedItems, setDroppedItems] = useState({
    codeGenerator: [],
    documentation: [],
    queryBuilder: []
  });

  const handleDrop = (zone, data) => {
    setDroppedItems(prev => ({
      ...prev,
      [zone]: [...prev[zone], data]
    }));
  };

  const clearDropZone = (zone) => {
    setDroppedItems(prev => ({
      ...prev,
      [zone]: []
    }));
  };

  return (
    <div className="app">
      <div className="canvas-container">
        <h2>Canvas-Based ER Diagram</h2>
        <CanvasER />
        <DemoButton onDemo={handleDrop} />
        <div className="instructions">
          <h3>Instructions:</h3>
          <ul>
            <li>Click and drag any table from the ER diagram</li>
            <li>Drop it into one of the zones on the right</li>
            <li>The drag operation uses HTML5 DataTransfer API</li>
            <li>Canvas entities are made draggable using invisible DOM elements</li>
            <li>Hover over tables to see entity information</li>
            <li><strong>Or click the demo button above to see it in action!</strong></li>
          </ul>
        </div>
      </div>
      
      <div className="drop-zones">
        <DropZone
          title="Code Generator"
          description="Drop tables here to generate code"
          zone="codeGenerator"
          items={droppedItems.codeGenerator}
          onDrop={handleDrop}
          onClear={() => clearDropZone('codeGenerator')}
        />
        
        <DropZone
          title="Documentation"
          description="Drop tables here to generate docs"
          zone="documentation"
          items={droppedItems.documentation}
          onDrop={handleDrop}
          onClear={() => clearDropZone('documentation')}
        />
        
        <DropZone
          title="Query Builder"
          description="Drop tables here to build queries"
          zone="queryBuilder"
          items={droppedItems.queryBuilder}
          onDrop={handleDrop}
          onClear={() => clearDropZone('queryBuilder')}
        />
      </div>
    </div>
  );
}

export default App;