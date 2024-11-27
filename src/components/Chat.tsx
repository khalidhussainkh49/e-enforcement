import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Users } from 'lucide-react';
import SocketService from '../services/socketService';
import useSound from 'use-sound';

interface Message {
  id: string;
  from: string;
  to?: string;
  content: string;
  timestamp: Date;
  isBroadcast?: boolean;
}

interface ChatProps {
  currentUserId: string;
  selectedUserId?: string;
}

export default function Chat({ currentUserId, selectedUserId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isBroadcast, setIsBroadcast] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketService = SocketService.getInstance();
  const [playMessageSound] = useSound('/sounds/message.mp3');
  const [playAlertSound] = useSound('/sounds/alert.mp3');

  useEffect(() => {
    socketService.onPrivateMessage((data) => {
      const message: Message = {
        id: Math.random().toString(),
        from: data.from,
        content: data.message,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, message]);
      playMessageSound();
    });

    socketService.onBroadcastMessage((data) => {
      const message: Message = {
        id: Math.random().toString(),
        from: data.from,
        content: data.message,
        timestamp: new Date(),
        isBroadcast: true,
      };
      setMessages(prev => [...prev, message]);
      playMessageSound();
    });

    socketService.onDangerAlert(() => {
      playAlertSound();
    });

    return () => {
      // Cleanup socket listeners if needed
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    if (isBroadcast) {
      socketService.sendBroadcastMessage(newMessage);
    } else if (selectedUserId) {
      socketService.sendPrivateMessage(selectedUserId, newMessage);
    }

    const message: Message = {
      id: Math.random().toString(),
      from: currentUserId,
      to: isBroadcast ? undefined : selectedUserId,
      content: newMessage,
      timestamp: new Date(),
      isBroadcast,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-96 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold">Chat</h3>
        </div>
        <button
          onClick={() => setIsBroadcast(!isBroadcast)}
          className={`flex items-center gap-1 px-2 py-1 rounded ${
            isBroadcast ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="text-sm">Broadcast</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.from === currentUserId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.from === currentUserId
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              } ${message.isBroadcast ? 'border-2 border-amber-500' : ''}`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-75">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Type a ${isBroadcast ? 'broadcast' : 'message'}...`}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}