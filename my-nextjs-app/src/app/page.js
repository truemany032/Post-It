'use client'
import { useState, useEffect } from 'react';
import PostItNote from '../components/PostItNote';

function getId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [dragId, setDragId] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [connecting, setConnecting] = useState(null);
  const [resizingId, setResizingId] = useState(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // โหลดข้อมูลจาก localStorage เฉพาะฝั่ง client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setNotes(JSON.parse(localStorage.getItem('notes') || '[]'));
      setConnections(JSON.parse(localStorage.getItem('connections') || '[]'));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);
  useEffect(() => {
    localStorage.setItem('connections', JSON.stringify(connections));
  }, [connections]);

  const addNote = () => {
    setNotes([
      ...notes,
      {
        id: getId(),
        text: 'New Note',
        x: 120 + Math.random() * 200,
        y: 120 + Math.random() * 200,
        width: 170,
        height: 90,
        color: '#fffbe6',      // สีพื้นหลังเริ่มต้น
        textColor: '#333333',  // สีตัวอักษรเริ่มต้น (เพิ่มบรรทัดนี้)
      },
    ]);
  };

  const onMouseDown = (e, id) => {
    setDragId(id);
    const note = notes.find(n => n.id === id);
    setOffset({ x: e.clientX - note.x, y: e.clientY - note.y });
  };
  const onResizeStart = (e, id) => {
    e.preventDefault();
    setResizingId(id);
    const note = notes.find(n => n.id === id);
    setResizeStart({ x: e.clientX, y: e.clientY, width: note.width, height: note.height });
  };
  const onMouseMove = (e) => {
    if (dragId) {
      setNotes(notes =>
        notes.map(n =>
          n.id === dragId
            ? { ...n, x: e.clientX - offset.x, y: e.clientY - offset.y }
            : n
        )
      );
    }
    if (resizingId) {
      setNotes(notes =>
        notes.map(n =>
          n.id === resizingId
            ? {
                ...n,
                width: Math.max(100, resizeStart.width + (e.clientX - resizeStart.x)),
                height: Math.max(60, resizeStart.height + (e.clientY - resizeStart.y)),
              }
            : n
        )
      );
    }
  };
  const onMouseUp = () => {
    setDragId(null);
    setResizingId(null);
  };

  const startConnect = (id) => setConnecting(id);
  const finishConnect = (id) => {
    if (connecting && connecting !== id) {
      setConnections([...connections, { from: connecting, to: id }]);
    }
    setConnecting(null);
  };
  const onCancelConnect = () => setConnecting(null);

  const editNote = (id, text, textColor) => {
    setNotes(notes =>
      notes.map(n =>
        n.id === id
          ? { ...n, text, textColor: textColor !== undefined ? textColor : n.textColor }
          : n
      )
    );
  };

  const deleteNote = (id) => {
    setNotes(notes => notes.filter(n => n.id !== id));
    setConnections(connections => connections.filter(c => c.from !== id && c.to !== id));
  };

  const removeConnection = (fromId, toId) => {
    setConnections(connections =>
      connections.filter(c => !(c.from === fromId && c.to === toId))
    );
  };

  const changeNoteColor = (id, color) => {
    setNotes(notes => notes.map(n => n.id === id ? { ...n, color } : n));
  };

  const renderConnections = () => (
    <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
      {connections.map((c, i) => {
        const from = notes.find(n => n.id === c.from);
        const to = notes.find(n => n.id === c.to);
        if (!from || !to) return null;
        // คำนวณจุดกลางระหว่าง from กับ to
        const x1 = from.x + (from.width || 170) / 2;
        const y1 = from.y + (from.height || 90) / 2;
        const x2 = to.x + (to.width || 170) / 2;
        const y2 = to.y + (to.height || 90) / 2;
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        return (
          <g key={i}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#6c757d"
              strokeWidth={2.5}
              markerEnd="url(#arrowhead)"
            />
            {/* ปุ่มกรรไกร */}
            <foreignObject x={mx - 12} y={my - 12} width={24} height={24} style={{ pointerEvents: 'auto' }}>
              <button
                onClick={e => {
                  e.stopPropagation();
                  removeConnection(c.from, c.to);
                }}
                style={{
                  background: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px #aaa',
                  padding: 0,
                }}
                title="ลบเส้นเชื่อมนี้"
              >
                {/* SVG กรรไกร */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="6" cy="6" r="2" stroke="#888" strokeWidth="2"/>
                  <circle cx="6" cy="18" r="2" stroke="#888" strokeWidth="2"/>
                  <line x1="8" y1="8" x2="20" y2="20" stroke="#888" strokeWidth="2"/>
                  <line x1="8" y1="16" x2="20" y2="4" stroke="#888" strokeWidth="2"/>
                </svg>
              </button>
            </foreignObject>
          </g>
        );
      })}
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L8,4 L0,8 L2,4 z" fill="#6c757d" />
        </marker>
      </defs>
    </svg>
  );

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        background: 'linear-gradient(135deg, #f7f7f7 60%, #ffe066 100%)',
        overflow: 'hidden'
      }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <button
        onClick={addNote}
        style={{
          position: 'absolute',
          top: 18,
          left: 18,
          zIndex: 2,
          background: '#ffd166',
          border: 'none',
          borderRadius: 8,
          padding: '10px 18px',
          fontWeight: 'bold',
          fontSize: 16,
          boxShadow: '1px 1px 8px #e9c46a',
        }}
      >
        + Add Post-it
      </button>
      {renderConnections()}
      {notes.map(note => (
        <PostItNote
          key={note.id}
          note={note}
          isDragging={dragId === note.id}
          onMouseDown={e => onMouseDown(e, note.id)}
          onEdit={editNote}
          onDelete={deleteNote}
          onStartConnect={startConnect}
          onFinishConnect={finishConnect}
          connecting={connecting}
          onResizeStart={onResizeStart}
          onCancelConnect={onCancelConnect}
          onChangeColor={changeNoteColor}
        />
      ))}
    </div>
  );
}
