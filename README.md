# Canvas ER Diagram Drag & Drop Application

A ReactJS application demonstrating drag-and-drop functionality from a canvas-based Entity-Relationship (ER) diagram to external tools. This implementation showcases how to enable HTML5 drag-and-drop from canvas elements using invisible DOM elements strategy.

## 🎯 Features

### Canvas-Based ER Diagram
- **Interactive Database Tables**: Four sample entities (Users, Orders, Products, OrderItems)
- **Visual Relationships**: Connected lines showing table relationships
- **Hover Effects**: Enhanced styling and entity information tooltips
- **Professional Design**: Color-coded tables with shadows and animations

### Drag-and-Drop Functionality
- **Canvas Entity Detection**: Precise mouse coordinate mapping to detect clicked tables
- **Invisible DOM Elements**: Creates temporary draggable elements for canvas entities
- **HTML5 DataTransfer API**: Complete JSON metadata transfer between components
- **Cross-Browser Support**: Dual approach with HTML5 drag-and-drop and mouse-based fallback
- **Error-Safe Implementation**: Graceful handling of browser compatibility issues

### External Drop Zones
- **Code Generator** ⚡: Simulates code generation from database schemas
- **Documentation** 📚: Creates documentation from entity metadata
- **Query Builder** 🔍: Builds SQL queries from table structures
- **Visual Feedback**: Drag-over highlighting and drop confirmation
- **Action Buttons**: Interactive buttons for each dropped entity

## 🏗️ Architecture

### Core Components

#### [`CanvasER.js`](src/components/CanvasER.js)
The main canvas component that renders the ER diagram and handles drag operations.

**Key Features:**
- Canvas rendering with HTML5 Canvas API
- Entity detection using mouse coordinates
- Drag element creation and management
- HTML5 drag-and-drop event handling
- Mouse-based drag fallback

**Sample Entity Structure:**
```javascript
{
  id: 1,
  name: 'Users',
  x: 50, y: 50,
  width: 120, height: 100,
  fields: ['id (PK)', 'username', 'email', 'created_at'],
  color: '#4CAF50'
}
```

#### [`DropZone.js`](src/components/DropZone.js)
Handles drop operations and displays dropped entities.

**Key Features:**
- HTML5 drop event handling
- Custom entity drop event support
- Visual drag-over effects
- Dropped item management and display
- Action button integration

#### [`DemoButton.js`](src/components/DemoButton.js)
Provides automated demonstration of the drag-and-drop functionality.

**Features:**
- Simulates dropping entities into all zones
- Timed sequence demonstration
- Visual feedback and styling

#### [`App.js`](src/app.js)
Main application component that orchestrates all functionality.

**Responsibilities:**
- State management for dropped items
- Component coordination
- Drop event handling

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🎮 Usage

### Manual Drag-and-Drop
1. **Hover** over any table in the ER diagram to see entity information
2. **Click and drag** a table from the canvas
3. **Drop** it onto any of the three drop zones on the right
4. **Click action buttons** on dropped items to simulate tool functionality

### Demo Mode
- Click the **"🎯 Demo Drag & Drop Functionality"** button
- Watch automated demonstration of all three entities being dropped
- Observe the complete workflow in action

## 🔧 Technical Implementation

### Drag-and-Drop Strategy

The application implements the recommended strategy for canvas-based drag-and-drop:

1. **Track Mouse Events**: Detect clicks on canvas entities using coordinate mapping
2. **Create Temporary DOM Elements**: Generate draggable elements with entity data
3. **HTML5 Drag API**: Use DataTransfer to pass metadata between components
4. **Drop Target Logic**: Handle drops in external zones with visual feedback

### Data Transfer Format

```javascript
{
  entityId: 1,
  name: 'Users',
  fields: ['id (PK)', 'username', 'email', 'created_at'],
  type: 'er-entity',
  timestamp: '2024-01-01T12:00:00.000Z',
  droppedAt: '12:00:00 PM',
  dropZone: 'codeGenerator'
}
```

### Error Handling

- **Safe DataTransfer Operations**: Checks for method availability before calling
- **Cross-Browser Compatibility**: Fallback mechanisms for unsupported features
- **Graceful Degradation**: Works even with limited HTML5 drag support

## 📁 Project Structure

```
src/
├── components/
│   ├── CanvasER.js          # Main canvas component
│   ├── DropZone.js          # Drop zone component
│   └── DemoButton.js        # Demo functionality
├── App.js                   # Main application
├── index.js                 # React entry point
└── index.css                # Global styles
```

## 🎨 Styling

The application uses a modern, professional design with:

- **Color-coded entities** for easy identification
- **Hover effects** with shadows and highlighting
- **Drag feedback** with visual element following cursor
- **Drop zone highlighting** during drag operations
- **Responsive layout** with flexible containers

## 🔍 Key Code Patterns

### Entity Detection
```javascript
const detectEntityAt = (event) => {
  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  return entities.find(entity =>
    x >= entity.x && x <= entity.x + entity.width &&
    y >= entity.y && y <= entity.y + entity.height
  );
};
```

### Drag Element Creation
```javascript
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
  opacity: 0;
  visibility: hidden;
`;
dragElement.draggable = true;
```

### Drop Event Handling
```javascript
const handleDrop = (e) => {
  e.preventDefault();
  const jsonData = e.dataTransfer.getData("application/json");
  const data = JSON.parse(jsonData);
  
  if (data.type === 'er-entity') {
    onDrop(zone, {
      ...data,
      droppedAt: new Date().toLocaleTimeString(),
      dropZone: zone
    });
  }
};
```

## 🐛 Troubleshooting

### Common Issues

1. **Drag not working**: Ensure the browser supports HTML5 drag-and-drop
2. **Drop zones not responding**: Check console for JavaScript errors
3. **Visual artifacts**: Clear browser cache and reload

### Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **IE**: Limited support (fallback to mouse events)

## 🚀 Future Enhancements

- **Multiple entity selection** for batch operations
- **Drag preview customization** with entity thumbnails
- **Undo/redo functionality** for drop operations
- **Export capabilities** for generated code/documentation
- **Real database integration** for live schema import
- **Collaborative features** for team-based diagram editing

## 📝 License

This project is created for demonstration purposes. Feel free to use and modify as needed.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with React, HTML5 Canvas, and modern JavaScript ES6+**