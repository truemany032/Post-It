import { useRef } from 'react';

export default function PostItNote({
  note,
  isDragging,
  onMouseDown,
  onEdit,
  onDelete,
  onStartConnect,
  onFinishConnect,
  connecting,
  onResizeStart,
  onCancelConnect,
  onChangeColor,
}) {
  // เพิ่มฟังก์ชันเปลี่ยนสีตัวอักษร
  const handleTextColorChange = (color) => {
    onEdit(note.id, note.text, color);
  };

  const removeConnection = (fromId, toId) => {
    setConnections(connections =>
      connections.filter(c => !(c.from === fromId && c.to === toId))
    );
  };

  const colorOptions = [
    { code: '#fffbe6' },
    { code: '#ffd166' },
    { code: '#06d6a0' },
    { code: '#ef476f' },
    { code: '#118ab2' },
    { code: '#073b4c' },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        left: note.x,
        top: note.y,
        width: note.width || 170,
        minHeight: note.height || 90,
        background: note.color || '#fffbe6',
        border: '2px solid #ffe066',
        borderRadius: 12,
        boxShadow: isDragging ? '4px 4px 16px #e9c46a' : '2px 2px 8px #ccc',
        padding: 12,
        zIndex: 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        transition: 'box-shadow 0.2s',
        resize: 'none',
      }}
      onMouseDown={onMouseDown}
    >
      {/* ปุ่มอยู่ด้านบน */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
        position: 'relative',
        top: -8,
        right: -8,
      }}>
        {/* ปุ่ม Connect (โซ่) */}
        <button
          onClick={e => { e.stopPropagation(); onStartConnect(note.id); }}
          style={{
            background: 'none',
            border: 'none',
            padding: 2,
            cursor: 'pointer',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Connect"
        >
          {/* SVG โซ่ */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M17 7l-1.41 1.41a5 5 0 010 7.07l-4.24 4.24a5 5 0 01-7.07-7.07l1.41-1.41" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 17l1.41-1.41a5 5 0 017.07 0l4.24-4.24a5 5 0 00-7.07-7.07L7 7" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {/* ปุ่ม Delete (X) */}
        <button
          onClick={e => { e.stopPropagation(); onDelete(note.id); }}
          style={{
            background: 'none',
            border: 'none',
            padding: 2,
            cursor: 'pointer',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Delete"
        >
          {/* SVG X */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" stroke="#e63946" strokeWidth="2" strokeLinecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="#e63946" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        {/* ปุ่ม Cancel Connect (กรรไกร) */}
        {connecting === note.id && (
          <button
            onClick={e => { e.stopPropagation(); onCancelConnect(); }}
            style={{
              background: 'none',
              border: 'none',
              padding: 2,
              cursor: 'pointer',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Cancel Connect"
          >
            {/* SVG กรรไกร */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="6" cy="6" r="2" stroke="#888" strokeWidth="2"/>
              <circle cx="6" cy="18" r="2" stroke="#888" strokeWidth="2"/>
              <line x1="8" y1="8" x2="20" y2="20" stroke="#888" strokeWidth="2"/>
              <line x1="8" y1="16" x2="20" y2="4" stroke="#888" strokeWidth="2"/>
            </svg>
          </button>
        )}
      </div>
      <textarea
        value={note.text || ''}
        onChange={e => onEdit(note.id, e.target.value, note.textColor)}
        style={{
          width: '100%',
          minHeight: 40,
          border: 'none',
          background: 'transparent',
          resize: 'none',
          fontWeight: 'bold',
          fontSize: 16,
          color: note.textColor || '#333',
        }}
      />
      {/* ปุ่ม Connect here */}
      {connecting && connecting !== note.id && (
        <button
          onClick={e => { e.stopPropagation(); onFinishConnect(note.id); }}
          style={{
            fontSize: 12,
            marginTop: 8,
            background: '#b7efc5',
            border: 'none',
            borderRadius: 4,
            padding: '2px 8px',
            width: '100%',
          }}
        >
          Connect here
        </button>
      )}
      {/* มุมจับสำหรับ resize */}
      <div
        onMouseDown={e => { e.stopPropagation(); onResizeStart(e, note.id); }}
        style={{
          position: 'absolute',
          right: 4,
          bottom: 4,
          width: 16,
          height: 16,
          background: '#ffd166',
          borderRadius: 4,
          cursor: 'nwse-resize',
          zIndex: 2,
        }}
        title="Resize"
      />
      {/* Color pickers */}
      <div style={{
        display: 'flex',
        gap: 8,
        position: 'absolute',
        left: 8,
        top: 8,
        zIndex: 3,
        background: 'rgba(255,255,255,0.7)',
        borderRadius: 6,
        padding: '2px 4px'
      }}>
        {/* เปลี่ยนสีพื้นหลัง */}
        <label title="เปลี่ยนสีพื้นหลัง">
          <input
            type="color"
            value={note.color || '#fffbe6'}
            onChange={e => {
              e.stopPropagation();
              onChangeColor(note.id, e.target.value);
            }}
            style={{
              width: 20,
              height: 20,
              border: 'none',
              background: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          />
        </label>
        {/* เปลี่ยนสีตัวอักษร */}
        <label title="เปลี่ยนสีตัวอักษร" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          {/* ไอคอน Aa */}
          <span style={{
            fontWeight: 'bold',
            fontSize: 16,
            marginRight: 2,
            color: note.textColor || '#333'
          }}>Aa</span>
          <input
            type="color"
            value={note.textColor || '#333333'}
            onChange={e => {
              e.stopPropagation();
              onEdit(note.id, note.text, e.target.value);
            }}
            style={{
              width: 20,
              height: 20,
              border: 'none',
              background: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          />
        </label>
      </div>
    </div>
  );
}