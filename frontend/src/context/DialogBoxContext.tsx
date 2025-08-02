import { createContext, ReactNode, useContext, useState } from "react";
import DialogBox from "../components/DialogBox";

export type DialogBoxOptions = {
    title: string;
    descr: string;
    severity?: "irreversible" | "risky" | "default";
    onConfirm: () => void;
    onCancel?: () => void;
}

type DialogBoxType = {
    popup: (options: DialogBoxOptions) => void;
}

const DialogBoxContext = createContext<DialogBoxType | null>(null);

export const useDialog = () => useContext(DialogBoxContext);

export const DialogBoxProvider = ({children} : {children: ReactNode}) => {
    const [options,setOptions] = useState<DialogBoxOptions | null>(null);
    const popup = (opts: DialogBoxOptions) => 
        setOptions({
            ...opts,
            onCancel: () => {
                opts.onCancel?.();
                close();
            },
            onConfirm: () => {
                opts.onConfirm();
                close();
            }
        });
    const close = () => setTimeout(() => setOptions(null),500);

    return (
        <DialogBoxContext.Provider value={{ popup }}>
            {children}
            {options && 
                <DialogBox 
                    title={options.title}
                    descr={options.descr}
                    severity={options.severity || "default"}
                    onConfirm={options.onConfirm}
                    onCancel={options.onCancel}
                />
            }
        </DialogBoxContext.Provider>
    )
}
