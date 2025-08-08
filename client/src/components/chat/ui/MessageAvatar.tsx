import { UserIcon } from '../../../widgets/simpleIcons';

interface MessageAvatarProps {
  variant: 'ai' | 'user' | 'other';
  className?: string;
}

const MessageAvatar = ({ variant, className = '' }: MessageAvatarProps) => {
  const getAvatarStyles = () => {
    switch (variant) {
      case 'ai':
        return 'bg-gradient-to-r from-purple-500 to-pink-600';
      case 'user':
        return 'bg-blue-600';
      case 'other':
        return 'bg-gradient-to-r from-blue-500 to-purple-600';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getAvatarStyles()} ${className}`}
      role="img"
      aria-label={`${variant} avatar`}
    >
      <UserIcon className="w-5 h-5 text-white" />
    </div>
  );
};

export default MessageAvatar;
