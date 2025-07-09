import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdSend, MdClose, MdOutlineInfo } from "react-icons/md";

import { useChatWithFilingMutation } from "@/api/endpoints";
import {
  selectActiveSessionData,
  updateActiveSessionData,
} from "@/redux/slices";
import { ChatMessage, TypingIndicator } from "@/components/filings";

const FilingChat = ({ data, handleReferenceClick}) => {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const footprint = `chat.${data.ticker}.${data.accession_number}.`;
  const [sendChatMessage, { isLoading: isChatLoading }] =
    useChatWithFilingMutation();

  const [isTyping, setIsTyping] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  const showChatTips =
    useSelector((state) =>
      selectActiveSessionData(state, footprint + "showChatTips"),
    ) || true;

  const chatMessages =
    useSelector((state) =>
      selectActiveSessionData(state, footprint + "messages"),
    ) || [];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isTyping]);

  const dismissTips = () => {
    dispatch(
      updateActiveSessionData({
        dataPath: footprint + "showChatTips",
        value: false,
      }),
    );
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || isChatLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageInput,
    };

    dispatch(
      updateActiveSessionData({
        dataPath: footprint + "messages",
        value: [...chatMessages, userMessage],
      }),
    );

    setMessageInput("");
    setIsTyping(true);

    // Hide chat tips after first message
    if (showChatTips) {
      dispatch(
        updateActiveSessionData({
          dataPath: footprint + "showChatTips",
          value: false,
        }),
      );
    }

    try {
      console.log("Sending chat message with history:", chatMessages);
      const response = await sendChatMessage({
        ticker: data.ticker,
        message: messageInput,
        chatHistory: chatMessages,
        accession_number: data.accession_number,
      }).unwrap();

      if (response) {
        dispatch(
          updateActiveSessionData({
            dataPath: footprint + "messages",
            value: response.chatHistory,
          }),
        );
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#D9D9D9] mx-2 rounded-xl">
      {/* Messages container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {chatMessages
          .filter((m) => m.role !== "developer")
          .map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              handleReferenceClick={handleReferenceClick}
            />
          ))}

        {(isTyping || isChatLoading) && <TypingIndicator />}

        {showChatTips &&
          chatMessages.length < 1 &&
          !isTyping &&
          !isChatLoading && (
            <div className="bg-white rounded-lg p-4 mt-4 text-black text-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <MdOutlineInfo className="text-black mr-2" size={16} />
                  <span className="font-medium text-black">Chat Tips</span>
                </div>
                <button
                  onClick={dismissTips}
                  className="text-[#667177] hover:text-white transition"
                >
                  <MdClose size={16} />
                </button>
              </div>
              <p className="mb-2">Try asking about:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Revenue and financial performance</li>
                <li>Risk factors and challenges</li>
                <li>Balance sheet information</li>
                <li>Management team or executive changes</li>
                <li>Future growth strategy</li>
              </ul>
            </div>
          )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 "
      >
        <div className="flex items-center">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder={
              isChatLoading ? "AI is thinking..." : "Enter a prompt here"
            }
            className="chat-input flex-grow bg-[#ECE6F0] text-[#49454F] rounded-full py-3 px-4 "
            disabled={isChatLoading}
          />
          <button
            type="submit"
            className="send-button ml-2 bg-[#ECE6F0] text-[#49454F] p-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!messageInput.trim() || isChatLoading}
          >
            <MdSend size={18} />
          </button>
        </div>
      </form>
      <div className="text-[10px] text-center pt-1 pb-6 px-6 text-[#49454F]">
        accelno may display inaccurate info, including about people, so
        double-check its responses.
      </div>
    </div>
  );
};

FilingChat.propTypes = {
  isChatOpen: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    ticker: PropTypes.string.isRequired,
    accession_number: PropTypes.string.isRequired,
  }).isRequired,
  handleReferenceClick: PropTypes.func,
};

export default FilingChat;
