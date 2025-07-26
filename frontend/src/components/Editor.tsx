import { useEditor, EditorContent, HTMLContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style'
import { FontSize } from './extensions/FontSize'
import { Placeholder } from '@tiptap/extension-placeholder'
import { RiAttachmentLine } from 'react-icons/ri';
import { GrBlockQuote } from "react-icons/gr";
import { MdPreview } from "react-icons/md";
import { useEffect, useRef, useState } from 'react';
import { FaBold, FaItalic, FaUnderline, FaUndo, FaRedo } from 'react-icons/fa';
import { ResizableImage } from './extensions/Image';

type clickedType = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
};

const TiptapEditor = () => {
  const [clicked, setClicked] = useState<clickedType>({
    bold: false,
    italic: false,
    underline: false,
  });
  const [title, setTitle] = useState<string>('Title');
  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview,setPreview] = useState<boolean>(false);
  const [body,setBody] = useState<string>('');

  const editor = useEditor({
    extensions: [
        StarterKit,
        TextStyle,
        FontSize,
        ResizableImage,
        Placeholder.configure({
            placeholder: '...',
            emptyEditorClass: 'is-editor-empty',
            showOnlyWhenEditable: true,
        })
    ],
    content: '',
  });

  useEffect(() => {
    const chain = editor.chain().focus();
    clicked.bold ? chain.setMark('bold').run() : chain.unsetMark('bold').run();
    clicked.italic ? chain.setMark('italic').run() : chain.unsetMark('italic').run();
    clicked.underline ? chain.setMark('underline').run() : chain.unsetMark('underline').run();
  },[clicked])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        const key = e.key.toLowerCase();

        if (['b', 'i', 'u'].includes(key)) {
          e.preventDefault();
          editor.chain().focus();
          let button = key === 'b' ? 'bold' : key === 'i' ? 'italic' : 'underline'
          handleClick(button)
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [editor]);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [title]);

  const handleClick = (button: keyof clickedType) => {
    const chain = editor?.chain().focus();
    if (!chain) {
      setClicked({ bold: false, italic: false, underline: false });
      return;
    }
    setClicked(prev => ({
        ...prev,
        [button]: !prev[button],
    }))
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file) {
        const url = URL.createObjectURL(file);
        editor?.chain().focus().setImage({ src:url }).run();
    }
  }

  const handlePreview = () => {
    if(editor) {
        setPreview(!preview);
        setBody(editor.getHTML());
        console.log(editor.getHTML())
    }
  }

  return (
    <div className="w-full relative flex flex-col items-center justify-center gap-10 bg-black py-20">
        <div className="w-full flex flex-col justify-center items-center gap-10 mb-10">
            <textarea
              className="text-primary w-4/5 text-6xl text-center font-bold bg-black text-wrap focus:outline-none resize-none"
              value={title}
              rows={1}
              ref={titleRef}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="flex items-center justify-center w-1/2 mx-auto">
            <div className="w-1/2 border-t-2 border-solid border-primary"></div>
            <span className="mx-4 text-xl text-primary font-bold">ॐ</span>
            <div className="w-1/2 border-t-2 border-solid border-primary flex-grow"></div>
            </div>
        </div>

        <EditorContent 
          editor={editor} 
          className="text-white text-[1.5rem] border border-solid border-white w-4/5 p-5 whitespace-pre-wrap" />
        
        <div className='flex gap-5 sticky bottom-10 items-center justify-center'>
            <div className="flex items-center justify-center gap-2 bg-white p-3 rounded-full">
        
                <button
                  className={`text-[2rem] cursor-pointer hover:scale-110 bg-none p-1 rounded-lg `}
                  onClick={() => fileRef.current?.click()}>
                    <RiAttachmentLine />
                    <input 
                        type="file"
                        ref={fileRef}
                        onChange={handleFileInput}
                        accept='.jpg,.png,.webp,.jpeg,.mp4,.mkv'
                        className='hidden'
                    />
                </button>

                <select 
                  defaultValue={"normal"}
                  className='text-center outline-none cursor-pointer' name="size"
                  onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}>
                    <option value="small">Small</option>
                    <option value="normal">Normal</option>
                    <option value="large">Large</option>
                    <option value="huge">Huge</option>
                </select>

                <button
                  className={`text-[1.5rem] cursor-pointer hover:scale-110 bg-none p-1 rounded-lg  ${
                    clicked.bold ? 'text-primary scale-110' : 'text-black'
                  }`}
                  onClick={() => handleClick('bold')}
                >
                  <FaBold />
                </button>

                <button
                  className={`text-[1.5rem] cursor-pointer hover:scale-110 bg-none p-1 rounded-lg  ${
                    clicked.italic ? 'text-primary scale-110' : 'text-black'
                  }`}
                  onClick={() => handleClick('italic')}
                >
                  <FaItalic />
                </button>

                <button
                className={`text-[1.5rem] cursor-pointer hover:scale-110 bg-none p-1 rounded-lg  ${
                    clicked.underline ? 'text-primary scale-110' : 'text-black'
                  }`}
                  onClick={() => handleClick('underline')}
                >
                  <FaUnderline />
                </button>

                <button
                    className={`text-[2rem] cursor-pointer hover:scale-110 bg-none p-1 rounded-lg `}
                    onClick={() => editor?.commands.toggleBlockquote()}
                >
                    <GrBlockQuote />
                </button>

                <button
                  className="text-[1.5rem] cursor-pointer hover:scale-110 bg-none p-1 rounded-lg text-black "
                  onClick={() => editor.chain().focus().undo().run()}
                >
                  <FaUndo />
                </button>

                <button
                  className="text-[1.5rem] cursor-pointer hover:scale-110 bg-none p-1 rounded-lg text-black "
                  onClick={() => editor.chain().focus().redo().run()}
                >
                  <FaRedo />
                </button>
            </div>

            <div className='bg-white p-2 rounded-2xl flex items-center justify-center'>
                <button
                  className={`text-[2.5rem] cursor-pointer hover:scale-110 bg-none rounded-lg text-black ${preview ? 'text-primary' : ''}`}
                  onClick={() => handlePreview()}
                >
                  <MdPreview />
                </button>
            </div>
        </div>

        {
            preview &&
            <div
              className='w-11/12 border border-solid border-white absolute top-0 flex flex-col items-center justify-center gap-10 bg-black py-20'
            >
                <div className="w-full flex flex-col justify-center items-center gap-10 mb-10">
                    <div
                      className="text-primary w-4/5 text-6xl text-center font-bold bg-black text-wrap focus:outline-none resize-none"
                    >
                        {title}
                    </div>

                    <div className="flex items-center justify-center w-1/2 mx-auto">
                        <div className="w-1/2 border-t-2 border-solid border-primary">
                    </div>
                    <span className="mx-4 text-xl text-primary font-bold">ॐ</span>
                    <div className="w-1/2 border-t-2 border-solid border-primary flex-grow"></div>
                    </div>
                </div>

                <div 
                  className='text-white w-4/5 p-5 whitespace-pre-wrap'
                  dangerouslySetInnerHTML={{
                      __html : body
                  }}      
                >
                </div>

            </div>
        }

    </div>
  );
};

export default TiptapEditor;
