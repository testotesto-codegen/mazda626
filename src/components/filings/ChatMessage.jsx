import { useState, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import { MdContentCopy } from "react-icons/md";
import MarkdownRenderer from "./MarkdownRenderer";

const getMessageContent = (content) => {
  if (typeof content === "string") return content;
  if (content && typeof content === "object" && "answer" in content)
    return content.answer;
  return "";
};

const ChatMessage = ({ message, handleReferenceClick }) => {
  const [copied, setCopied] = useState(false);

  const val = useMemo(
    () => getMessageContent(message.content),
    [message.content],
  );

  const copyToClipboard = () => {
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const role = message.role === "user" ? "user" : "assistant";
  const isUser = role === "user";
  const isSystem = message.role === "developer" || message.role === "system";

  const messageClass = useMemo(() => {
    if (isUser)
      return "chat-message chat-message-user bg-blue-500 text-white self-end";
    if (isSystem)
      return "chat-message chat-message-system bg-gray-200 text-gray-700 self-center";
    return "chat-message chat-message-assistant bg-gray-100 text-gray-800 self-start";
  }, [isUser, isSystem]);

  const markdownRef = useRef(null);

  return (
    <div
      className={`${messageClass} rounded-lg p-3 max-w-3xl my-2 shadow-sm relative group`}
    >
      <div ref={markdownRef}>
        <MarkdownRenderer
          content={val}
          handleAnnotationClick={handleReferenceClick}
          references={message.references}
        />
      </div>

      {!isUser && !isSystem && (
        <button
          onClick={copyToClipboard}
          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Copy to clipboard"
          aria-label="Copy message to clipboard"
        >
          {copied ? (
            <span className="text-green-500 text-xs font-medium">Copied!</span>
          ) : (
            <MdContentCopy className="text-gray-500 hover:text-gray-700" />
          )}
        </button>
      )}
    </div>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.shape({
    role: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
      .isRequired,
    references: PropTypes.arrayOf(
      PropTypes.shape({
        file_id: PropTypes.string,
        index: PropTypes.number,
        type: PropTypes.string,
        chunk_value: PropTypes.shape({
          tag: PropTypes.string,
          text: PropTypes.string,
          html: PropTypes.string,
        }),
      }),
    ),
  }).isRequired,
  handleReferenceClick: PropTypes.func,
};

export default ChatMessage;
