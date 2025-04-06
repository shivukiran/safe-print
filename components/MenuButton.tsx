import { cn } from "../app/lib/utils";


interface MenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

const MenuButton = ({ isOpen, onClick, className }: MenuButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 focus:outline-none shadow-lg",
        isOpen && "bg-blue-700",
        className
      )}
      aria-label="Toggle menu"
    >
      <div className="flex flex-col items-center justify-center">
        <span
          className={cn(
            "block w-5 h-0.5 bg-white transition-all duration-300",
            isOpen && "rotate-45 translate-y-1.5"
          )}
        ></span>
        <span
          className={cn(
            "block w-5 h-0.5 bg-white my-1 transition-all duration-300",
            isOpen && "opacity-0"
          )}
        ></span>
        <span
          className={cn(
            "block w-5 h-0.5 bg-white transition-all duration-300",
            isOpen && "-rotate-45 -translate-y-1.5"
          )}
        ></span>
      </div>
    </button>
  );
};

export default MenuButton;
