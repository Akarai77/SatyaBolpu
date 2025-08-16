import { createContext, ReactNode, useContext, useEffect, useReducer } from "react";
import useApi from "../hooks/useApi";

export type PostDetailsType = {
  mainTitle: string;
  shortTitle: string;
  culture: "daivaradhane" | "nagaradhane" | "kambala" | "yakshagana" | "";
  description: string;
  tags: string[];
  locationSpecific: boolean;
  image: number | File | null;
}

export type MapDetailsType = {
  district: string;
  taluk?: string;
  village: string;
  lat: number | null;
  lng: number | null;
}

type PostState = {
  details: PostDetailsType | null;
  content: string;
  mapDetails: MapDetailsType | null;
  submitted: boolean;
}

const initialPostState : PostState = {
  details: null,
  content: '',
  mapDetails: null,
  submitted: false
}

type PostAction =
  | { type: 'SAVE_BASIC_DETAILS' , payload: { details: PostDetailsType } }
  | { type: 'CLEAR_BASIC_DETAILS' }
  | { type: 'SAVE_EDITOR_CONTENT', payload: { content: string } }
  | { type: 'CLEAR_EDITOR_CONTENT' }
  | { type: 'SAVE_MAP_DETAILS', payload: { mapDetails: MapDetailsType } }
  | { type: 'CLEAR_MAP_DETAILS' }
  | { type: 'SAVE_POST' }
  | { type: 'DELETE_POST' }

const PostReducer = (state: PostState, action: PostAction) : PostState => {
  switch(action.type) {
    case 'SAVE_BASIC_DETAILS': {
      localStorage.setItem('postDetails',JSON.stringify(action.payload.details));
      return {
        ...state,
        details: action.payload.details
      }
    }

    case 'CLEAR_BASIC_DETAILS': {
      localStorage.removeItem('postDetails');
      return {
        ...state,
        details: null
      }
    }

    case 'SAVE_EDITOR_CONTENT': {
      localStorage.setItem('editorContent',action.payload.content); 
      return {
        ...state,
        content: action.payload.content
      }
    }

    case 'CLEAR_EDITOR_CONTENT': {
      localStorage.removeItem('editorContent');  
      return {
        ...state,
        content: ''
      }
    }

    case 'SAVE_MAP_DETAILS': {
      localStorage.setItem('mapDetails',JSON.stringify(action.payload.mapDetails));
      return {
        ...state,
        mapDetails: action.payload.mapDetails
      }
    }

    case 'CLEAR_MAP_DETAILS': {
      localStorage.removeItem('mapDetails');
      return {
        ...state,
        mapDetails: null
      }
    }

    case 'SAVE_POST':
      return {
        ...state,
        submitted: true
    }

    case 'DELETE_POST':
      return {
      ...initialPostState
    }

    default:
      return state;
  }
}

type PostContextType = {
  state: PostState;
  dispatch: React.Dispatch<PostAction>;
}

const PostContext = createContext<PostContextType>({
  state: initialPostState,
  dispatch: () => {
    console.warn("Dispatch used outside provider")
  }
});

export const PostProvider = ({ children } : { children: ReactNode }) => {

  const init = (): PostState => {
    const details = (() => {
      const raw = localStorage.getItem('postDetails');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Object.keys(parsed).length > 0 ? parsed : null;
    })();

    const content = localStorage.getItem('editorContent') || '';

    const mapDetails = (() => {
      const raw = localStorage.getItem('mapDetails');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Object.keys(parsed).length > 0 ? parsed : null;
    })();

    return { details, content, mapDetails, submitted: false };
  };

  const [state, dispatch] = useReducer(PostReducer, initialPostState, init);
  const {loading, error, post} = useApi('/new-post',{ auto: false });

  useEffect(() => {
    const uploadPost = async () => {
      if(state.submitted)
        await post({ post: {...state.details, content: state.content} });
    }

    uploadPost();
  },[state.submitted])

  useEffect(() => {
    if(error)
      console.error(error)
  }, [error, loading])

  return (
    <PostContext.Provider value={{ state, dispatch }}>
      {children}
    </PostContext.Provider>
  )
}

export const usePost = () => useContext(PostContext);
