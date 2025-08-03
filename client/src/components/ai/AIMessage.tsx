import ReactMarkdown from 'react-markdown';
import { UserIcon } from '../../widgets/simpleIcons';

interface AIMessageProps {
  text: string;
  sentAt: string;
}

const AIMessage = ({ text, sentAt }: AIMessageProps) => {
  return (
    <div className="flex items-start space-x-2 max-w-xs md:max-w-md lg:max-w-lg ">
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-600">
        <UserIcon className="w-5 h-5 text-white" />
      </div>

      <div className="group text-left">
        <div className="relative p-3 pb-6 min-w-[60px] rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 text-slate-800 rounded-bl-md">
          <div className="prose max-w-none text-sm leading-relaxed">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
          <span className="absolute bottom-1 right-2 text-xs text-slate-400">{sentAt}</span>
        </div>
      </div>
    </div>
  );
};

export default AIMessage;
