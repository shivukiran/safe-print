import { cn } from "../app/lib/utils";
import { Limelight , Gloria_Hallelujah} from 'next/font/google';

const limelight = Limelight({
    weight: '400',
    subsets: ['latin'],
});

const Gloria = Gloria_Hallelujah({
  weight: '400',
  subsets: ['latin'],
})
interface UserAvatarProps {
    name: string | null;
    className?: string;
    size?: string; // Add the size prop to the UserAvatarProps interface
}

const UserAvatar = ({ name, className }: UserAvatarProps) => {
    const initial = name ? name.charAt(0).toUpperCase() : "U";
    return (
        <div
            className={cn(
                "w-8 h-8 px-2 py-2 flex justify-center items-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-sm shadow-md border-2 border-white",
                Gloria.className, // Add the font 
                className
            )}
        >
            {initial}
        </div>
    );
};

export default UserAvatar;
