import Message from '../chat/ui/Message';

interface UserMessageProps {
  text: string;
  sentAt: string;
  senderId?: string | number;
}

const UserMessage = ({ text, sentAt, senderId }: UserMessageProps) => {
  return (
    <Message text={text} sentAt={sentAt} variant="chat" isCurrentUser={true} senderId={senderId} />
  );
};

export default UserMessage;
