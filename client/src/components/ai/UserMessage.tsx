import Message from '../ui/Message';

interface UserMessageProps {
  text: string;
  sentAt: string;
  senderId: number;
}

const UserMessage = ({ text, sentAt, senderId }: UserMessageProps) => {
  return (
    <Message
      text={text}
      sentAt={sentAt}
      variant="chat"
      isCurrentUser={true}
      senderId={senderId}
      isAIChat={true}
    />
  );
};

export default UserMessage;
