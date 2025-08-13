import { createContext, ReactNode, useContext, useEffect, useReducer } from "react";
import useApi from "../hooks/useApi";

export type PostDetailsType = {
  mainTitle: string;
  shortTitle: string;
  culture: "daivaradhane" | "nagaradhane" | "kambala" | "yakshagana" | "";
  description: string;
  tags: string[];
  locationSpecific: boolean | null;
  image: File | null;
}

export type MapDetailsType = {
  district: string;
  taluk?: string;
  village: string;
  lat: number | null;
  lng: number | null;
}

type PostState = {
  details: PostDetailsType;
  content: string | null;
  mapDetails: MapDetailsType;
  submitted: boolean;
}

const initialPostState : PostState = {
  details: {
    mainTitle: '',
    shortTitle: '',
    culture: '',
    description: '',
    tags: [],
    locationSpecific: null,
    image: null
  },
  content: '',
  mapDetails: {
    district: '',
    taluk: '',
    village: '',
    lat: null,
    lng: null
  },
  submitted: false
}

type PostAction =
  | { type: 'SAVE_BASIC_DETAILS' , payload: { details: PostDetailsType } }
  | { type: 'SAVE_EDITOR_CONTENT', payload: { content: string } }
  | { type: 'SAVE_MAP_DETAILS', payload: { mapDetails: MapDetailsType } }
  | { type: 'SAVE_POST' }
  | { type: 'DELETE_POST' }

const PostReducer = (state: PostState, action: PostAction) : PostState => {
  switch(action.type) {
    case 'SAVE_BASIC_DETAILS':
      return {
        ...state,
        details: action.payload.details
      }

    case 'SAVE_EDITOR_CONTENT':
      return {
      ...state,
      content: action.payload.content
    }

    case 'SAVE_MAP_DETAILS':
      return {
      ...state,
      mapDetails: action.payload.mapDetails
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

  const [state,dispatch] = useReducer(PostReducer, initialPostState, () => {
    const details = JSON.parse(localStorage.getItem('postDetails') || '{}');
    const content = localStorage.getItem('editorContent');
    const mapDetails = JSON.parse(localStorage.getItem('mapDetails') || '{}');
    return { details, content, mapDetails, submitted: false };
  });
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
