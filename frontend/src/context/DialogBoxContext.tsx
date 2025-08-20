import { createContext, ReactNode, useContext, useRef, useState } from "react";
import DialogBox from "../components/DialogBox";

export type DialogBoxOptions = {
    title: string;
    descr: string;
    severity?: "irreversible" | "risky" | "default";
    onConfirm: () => void;
    onCancel?: () => void;
}

type DialogBoxContextType = {
    popup: (options: DialogBoxOptions) => void;
}

const DialogBoxContext = createContext<DialogBoxContextType>({
  popup: () => {
    console.warn("popup called outside of DialogBoxProvider")
  }
});

export const DialogBoxProvider = ({children} : {children: ReactNode}) => {
    const [options,setOptions] = useState<DialogBoxOptions | null>(null);
    const popup = (opts: DialogBoxOptions) => 
      setOptions({
        ...opts,
        severity: opts.severity || "default",
        onCancel: () => {
            opts.onCancel?.();
            close();
        },
        onConfirm: () => {
            opts.onConfirm();
            close();
        }
    });
    const closeTimeout = useRef<NodeJS.Timeout>();
    const close = () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
      closeTimeout.current = setTimeout(() => setOptions(null), 500);
    };

    return (
        <DialogBoxContext.Provider value={{ popup }}>
            {children}
            {options && 
                <DialogBox {...options}/>
            }
        </DialogBoxContext.Provider>
    )
}

export const useDialog = () => useContext(DialogBoxContext);
