import gsap from "gsap";
import { useLayoutEffect, useRef, useState } from "react";
import Button from "./Button";
import { InputBoxOptions } from "../context/InputBoxContext";

const InputBox: React.FC<InputBoxOptions> = (props) => {
  const inputBoxRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState(() => {
    const initial: Record<string, any> = {};
    props.fields.forEach(field => {
      initial[field.label.toLowerCase()] = field.value;
    });
    return initial;
  });

  const handleFieldChange = (fieldLabel: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldLabel.toLowerCase()]: value
    }));
  };

  const handleConfirm = () => {
    props.onConfirm(formData);
  };

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      if(inputBoxRef.current && bgRef.current) {
        gsap.fromTo(
          bgRef.current,
          {
            backdropFilter: 'blur(0px)'
          },
          {
            backdropFilter: 'blur(10px)',
            duration: 0.5,
            ease: 'power2.inOut'
          }
        )
        gsap.fromTo(
          inputBoxRef.current,
          {
            scale: 0
          },
          {
            scale: 1,
            duration: 0.5,
            ease: 'power2.inOut',
          }
        )
      }
    })

    return () => ctx.revert();
  },[]);

  const handleClick = (call? : () => void) => {
    call?.();
    if(bgRef.current && inputBoxRef.current) {
      inputBoxRef.current.style.pointerEvents = 'none';
      gsap.to(
        bgRef.current,
        {
          backdropFilter: 'blur(0px)',
          duration: 0.5,
          ease: 'power2.inOut'
        }
      );

      gsap.to(
        inputBoxRef.current,
        {
          scale: 0,
          duration: 0.5,
          ease: 'power2.inOut',
          onComplete: () => props.onCancel?.()
        }
      );
    }
  }

  return (
    <div
      className={`w-screen h-screen flex bg-opacity-50 fixed top-0 items-center 
        justify-center z-[9999] backdrop-blur-sm overflow-hidden select-none`} 
      ref={bgRef}>
        <div 
          className="w-2/3 md:w-1/2 lg:w-1/3 bg-black border-2 border-solid border-primary h-1/3 
            rounded-2xl flex flex-col text-center items-center justify-center gap-5"
          ref={inputBoxRef}>
            
            <div className="flex items-center justify-center flex-col">
              <h1 className="text-primary text-[2rem] font-bold">
                {props.title}
              </h1>
            </div>

            {
              props.descr &&
              <div className="w-[90%] text-white flex items-center justify-center text-wrap">
                {props.descr}
              </div>
            }

            {props.fields.map((field, index) => (
              <div key={index} className="text-white flex justify-center items-center text-[1.5rem] gap-3">
                <label htmlFor={field.label.toLowerCase()}>
                  {field.label}
                </label>
                <input 
                  className="text-black p-1"
                  type={field.input}
                  name={field.label.toLowerCase()}
                  id={field.label.toLowerCase()}
                  value={formData[field.label.toLowerCase()] || ''}
                  onChange={(e) => handleFieldChange(field.label, e.target.value)}
                />
              </div>
            ))}

            <div className="flex gap-3">
              <Button 
                content="Proceed" 
                className="bg-green-500 text-white hover:bg-green-600" 
                onClick={() => handleClick(handleConfirm)}
              />
              <Button 
                content="Cancel" 
                className="bg-red-500 text-white hover:bg-red-600" 
                onClick={() => handleClick(props.onCancel) }
              />
            </div>

        </div>
    </div>
  )
}

export default InputBox;
