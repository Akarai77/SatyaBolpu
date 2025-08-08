import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style'
import { FontSize } from '../components/EditorExtensions/FontSize'
import { Placeholder } from '@tiptap/extension-placeholder'
import { RiAttachmentLine } from 'react-icons/ri';
import { GrBlockQuote } from "react-icons/gr";
import { MdCancel, MdPreview } from "react-icons/md";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FaBold, FaItalic, FaUnderline, FaUndo, FaRedo, FaSave, FaUpload, FaEdit } from 'react-icons/fa';
import { ResizableImage } from '../components/EditorExtensions/Image';
import { Video } from '../components/EditorExtensions/Video';
import { Audio } from '../components/EditorExtensions/Audio';
import Button from '../components/Button';
import { Iframe } from '../components/EditorExtensions/Iframe';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDialog } from '../context/DialogBoxContext';
import Title from '../components/Title';
import { usePost } from '../context/PostContext';
import useApi from '../hooks/useApi';
import { getFile, saveFile } from '../utils/FileStore';

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
  const { state: authState } = useAuth();
  const { state: postState, dispatch: postDispatch } = usePost();
  const { data, loading, error, post } = useApi('/new-post', {auto: false});
  const [editorState, setEditorState] = useState<'editing' | 'preview' | 'submitted'>('editing');
  const [title, setTitle] = useState<string>(postState.details.mainTitle || 'Title');
  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  const [fontSize,setFontSize] = useState<string>('normal');
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [body,setBody] = useState<string>('');
  const [showAttachmentMenu,setShowAttachmentMenu] = useState<boolean>(false);
  const attachmentRef = useRef<HTMLDivElement | null>(null);
  const [askEmbedUrl,setAskEmbedUrl] = useState<boolean>(false);
  const [embedUrl,setEmbedUrl] = useState<string>('');
  const objectUrls = useRef<string[]>([]);
  const navigate = useNavigate();
  const dialog = useDialog();

  useLayoutEffect(() => {
    if(postState.content) {
      (async () => {
        const indexedContent = await getIndexedFiles(postState.content!);
        setBody(indexedContent);
      })()
      setEditorState('submitted');
    }
  },[])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
        if(attachmentRef.current && !attachmentRef.current.contains(e.target as Node)) {
            setShowAttachmentMenu(false);
        }
    }

    window.addEventListener('mousedown',handleClick);

    return () => window.removeEventListener('mousedown',handleClick);
  },[])

const getIndexedFiles = async (contentString: string): Promise<string> => {
  if (!contentString) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(contentString, 'text/html');
  const body = doc.body;

  for (let i = 0; i < body.children.length; i++) {
    const child = body.children[i];

    if (child.className.includes('file')) {
      const fileEl = child.querySelector('[data-idbkey]');

      if (fileEl) {
        const idAttr = fileEl.getAttribute('data-idbkey');
        const fileId = idAttr ? Number(idAttr) : NaN;

        if (!isNaN(fileId)) {
          const file = await getFile(fileId);
          if (file) {
            const blobURL = URL.createObjectURL(file);
            fileEl.setAttribute('src', blobURL);
          }
        }
      }
    }
  }

  console.log(doc.documentElement.outerHTML)
  return doc.documentElement.outerHTML;
};

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
    onCreate: async ({ editor }) => {
      const raw = localStorage.getItem('editorContentDraft') || postState.content || '';
      const hydrated = await getIndexedFiles(raw);
      console.log(hydrated)
      editor.commands.setContent(hydrated);
    },
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
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [title,editorState]);

  const handleFontSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if(editor) {
          setFontSize(e.target.value);
          editor.chain().focus().setFontSize(e.target.value).run();
      }
  }

  const handleClick = useCallback((button: keyof clickedType) => {
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
  },[editor]);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file) {
        const id = await saveFile(file)
        const type = file.type.split('/')[0];
        const url = URL.createObjectURL(file);
        objectUrls.current.push(url);
        if(type === 'image') {
            editor?.commands.insertContent({ 
              type: "image",
              attrs: {
                idbKey: id,
                src: url
              }
            })      
        } else if(type === 'video') {
            editor?.commands.insertContent({
                type: "video",
                attrs : {
                    idbKey: id,
                    src: url,
                    controls: true
                }
            })
        } else if(type == 'audio') {
            editor?.commands.insertContent({
                type: "audio",
                attrs : {
                    idbKey: id,
                    src: url,
                    controls: true
                }
            })
        }
    }
  }

  useEffect(() => {
    return () => {
      objectUrls.current?.forEach(URL.revokeObjectURL);
    };
  }, []);

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

  const handleSave = useCallback(() => {
      if(editor) {
          toast.info("Draft saved to local storage");
          if(title !== postState.details.mainTitle) {
            postDispatch({
              type: 'SAVE_BASIC_DETAILS',
              payload: {
                details: {...postState.details, mainTitle: title}
              }
            }) 
          }
          
          localStorage.setItem('postDetails',JSON.stringify({...postState.details, mainTitle: title}));
          localStorage.setItem('editorContentDraft',editor.getHTML());
      }
  }, [editor, title]);

  const handlePreview = useCallback(() => {
      if(editor) {
          setEditorState((prev) => prev === 'editing' ? 'preview' : 'editing');
          setBody(formatHtml(editor.getHTML()));
      }
  }, [editor]);

  const handleSubmit = useCallback(() => {
      const submit = () => {
          if(editor) {
              handlePreview();
              const content = formatHtml(editor.getHTML());
              setEditorState('submitted');
              postDispatch({
                type: 'SAVE_EDITOR_CONTENT',
                payload: {
                  content: content
                }
              })
              localStorage.setItem('editorContent',content);
              localStorage.removeItem('editorContentDraft');
              toast.success("Editor content Submitted.");
          }
      }


      dialog?.popup({
          title: 'Draft Submit',
          descr: "Are you sure you want to submit the document?",
          severity: 'default',
          onConfirm: submit
      });
      
  }, [editor, dialog]);

  useEffect(() => {
      const handleKeyPress = (e: KeyboardEvent) => {
          if ((e.ctrlKey || e.metaKey) && !e.shiftKey && editorState !== 'submitted') {
              const key = e.key.toLowerCase();

              if (['b', 'i', 'u'].includes(key)) {
                  e.preventDefault();
                  editor.chain().focus();
                  const keyToButton: Record<string, keyof clickedType> = {
                      b: "bold",
                      i: "italic",
                      u: "underline",
                  };
                  const button = keyToButton[key] || "underline";
                  handleClick(button)
                  return
              }

              editor.chain().blur()
              if(key === 'p') {
                  e.preventDefault()
                  handlePreview()
              } else if(key === 's') {
                  e.preventDefault();
                  handleSave();
              } else if(key === 'enter') {
                  e.preventDefault()
                  handleSubmit();
              }
          }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
  }, [editor, handleSave, handleSubmit, handlePreview, handleClick, editorState]);

  useEffect(() => {
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
  }, [editorState]);

  const handleEditAgain = () => {
    const editorContent = localStorage.getItem('editorContent')
    if(editorContent) {
      localStorage.removeItem('editorContent');
      localStorage.setItem('editorContentDraft',editorContent);
    }
    setEditorState('editing');
  }

  const handleUpload = async () => {
    await post({ postState });
  }

  useEffect(() => {
    if(error) {
      toast.error(error);
      return;
    }

    if(data)
      navigate(data.newpost);
  },[data, error])

  if(!authState.token || authState.user?.role !== "admin") 
    return <Navigate to={'/404'} replace/>

  if(Object.keys(postState.details).length === 0) {
    return <Navigate to={'/new-post'} replace/>
  }

  return (
    <div className="w-full relative">
        <div className={`w-full relative flex-col items-center justify-center gap-10 py-20 bg-black
               ${askEmbedUrl ? 'pointer-events-none' : ''} 
               ${editorState === 'preview' || editorState === 'submitted' ? 'hidden' : 'flex'}`}>
            <div className={`w-full h-full absolute top-0 z-10 bg-white bg-opacity-50 overflow-hidden
                   pointer-events-none ${askEmbedUrl ? '' : 'hidden'}`}
            ></div>
            {
                askEmbedUrl &&
                <div className='fixed w-2/3 md:w-1/2 lg:w-1/3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                                 flex flex-col gap-5 items-center justify-center bg-black text-primary text-center p-5
                                 rounded-xl pointer-events-auto z-50'>
                  <MdCancel
                    className={`absolute text-[2rem] right-0 top-0 cursor-pointer m-5 bg-black 
                               text-primary rounded-full hover:scale-110 z-50`}
                    onClick={() => {
                      setAskEmbedUrl(false);
                    }}/>
                    <label htmlFor="url" className='font-black text-[1.5rem]'>Enter Embed Url</label>
                    <input 
                      type="url" 
                      name='url' 
                      className='w-4/5 p-2 text-black' 
                      onInput={(e) => setEmbedUrl((e.target as HTMLInputElement).value)}/>
                    <Button 
                      content='Submit' 
                      className='text-[1.2rem]'
                      onClick={handleEmbedUrl}/>
                </div>
            }
            <div className="w-full flex flex-col justify-center items-center gap-10 mb-10">
              <textarea
                className="text-primary w-4/5 text-6xl text-center font-bold bg-black overflow-hidden
                           text-wrap focus:outline-none resize-none"
                value={title}
                rows={1}
                ref={titleRef}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div className="flex items-center justify-center w-4/5 sm:w-2/3 lg:w-1/2 mx-auto">
                <div className="w-1/2 border-t-2 border-solid border-primary"></div>
                <span className="mx-4 text-xl text-primary font-bold">ॐ</span>
                <div className="w-1/2 border-t-2 border-solid border-primary flex-grow"></div>
              </div>
            </div>

            <EditorContent 
              editor={editor} 
              className="text-white text-[1.5rem] w-[90%] p-5 whitespace-pre-wrap" />
            
            <div className='flex md:flex-row flex-col gap-5 sticky bottom-10 items-center justify-center'>
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

                <div className='bg-white p-3 rounded-full flex gap-3 items-center justify-center'>
                    <button
                      className={`text-[2.5rem] cursor-pointer hover:scale-110 bg-none rounded-lg text-black 
                                 ${editorState === 'preview' ? 'text-primary' : ''}`}
                      onClick={() => handlePreview()}>
                      <MdPreview />
                    </button>

                    <button
                    className={`text-[2rem] cursor-pointer hover:scale-110 bg-none rounded-lg text-black 
                        ${editorState === 'preview' ? 'text-primary' : ''}`}
                        onClick={() => handleSave()}>
                        <FaSave />
                    </button>

                    <button
                    className={`text-[2rem] cursor-pointer hover:scale-110 bg-none rounded-lg text-black 
                        ${editorState === 'preview' ? 'text-primary' : ''}`}
                        onClick={() => handleSubmit()}>
                        <FaUpload />
                    </button>
                </div>
                
            </div>
        </div>

        <div
          className={`w-full relative flex-col
                     items-center justify-center gap-10 bg-black py-20 
                     ${editorState === 'preview' || editorState === 'submitted' ? 'flex' : 'hidden'}`}>
            {
              editorState !== 'submitted' &&
                <MdCancel
                  className={`absolute text-[2.5rem] right-0 top-0 cursor-pointer m-5 bg-black 
                             text-primary rounded-full hover:scale-110 z-50`}
                  id='cancel'
                  onClick={() => {
                    setEditorState('editing');
                  }}/>
            }
            <Title title={title}/>
            
            <div 
              className='text-white text-[1.5rem] w-[90%] p-5 break-words whitespace-pre-wrap'
              dangerouslySetInnerHTML={{
                  __html : decodeHtml(body)
              }}      
            >
            </div>

        </div>

        {
          editorState === 'submitted' &&
              <FaEdit
                className={`text-[2.5rem] cursor-pointer mx-auto m-5 bg-black 
                  text-white hover:scale-110 hover:text-primary z-50`}
                id='edit'
                onClick={handleEditAgain}/>

        }

        <div className="w-full flex items-center justify-between p-10">
          <div 
            className="text-white text-[1.75rem] cursor-pointer p-2 rounded-lg hover:text-primary"
            onClick={() => navigate('/new-post')}>
            {`< Basic Details`}
          </div>
        </div>
        
    </div>
  );
};

export default TiptapEditor;
