import { createContext, ReactNode, useContext, useReducer } from "react";

interface User {
    id: string;
    name: string;
    uname: string;
    email: string;
    phone: string;
    role: 'user' | 'admin';
    verified: boolean;
}

type AuthState = {
    user: User | null;
    token: string | null;
}

type AuthAction =
  | { type: 'LOGIN'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' };

const initialState = {
    user: null,
    token: null
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch(action.type) {
        case 'LOGIN' :
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            return { user: action.payload.user, token: action.payload.token };
        case 'LOGOUT' :
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return { ...initialState };
        default:
            return state;
    }
}

interface AuthContextType {
    state: AuthState;
    dispatch: React.Dispatch<AuthAction>;
}

const AuthContext = createContext<AuthContextType>({
    state: initialState,
    dispatch: () => {
        console.warn("dispatch called outside of AuthProvider");
    },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] =  useReducer(authReducer, initialState, () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      return { user, token };
  });

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
