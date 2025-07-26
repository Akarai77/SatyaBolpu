
type ButtonProps = {
    content: string,
    className? : string,
    onClick?: () => void
}


const Button : React.FC<ButtonProps> = (props) => {
  return (
    <div className={`w-fit h-fit p-2 rounded-md text-primary bg-white font-semibold cursor-pointer
                     transition-all duration-150 hover:text-white hover:bg-primary hover:scale-110 ${props.className}`}
         onClick={props.onClick}>
        {props.content}
    </div>
  )
}

export default Button
