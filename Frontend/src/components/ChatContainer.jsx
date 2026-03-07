import React, { useEffect, useRef, useState } from 'react'; // Added useState
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeleton/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';
import { X } from "lucide-react"; // Optional: for a close icon

function ChatContainer() {
  const messageEndRef = useRef(null);
  const [selectedImg, setSelectedImg] = useState(null); // State for the modal
  
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className='flex-1 flex flex-col overflow-auto relative'>
      <ChatHeader />

      {/* --- Image Modal Overlay --- */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setSelectedImg(null)}
        >
          <button className="absolute top-5 right-5 text-white/70 hover:text-white">
            <X size={32} />
          </button>
          <img 
            src={selectedImg} 
            alt="Enlarged" 
            className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-2xl animate-in zoom-in duration-200"
          />
        </div>
      )}

      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
          >
            <div className='chat-image avatar'>
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profileImage || "/avatar.png"
                      : selectedUser.profileImage || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className='chat-bubble flex flex-col bg-base-200'>
              {message.image && (
                <img 
                  src={message.image} 
                  alt="Attachment" 
                  className='sm:max-w-[200px] rounded-md mb-2 cursor-pointer hover:opacity-90 transition-opacity'  
                  onClick={() => setSelectedImg(message.image)} // Trigger modal
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
            <div className="chat-footer mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>
      <MessageInput />
    </div>
  );
}

export default ChatContainer;