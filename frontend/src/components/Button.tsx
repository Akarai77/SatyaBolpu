
type ButtonProps = {
    content: string,
    className? : string,
    type?: "submit" | "reset" | "button",
    onClick?: () => void
}


const Button : React.FC<ButtonProps> = (props) => {
  return (
    <button className={`p-2 rounded-md text-primary bg-white font-semibold cursor-pointer
                     transition-all duration-150 hover:text-white hover:bg-primary hover:scale-110 ${props.className}`}
         onClick={props.onClick}
         type={props.type}>
        {props.content}
    </button>
  )
}

export default Button
