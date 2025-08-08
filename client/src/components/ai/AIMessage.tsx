import Message from '../chat/ui/Message';

interface AIMessageProps {
  text: string;
  sentAt: string;
  useMarkdown?: boolean;
}

const AIMessage = ({ text, sentAt, useMarkdown = true }: AIMessageProps) => {
  return <Message text={text} sentAt={sentAt} variant="ai" useMarkdown={useMarkdown} />;
};

export default AIMessage;
