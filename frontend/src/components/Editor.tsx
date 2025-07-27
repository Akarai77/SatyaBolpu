import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style'
import { FontSize } from './extensions/FontSize'
import { Placeholder } from '@tiptap/extension-placeholder'
import { RiAttachmentLine } from 'react-icons/ri';
import { GrBlockQuote } from "react-icons/gr";
import { MdCancel, MdPreview } from "react-icons/md";
import { useEffect, useRef, useState } from 'react';
import { FaBold, FaItalic, FaUnderline, FaUndo, FaRedo } from 'react-icons/fa';
import { ResizableImage } from './extensions/Image';
import { useLenis } from '../context/LenisContext';
import { Video } from './extensions/Video';
import { Audio } from './extensions/Audio';
import Button from './Button';
import { Iframe } from './extensions/Iframe';

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
  const [fontSize,setFontSize] = useState<string>('normal');
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview,setPreview] = useState<boolean>(false);
  const [body,setBody] = useState<string>('');
  const [showAttachmentMenu,setShowAttachmentMenu] = useState<boolean>(false);
  const [askEmbedUrl,setAskEmbedUrl] = useState<boolean>(false);
  const [embedUrl,setEmbedUrl] = useState<string>('');
  const lenis = useLenis();

  const attachmentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
        if(attachmentRef.current && !attachmentRef.current.contains(e.target as Node)) {
            setShowAttachmentMenu(false);
        }
    }

    window.addEventListener('mousedown',handleClick);
    return () => window.removeEventListener('mousedown',handleClick);
  },[])

  const editor = useEditor({
    extensions: [
        StarterKit,
        TextStyle,
        FontSize,
        ResizableImage,
        Video,
        Audio,
        Iframe,
        Placeholder.configure({
            placeholder: '...',
            emptyEditorClass: 'is-editor-empty',
            showOnlyWhenEditable: true,
        })
    ],
    content: '',
    onUpdate: () => {
        setClicked({
            bold: editor.isActive('bold'),
            italic: editor.isActive('italic'),
            underline: editor.isActive('underline')
        })
        setFontSize(
            editor.getAttributes('textStyle').fontSize || 'normal'
        )
    }
  });

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

        if(key === 'p') {
            e.preventDefault()
            handlePreview()
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
  }, [title,preview]);

  const handleFontSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if(editor) {
          setFontSize(e.target.value);
          editor.chain().focus().setFontSize(e.target.value).run();
      }
  }

  const handleClick = (button: keyof clickedType) => {
      const chain = editor?.chain().focus();
      if (!chain) {
          setClicked({ bold: false, italic: false, underline: false });
          return;
      }

      setClicked(prev => {
          const newState = {
              ...prev,
              [button]: !prev[button],
          };

          if (newState[button]) {
              chain.setMark(button).run();
          } else {
              chain.unsetMark(button).run();
          }

          return newState;
      });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file) {
        const type = file.type.split('/')[0];
        const url = URL.createObjectURL(file);
        if(type === 'image') {
            editor?.chain().focus().setImage({ src:url }).run();
        } else if(type === 'video') {
            editor?.commands.insertContent({
                type: "video",
                attrs : {
                    src: url,
                    controls: true
                }
            })
        } else if(type == 'audio') {
            editor?.commands.insertContent({
                type: "audio",
                attrs : {
                    src: url,
                    controls: true
                }
            })
        }
    }
  }

  const handleEmbedUrl = () => {
    if(embedUrl) {
        setAskEmbedUrl(false)
        editor.commands.insertContent({
            type: "iframeEmbed",
            attrs: {
                html: embedUrl
            }
        })
    }
  }

  const formatHtml = (html: string) => {
      return html
      .replace(/<p>(.*?)<\/p>/gi, (_, content) => content.trim() === '' ? '<br>' : `${content}<br>`)
      .replace(/(<br>\s*)+$/g, '');
  };

  const decodeHtml = (html: string) => {
      const txt = document.createElement('textarea')
      txt.innerHTML = html
      return txt.value
  }


  const handlePreview = () => {
    if(editor) {
        setPreview(prev => !prev);
        setBody(formatHtml(editor.getHTML()));
        console.log(editor.getHTML())
    }
  }

  useEffect(() => {
      if (preview) {
          lenis.destroyLenis();
      }

      const videos = document.querySelectorAll('video');
      videos.forEach((vid) => {
          vid.pause();
          vid.currentTime = 0;
      });

      const audios = document.querySelectorAll('audio');
      audios.forEach((aud) => {
          aud.pause();
          aud.currentTime = 0;
      });

      const iframes = document.querySelectorAll('iframe');
      iframes.forEach((iframe) => {
          const src = iframe.src;
          iframe.src = '';
          iframe.src = src;
      });

      return () => {
          lenis.initLenis();
      };
  }, [preview]);

  return (
    <div className="w-full relative">
        <div className={`w-full relative flex-col items-center justify-center gap-10 py-20 bg-black
               ${askEmbedUrl ? 'pointer-events-none' : ''} ${preview ? 'hidden' : 'flex'}`}>
            <div className={`w-full h-full absolute top-0 z-10 bg-white bg-opacity-50 overflow-hidden
                   pointer-events-none ${askEmbedUrl ? '' : 'hidden'}`}
            ></div>
            {
                askEmbedUrl &&
                <div className='fixed w-1/3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                                 flex flex-col gap-5 items-center justify-center bg-black text-primary text-center p-5
                                 rounded-xl pointer-events-auto z-50'>
                    <label htmlFor="url" className='font-black text-[1.5rem]'>Enter Embed Url</label>
                    <input 
                      type="url" 
                      name='url' 
                      className='w-4/5 p-2 text-black' 
                      onInput={(e) => setEmbedUrl(e.target.value)}/>
                    <Button 
                      content='Submit' 
                      className='text-[1.2rem]'
                      onClick={handleEmbedUrl}/>
                </div>
            }
            <div className="w-full flex flex-col justify-center items-center gap-10 mb-10">
                <textarea
                  className="text-primary w-4/5 text-6xl text-center font-bold bg-black
                             text-wrap focus:outline-none resize-none [srollbar-width:none]"
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
            
                    <div className='relative flex flex-col items-center justify-center' ref={attachmentRef}>
                        <button
                          className={`text-[2rem] cursor-pointer hover:scale-110 bg-none p-1 rounded-lg `}
                          onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}>
                            <RiAttachmentLine />
                            <input 
                                type="file"
                                ref={fileRef}
                                onChange={handleFileInput}
                                accept='video/*,image/*,audio/*'
                                className='hidden'
                            />
                        </button>
                        <ul className={`list-none text-nowrap absolute bg-white text-center bottom-full 
                            mb-5 rounded-xl overflow-hidden transition-all duration-200 ${showAttachmentMenu ? 'h-auto' : 'h-0'}`}>
                            <li 
                              className='p-2 border border-solid border-t-2 hover:bg-primary cursor-pointer'
                              onClick={() => { setShowAttachmentMenu(false); fileRef.current?.click()}}
                            >Upload File</li>
                            <li 
                              className='p-2 border border-solid border-t-2 hover:bg-primary cursor-pointer'
                              onClick={() => { setShowAttachmentMenu(false); setAskEmbedUrl(true)}}
                            >Embed</li>
                        </ul>
                    </div>    

                    <select 
                      className='text-center outline-none cursor-pointer' 
                      name="size"
                      value={fontSize}
                      onChange={handleFontSize}
                    >
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
                        onClick={() =>  editor?.commands.toggleBlockquote()}
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
                      className={`text-[2.5rem] cursor-pointer hover:scale-110 bg-none rounded-lg text-black 
                                 ${preview ? 'text-primary' : ''}`}
                      onClick={() => handlePreview()}>
                      <MdPreview />
                    </button>
                </div>

            </div>
        </div>

        <div
          className={`w-full relative border border-solid border-white flex-col
                     items-center justify-center gap-10 bg-black py-20 ${preview ? 'flex' : 'hidden'}`}>
            <MdCancel
              className="absolute text-[2.5rem] left-0 top-0 cursor-pointer m-5 bg-black 
                         text-primary rounded-full hover:scale-110 z-50"
              onClick={() => {
                  setPreview(false);
              }}/>
            <div className="w-full flex flex-col justify-center items-center gap-[3.2em] mb-10">
                <div
                  className="text-primary w-4/5 text-6xl text-center font-bold bg-black whitespace-pre-line">
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
              className='text-white text-[1.5rem] w-4/5 p-5 break-words'
              dangerouslySetInnerHTML={{
                  __html : decodeHtml(body)
              }}      
            >
            </div>

        </div>
        
    </div>
  );
};

export default TiptapEditor;
