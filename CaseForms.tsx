
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage } from '../types';

interface ChatProps {
  caseId: string;
  user: UserProfile;
}

const Chat: React.FC<ChatProps> = ({ caseId, user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', caseId, senderId: 'prof-1', content: '¡Hola Elena! ¿Cómo ha ido la noche con las tomas? ¿Pudiste probar la postura que vimos?', createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: '2', caseId, senderId: 'pat-1', content: '¡Hola Marina! Un poco mejor, pero sigue habiendo dolor al principio del agarre. Luego fluye bien.', createdAt: new Date(Date.now() - 1800000).toISOString() }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      caseId,
      senderId: user.id,
      content: input,
      createdAt: new Date().toISOString()
    };
    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[650px] bg-[#FFF7F9]">
      {/* Header */}
      <div className="bg-white px-10 py-6 border-b border-[#E8DDE2] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-[#4A6FA5] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#4A6FA5]/20">
              <i className="fas fa-user-nurse text-lg"></i>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#7FB7A6] border-4 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-[#1F2933] tracking-tight">Canal Privado</h3>
            <p className="text-[10px] text-[#7FB7A6] font-bold uppercase tracking-widest mt-1">Chat Encriptado · Marina L.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-xl text-[#5F6C7B] hover:bg-[#FFF7F9] hover:text-[#4A6FA5] transition-all"><i className="fas fa-video"></i></button>
          <button className="w-10 h-10 rounded-xl text-[#5F6C7B] hover:bg-[#FFF7F9] hover:text-[#4A6FA5] transition-all"><i className="fas fa-phone"></i></button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8">
        {messages.map((msg) => {
          const isMe = msg.senderId === user.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`px-6 py-4 rounded-[30px] shadow-sm ${
                  isMe 
                    ? 'bg-[#4A6FA5] text-white rounded-tr-none' 
                    : 'bg-white text-[#1F2933] border border-[#E8DDE2] rounded-tl-none'
                }`}>
                  <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                </div>
                <p className="text-[10px] mt-2 font-black uppercase tracking-widest text-[#5F6C7B] opacity-50 px-2">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {isMe && <span className="ml-2 text-[#7FB7A6]"><i className="fas fa-check-double"></i></span>}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-8 bg-white border-t border-[#E8DDE2]">
        <div className="flex gap-4 p-2 bg-[#FFF7F9] rounded-3xl border border-[#E8DDE2] focus-within:border-[#4A6FA5] focus-within:bg-white transition-all shadow-inner">
          <button className="w-12 h-12 text-[#5F6C7B] hover:text-[#4A6FA5] transition-colors rounded-2xl flex items-center justify-center">
            <i className="fas fa-smile"></i>
          </button>
          <input
            type="text"
            className="flex-1 bg-transparent border-none px-2 outline-none text-[#1F2933] font-medium"
            placeholder="Escribe tu consulta para Marina..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="w-12 h-12 bg-[#4A6FA5] text-white rounded-2xl flex items-center justify-center hover:bg-[#3b5a86] transition-all shadow-xl shadow-[#4A6FA5]/20"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
