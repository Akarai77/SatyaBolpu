
const Button = ({content, className} : {content : string, className?: string}) => {
  return (
    <div className={`w-fit h-fit p-2 rounded-md text-primary bg-white font-semibold cursor-pointer transition-all duration-150 hover:text-white hover:bg-primary hover:scale-110 ${className}`}>
        {content}
    </div>
  )
}

export default Button