import { cn } from "../app/lib/utils";

interface UserAvatarProps {
  name: string | null;
  className?: string;
}

const UserAvatar = ({ name, className }: UserAvatarProps) => {
    const initial = name ? name.charAt(0).toUpperCase() : "U";
    return (
        <div
            className={cn(
                "w-14 h-14 flex justify-center items-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-2xl shadow-lg border-4 border-white",
                className
            )}
        >
            {initial}
        </div>
    );
};

export default UserAvatar;
