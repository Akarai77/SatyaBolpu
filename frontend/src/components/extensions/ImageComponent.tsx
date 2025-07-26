import { NodeViewWrapper } from '@tiptap/react';
import { useRef, useState, useEffect } from 'react';

interface ResizableImageProps {
  node: {
    attrs: {
      src: string;
      width?: string | number;
      height?: string | number;
      alt?: string;
      align?: 'left' | 'center' | 'right';
    };
  };
  updateAttributes: (attrs: Record<string, any>) => void;
  selected: boolean;
  deleteNode: () => void;
}

const ResizableImageComponent = ({ node, updateAttributes, selected, deleteNode }: ResizableImageProps) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [align, setAlign] = useState<string>(node.attrs.align || 'left'); // Local state for alignment

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
    if (!imgRef.current || !wrapperRef.current) return;

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

  const startResize = (e: React.MouseEvent) => {
    if (!imgRef.current || !wrapperRef.current) return;
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = imgRef.current.offsetWidth;

    const computedStyle = window.getComputedStyle(imgRef.current);
    const maxWidthStr = computedStyle.maxWidth;
    let maxWidth = parseFloat(maxWidthStr);

    if (maxWidthStr.endsWith('%') && wrapperRef.current) {
      const parentWidth = wrapperRef.current.parentElement?.offsetWidth || window.innerWidth;
      maxWidth = (parseFloat(maxWidthStr) / 100) * parentWidth;
    } else if (maxWidthStr === 'none' || maxWidthStr === 'auto' || isNaN(maxWidth)) {
      maxWidth = wrapperRef.current.parentElement?.offsetWidth || imgRef.current.naturalWidth;
    }

    const doResize = (moveEvent: MouseEvent) => {
      let newWidth = Math.max(50, startWidth + (moveEvent.clientX - startX));
      newWidth = Math.min(newWidth, maxWidth);

      updateAttributes({
        width: `${newWidth}px`,
      });
    };

    const stopResize = () => {
      window.removeEventListener('mousemove', doResize);
      window.removeEventListener('mouseup', stopResize);
    };

    window.addEventListener('mousemove', doResize);
    window.addEventListener('mouseup', stopResize);
  };

  const handleMenuAction = (action: 'left' | 'center' | 'right' | 'delete') => {
    if (action === 'delete') {
      deleteNode();
    } else {
      setAlign(action);
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
        className={`relative ${align === 'center' ? 'ml-auto mr-auto' : 
                               align === 'right' ? 'ml-auto' : 
                               align === 'left' ? 'mr-auto' : ''}`}
      >
        <img
          ref={imgRef}
          src={node.attrs.src}
          width={node.attrs.width}
          height={node.attrs.height}
          alt={node.attrs.alt || 'Resizable image'}
          onContextMenu={handleContextMenu}
          className={`max-w-full ${selected ? 'border border-solid border-blue-500' : ''}`}
          style={{ opacity: selected ? 0.9 : 1, display: 'block' }}
        />
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
        {selected && (
          <div
            onMouseDown={startResize}
            className="absolute right-[-8px] bottom-[-8px] w-4 h-4 bg-blue-500 cursor-se-resize z-10 rounded-full"
          />
        )}
      </div>
    </NodeViewWrapper>
  );
};

export default ResizableImageComponent;
