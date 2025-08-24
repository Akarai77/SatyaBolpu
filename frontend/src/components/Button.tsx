import { cn } from "../utils/merge";

type ButtonProps = {
  content: string;
  className?: string;
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
  theme?: "light" | "dark";
  loading?: boolean;
  loadingText?: string;
};

const Button: React.FC<ButtonProps> = ({
  content,
  className,
  type = "button",
  onClick,
  loading = false,
  loadingText,
  theme
}) => {
  return (
    <button
      className={cn(
        `p-2 rounded-md flex items-center justify-center gap-2 text-primary bg-white font-semibold cursor-pointer
        ${theme === 'light' ? 'text-white bg-primary hover:bg-orange-600' : 'text-primary bg-white hover:text-white hover:bg-primary'}
        transition-all duration-150  hover:scale-110 
        disabled:cursor-not-allowed disabled:scale-100 disabled:bg-primary/70 disabled:text-white`,
        className
      )}
      disabled={loading}
      onClick={onClick}
      type={type}
    >
      {loading && (
        <svg
          className="animate-spin fill-white"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M12,23a9.63,9.63,0,0,1-8-9.5,9.51,9.51,0,0,1,6.79-9.1A1.66,1.66,0,0,0,12,2.81h0a1.67,1.67,0,0,0-1.94-1.64A11,11,0,0,0,12,23Z" />
        </svg>
      )}
      {loading ? loadingText || content : content}
    </button>
  );
};

export default Button;

