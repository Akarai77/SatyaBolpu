import { ChangeEvent, createContext, ReactNode, useContext, useRef, useState } from "react";
import InputBox from "../components/InputBox";

export type InputBoxOptions = {
    title: string;
    descr?: string;
    fields: { 
      label: string, 
      input: "text" | "number" | "password" | "email", 
      value: string | number,
    }[];
    onConfirm: (formData: Record<string, any>) => void;
    onCancel?: (args?: any) => void;
}

type InputBoxContextType = {
    popup: (options: InputBoxOptions) => void;
}

const InputBoxContext = createContext<InputBoxContextType>({
  popup: () => {
    console.warn("popup called outside of InputBoxProvider")
  }
});

export const InputBoxProvider = ({children} : {children: ReactNode}) => {
    const [options,setOptions] = useState<InputBoxOptions | null>(null);
    const popup = (opts: InputBoxOptions) => 
      setOptions({
        ...opts,
        onCancel: () => {
            opts.onCancel?.();
            close();
        },
        onConfirm: (formData: Record<string, any>) => {
            opts.onConfirm(formData);
            close();
        }
    });
    const closeTimeout = useRef<NodeJS.Timeout>();
    const close = () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
      closeTimeout.current = setTimeout(() => setOptions(null), 500);
    };

    return (
        <InputBoxContext.Provider value={{ popup }}>
            {children}
            {options && 
                <InputBox {...options}/>
            }
        </InputBoxContext.Provider>
    )
}

export const useInputBox = () => useContext(InputBoxContext);
