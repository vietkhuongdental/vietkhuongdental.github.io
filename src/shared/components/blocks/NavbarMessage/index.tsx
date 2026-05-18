import MessageContentIcon from '@/assets/icons/message-content-icon';
import { useGetUnreadMessageCount } from '@/shared/hooks';
import { useNavigate } from 'react-router-dom';

export default function NavbarMessage() {
  const navigate = useNavigate();

  const handleClickMessage = () => {
    navigate('/chat');
  };

  const { unreadCount } = useGetUnreadMessageCount();

  return (
    <button
      className="relative rounded-full p-2 hover:bg-background-subtle"
      onClick={handleClickMessage}
    >
      <MessageContentIcon />
      {unreadCount > 0 && (
        <div className="absolute -right-0 -top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-background-brand-primary px-1 text-xs font-medium text-text-inverse">
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}
    </button>
  );
}
