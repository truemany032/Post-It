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
  onTouchStart,
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
      onTouchStart={onTouchStart}
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
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Connect"
        >
          {/* Inline SVG */}
          <svg width="22" height="22" viewBox="0 0 31.891 31.891" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#494c4e" d="M30.543,5.74l-4.078-4.035c-1.805-1.777-4.736-1.789-6.545-0.02l-4.525,4.414c-1.812,1.768-1.82,4.648-0.02,6.424
              l2.586-2.484c-0.262-0.791,0.061-1.697,0.701-2.324l2.879-2.807c0.912-0.885,2.375-0.881,3.275,0.01l2.449,2.42
              c0.9,0.891,0.896,2.326-0.01,3.213l-2.879,2.809c-0.609,0.594-1.609,0.92-2.385,0.711l-2.533,2.486
              c1.803,1.781,4.732,1.789,6.545,0.02l4.52-4.41C32.34,10.396,32.346,7.519,30.543,5.74z"/>
            <path fill="#494c4e" d="M13.975,21.894c0.215,0.773-0.129,1.773-0.752,2.381l-2.689,2.627c-0.922,0.9-2.414,0.895-3.332-0.012l-2.498-2.461
              c-0.916-0.906-0.91-2.379,0.012-3.275l2.691-2.627c0.656-0.637,1.598-0.961,2.42-0.689l2.594-2.57
              c-1.836-1.811-4.824-1.82-6.668-0.02l-4.363,4.26c-1.846,1.803-1.855,4.734-0.02,6.549l4.154,4.107
              c1.834,1.809,4.82,1.818,6.668,0.018l4.363-4.26c1.844-1.805,1.852-4.734,0.02-6.547L13.975,21.894z"/>
            <path fill="#494c4e" d="M11.139,20.722c0.611,0.617,1.611,0.623,2.234,0.008l7.455-7.416c0.621-0.617,0.625-1.615,0.008-2.234
              c-0.613-0.615-1.611-0.619-2.23-0.006l-7.457,7.414C10.529,19.103,10.525,20.101,11.139,20.722z"/>
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
        onTouchStart={e => { e.stopPropagation(); e.preventDefault(); onResizeStart(e, note.id); }}
        style={{
          position: 'absolute',
          right: 4,
          bottom: 4,
          width: 28,
          height: 28,
          cursor: 'nwse-resize',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          padding: 0,
        }}
        title="Resize"
      >
        {/* Inline SVG */}
        <svg width="24" height="24" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#494c4e" d="M14.228 16.227a1 1 0 0 1-.707-1.707l1-1a1 1 0 0 1 1.416 1.414l-1 1a1 1 0 0 1-.707.293zm-5.638 0a1 1 0 0 1-.707-1.707l6.638-6.638a1 1 0 0 1 1.416 1.414l-6.638 6.638a1 1 0 0 1-.707.293zm-5.84 0a1 1 0 0 1-.707-1.707L14.52 2.043a1 1 0 1 1 1.415 1.414L3.457 15.934a1 1 0 0 1-.707.293z"/>
        </svg>
      </div>
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