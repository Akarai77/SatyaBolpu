import { NodeViewWrapper } from '@tiptap/react';
import { useRef, useState, useEffect } from 'react';

interface AudioComponentProps {
  node: {
    attrs: {
      src: string;
      type: string;
      controls: boolean;
      align?: 'left' | 'center' | 'right';
    };
  };
  updateAttributes: (attrs: Record<string, any>) => void;
  deleteNode: () => void;
}

const AudioComponent = ({ node, updateAttributes, deleteNode }: AudioComponentProps) => {
  const audioRef = useRef<HTMLVideoElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (showMenu && wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [showMenu]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!audioRef.current || !wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const menuWidth = 120;
    const menuHeight = 120;
    const maxX = rect.width - menuWidth;
    const maxY = rect.height - menuHeight;

    setMenuPosition({
      x: Math.min(Math.max(x, 0), maxX),
      y: Math.min(Math.max(y, 0), maxY),
    });
    setShowMenu(true);
  };

  const handleMenuAction = (action: 'left' | 'center' | 'right' | 'delete') => {
    if (action === 'delete') {
      deleteNode();
    } else {
      updateAttributes({ align: action });
    }
    setShowMenu(false);
  };

  return (
    <NodeViewWrapper
      className="relative flex"
    >
      <div
      ref={wrapperRef}
        className={`relative 
            ${node.attrs.align === 'center' ? 'ml-auto mr-auto' : 
              node.attrs.align === 'right' ? 'ml-auto' : 
              node.attrs.align === 'left' ? 'mr-auto' : ''}`}
      >
        <audio
          controls={node.attrs.controls}
          ref={audioRef}
          onContextMenu={handleContextMenu}
        >
            <source src={node.attrs.src} type={node.attrs.type} />
        </audio>
        <div
          className={`absolute bg-white border border-solid border-black z-20 text-sm ${showMenu ? 'block' : 'hidden'}`}
          style={{
            top: `${menuPosition.y}px`,
            left: `${menuPosition.x}px`,
            minWidth: '100px',
          }}
        >
          <ul className="list-none m-0 p-0 text-black text-center">
            <li
              className="cursor-pointer hover:bg-gray-100 p-1"
              onClick={() => handleMenuAction('left')}
            >
              Align Left
            </li>
            <li
              className="cursor-pointer hover:bg-gray-100 p-1"
              onClick={() => handleMenuAction('center')}
            >
              Align Center
            </li>
            <li
              className="cursor-pointer hover:bg-gray-100 p-1"
              onClick={() => handleMenuAction('right')}
            >
              Align Right
            </li>
            <li
              className="cursor-pointer hover:bg-red-100 text-red-600 p-1"
              onClick={() => handleMenuAction('delete')}
            >
              Delete
            </li>
          </ul>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default AudioComponent;

