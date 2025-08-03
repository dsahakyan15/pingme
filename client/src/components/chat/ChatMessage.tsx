import Message from '../ui/Message';

interface ChatMessageProps {
  msg: {
    text: string;
    sent_at: string;
  };
  isCurrentUser: boolean;
  senderId: number;
}

const ChatMessage = ({ msg, isCurrentUser, senderId }: ChatMessageProps) => {
  return (
    <Message
      text={msg.text}
      sentAt={msg.sent_at}
      isCurrentUser={isCurrentUser}
      variant="chat"
      senderId={senderId}
    />
  );
};

export default ChatMessage;
