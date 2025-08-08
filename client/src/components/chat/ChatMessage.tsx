import Message from './ui/Message';

interface ChatMessageProps {
  msg: {
    text: string;
    sent_at: string;
  };
  isCurrentUser: boolean;
  senderId: number;
  senderName?: string;
}

const ChatMessage = ({ msg, isCurrentUser, senderId, senderName }: ChatMessageProps) => {
  return (
    <Message
      text={msg.text}
      sentAt={msg.sent_at}
      isCurrentUser={isCurrentUser}
      variant="chat"
      senderId={senderId}
      senderName={senderName}
    />
  );
};

export default ChatMessage;
