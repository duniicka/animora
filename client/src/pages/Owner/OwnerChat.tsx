import React, { useState, useCallback, useMemo } from 'react';
import { Send, Search, MessageSquare, Menu, X, Check, Clock, User } from 'lucide-react';

// --- Global Constants (Consistent with Dashboard) ---
const COLORS = {
    primaryTeal: '#00A896', // Active chat, Send button
    darkAccentGreen: '#027878', // Main Title
    chartGreen: '#2ECC71',     // Read status
    backgroundLight: '#F5F7FA', // Main background
};

// --- Types & Mock Data (State Management Enabled) ---

interface Message {
    id: number;
    sender: 'user' | 'other';
    content: string;
    timestamp: string;
    status: 'read' | 'sent';
}

interface Conversation {
    id: number;
    withUser: string;
    petName: string;
    lastMessage: string;
    time: string;
    unreadCount: number;
    imagePlaceholder: string;
    messages: Message[];
}

const INITIAL_CONVERSATIONS: Conversation[] = [
    { 
        id: 1, 
        withUser: 'Aynur Xəlilova', 
        petName: 'Max', 
        lastMessage: "Perfect, 3 PM tomorrow it is...", 
        time: '10:20 AM', 
        unreadCount: 0, 
        imagePlaceholder: 'AX', 
        messages: [
            { id: 1, sender: 'other', content: "Hello! I saw Max's profile and I'm very interested in meeting him. Is he still available?", timestamp: '10:00 AM', status: 'read' },
            { id: 2, sender: 'user', content: "Hi! Yes, Max is still available. He's a wonderful dog. When would be a good time for a call?", timestamp: '10:05 AM', status: 'read' },
            { id: 3, sender: 'other', content: "I'm free tomorrow afternoon. Does 3 PM work for you?", timestamp: '10:15 AM', status: 'read' },
            { id: 4, sender: 'user', content: "Perfect, 3 PM tomorrow it is. I look forward to speaking with you!", timestamp: '10:20 AM', status: 'sent' },
        ] 
    },
    { 
        id: 2, 
        withUser: 'Kamran Əhmədov', 
        petName: 'Luna', 
        lastMessage: "I sent the application. Thanks!", 
        time: 'Yesterday', 
        unreadCount: 2, 
        imagePlaceholder: 'KƏ', 
        messages: [
            { id: 1, sender: 'other', content: "I sent the application. Thanks!", timestamp: 'Yesterday', status: 'sent' },
        ] 
    },
    { id: 3, withUser: 'Nərmin Quliyeva', petName: 'Rocky', lastMessage: "Is Rocky good with cats?", time: '2 days ago', unreadCount: 0, imagePlaceholder: 'NQ', messages: [] },
    { id: 4, withUser: 'Rəsul Həsənov', petName: 'Tiger', lastMessage: "Yes, I can pick him up Saturday.", time: '2 days ago', unreadCount: 1, imagePlaceholder: 'RH', messages: [] },
];

// --- Sub-Components (Unchanged) ---

// Chat Bubble (Designed for Professional/Clean Look)
const ChatBubble: React.FC<{ message: Message }> = ({ message }) => {
    const isUser = message.sender === 'user';
    // Using Teal for User and Gray for Other is a common clean chat style
    const bubbleStyle = isUser 
        ? `bg-teal-500 text-white rounded-br-none` 
        : `bg-gray-200 text-gray-800 rounded-tl-none`;
        
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-xl px-4 py-3 rounded-2xl shadow-md ${bubbleStyle}`}>
                <p className="text-sm">{message.content}</p>
                <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-center mt-1`}>
                    <span className="text-xs opacity-75 mr-2">{message.timestamp}</span>
                    {isUser && (
                        message.status === 'read' 
                            ? <Check size={12} className="text-white opacity-80" /> 
                            : <Clock size={12} className="text-white opacity-50" />
                    )}
                </div>
            </div>
        </div>
    );
};

// Conversation List Item (Dashboard Active/Hover Style)
const ConversationItem: React.FC<{ conv: Conversation; isActive: boolean; onClick: () => void }> = ({ conv, isActive, onClick }) => (
    <div 
        onClick={onClick}
        className={`flex items-center p-4 border-b border-gray-200 cursor-pointer transition duration-200 ${
            isActive 
                ? 'bg-teal-100 border-l-4 font-semibold' 
                : 'hover:bg-gray-50'
        }`}
        style={{ borderColor: isActive ? COLORS.primaryTeal : undefined }}
    >
        {/* Avatar/Placeholder */}
        <div className={`w-12 h-12 flex items-center justify-center rounded-full text-lg font-bold mr-4 flex-shrink-0`}
             style={{ backgroundColor: isActive ? COLORS.primaryTeal : COLORS.darkAccentGreen, color: 'white' }}>
            {conv.imagePlaceholder}
        </div>
        
        <div className="flex-grow min-w-0">
            <div className="flex justify-between items-center">
                <p className={`text-sm font-bold truncate ${isActive ? 'text-gray-900' : 'text-gray-800'}`}>{conv.withUser}</p>
                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{conv.time}</span>
            </div>
            <div className="flex justify-between items-center mt-0.5">
                <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-bold' : 'text-gray-500'}`}>
                    <span className="font-medium mr-1" style={{ color: COLORS.darkAccentGreen }}>{conv.petName}:</span> 
                    {conv.lastMessage}
                </p>
                {conv.unreadCount > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 ml-2 text-xs text-white rounded-full flex-shrink-0" style={{ backgroundColor: COLORS.chartGreen }}>
                        {conv.unreadCount}
                    </span>
                )}
            </div>
        </div>
    </div>
);


// --- Main OwnerChat Component ---
const OwnerChat: React.FC = () => {
    // 1. Convert mock data to state
    const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
    const [activeConvId, setActiveConvId] = useState<number>(INITIAL_CONVERSATIONS[0].id);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
    const [newMessage, setNewMessage] = useState('');
    
    // YENİ STATE: Axtarış Mətnini saxlamaq üçün
    const [searchTerm, setSearchTerm] = useState(''); 

    const activeConv = conversations.find(c => c.id === activeConvId);

    // YENİ HESABLAMA: Axtarışa görə süzgəcdən keçirilmiş söhbətlər (useMemo ilə)
    const filteredConversations = useMemo(() => {
        if (!searchTerm) {
            return conversations;
        }
        const lowerCaseSearch = searchTerm.toLowerCase();
        
        // İstifadəçi adına və heyvan adına görə süzgəcdən keçirilir.
        return conversations.filter(conv =>
            conv.withUser.toLowerCase().includes(lowerCaseSearch) ||
            conv.petName.toLowerCase().includes(lowerCaseSearch)
        );
    }, [conversations, searchTerm]);
    
    // Zaman formatlama köməkçi funksiyası
    const formatTime = (date: Date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        return `${hours}:${minutes} ${ampm}`;
    };


    // 2. Mesaj Göndərmə Həndleri
    const handleSend = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const trimmedMessage = newMessage.trim();
        if (!trimmedMessage || !activeConv) return;

        // Generate new message object
        const now = new Date();
        const newMsg: Message = {
            id: Date.now(), // Use timestamp as unique ID for mock
            sender: 'user',
            content: trimmedMessage,
            timestamp: formatTime(now),
            status: 'sent', // Initially marked as sent
        };

        setConversations(prevConvs => 
            prevConvs.map(conv => {
                if (conv.id === activeConvId) {
                    // Update current conversation
                    return {
                        ...conv,
                        messages: [...conv.messages, newMsg],
                        lastMessage: trimmedMessage,
                        time: newMsg.timestamp, // Update list time
                        unreadCount: 0, // Assuming user reads when sending a message
                    };
                }
                return conv;
            })
        );
        
        setNewMessage(''); // Clear input field
        
    }, [newMessage, activeConvId, activeConv]);
    
    // --- Layout Classes (Unchanged) ---
    const sidebarClasses = `lg:block lg:w-1/3 w-full border-r border-gray-200 bg-white shadow-xl flex-shrink-0 ${isSidebarOpen ? 'block' : 'hidden'}`;
    const chatViewClasses = `lg:w-2/3 w-full bg-white relative flex flex-col ${isSidebarOpen ? 'hidden lg:flex' : 'flex'}`;


    return (
        <div 
            className="flex h-[85vh] rounded-2xl shadow-2xl overflow-hidden border-t-8"
            style={{ borderColor: COLORS.darkAccentGreen }} 
        >
            
            {/* --- Left Panel: Conversations List --- */}
            <div className={sidebarClasses}>
                
                {/* Header with Search */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between" style={{ backgroundColor: COLORS.backgroundLight }}>
                    <h2 className="text-xl font-bold" style={{ color: COLORS.darkAccentGreen }}>
                        <MessageSquare className="inline mr-2" size={24} /> Pet Inquiries
                    </h2>
                    {/* Search Input for Conversations */}
                    <div className="relative flex-grow ml-4">
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchTerm} // Axtarış state-i
                            onChange={(e) => setSearchTerm(e.target.value)} // State yenilənməsi
                            className="w-full pl-8 py-1.5 border border-gray-300 rounded-xl text-sm shadow-inner focus:ring-2 focus:ring-teal-500/50"
                        />
                        <Search className="absolute left-2 top-2 text-gray-400" size={16} />
                    </div>
                    
                    <button 
                        className="lg:hidden p-2 ml-2 rounded-full hover:bg-gray-200"
                        onClick={() => setIsSidebarOpen(false)}
                        aria-label="Close chat list"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Conversation List */}
                <div className="overflow-y-auto h-[calc(85vh-66px)]">
                    {filteredConversations.length > 0 ? (
                        // filteredConversations istifadə olunur
                        filteredConversations.map(conv => (
                            <ConversationItem 
                                key={conv.id}
                                conv={conv}
                                isActive={conv.id === activeConvId}
                                onClick={() => { 
                                    setActiveConvId(conv.id); 
                                    setIsSidebarOpen(false); 
                                    // Axtarış süzgəcini təmizləmirik ki, istifadəçi geri qayıdanda nəticələr yerində qalsın.
                                }}
                            />
                        ))
                    ) : (
                        // Axtarış nəticəsi yoxdursa
                        <div className="p-4 text-center text-gray-500 text-sm">
                            No conversations found matching "{searchTerm}".
                        </div>
                    )}
                </div>
            </div>

            {/* --- Right Panel: Active Chat View --- */}
            <div className={chatViewClasses}>
                
                {activeConv ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between shadow-sm">
                            <div className="flex items-center">
                                <button 
                                    className="lg:hidden p-2 mr-2 rounded-full hover:bg-gray-100"
                                    onClick={() => setIsSidebarOpen(true)}
                                    aria-label="Open chat list"
                                >
                                    <Menu size={20} />
                                </button>
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full text-md font-bold mr-3`}
                                    style={{ backgroundColor: COLORS.primaryTeal, color: 'white' }}>
                                    {activeConv.imagePlaceholder}
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-gray-800">{activeConv.withUser}</p>
                                    <p className="text-xs text-gray-500">Inquiring about <span className="font-semibold" style={{ color: COLORS.darkAccentGreen }}>{activeConv.petName}</span></p>
                                </div>
                            </div>
                            <button 
                                className="px-3 py-1 text-sm rounded-xl text-white font-semibold shadow-md transition duration-200 hover:bg-opacity-90"
                                style={{ backgroundColor: COLORS.darkAccentGreen }}
                            >
                                <User size={16} className="inline mr-1" /> View Profile
                            </button>
                        </div>
                        
                        {/* Messages Area */}
                        <div className="flex-grow p-6 overflow-y-auto space-y-4" style={{ backgroundColor: COLORS.backgroundLight }}>
                            {activeConv.messages.length > 0 ? (
                                activeConv.messages.map(msg => <ChatBubble key={msg.id} message={msg} />)
                            ) : (
                                <div className="text-center p-10 mt-20 text-gray-500">
                                    <MessageSquare size={32} className="mx-auto mb-3" />
                                    <p className="font-medium">Start the conversation with {activeConv.withUser}.</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Message Input (Active) */}
                        <form onSubmit={handleSend} className="p-4 border-t border-gray-200 flex items-center bg-white shadow-inner">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-grow p-3 border border-gray-300 rounded-xl mr-3 shadow-inner focus:ring-2 focus:ring-teal-500/50"
                                autoFocus 
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="p-3 rounded-full text-white transition duration-200 transform hover:scale-[1.05] disabled:bg-gray-400 shadow-lg"
                                style={{ backgroundColor: COLORS.primaryTeal }}
                                aria-label="Send message"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    // Default Empty State for Chat Panel
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-white">
                        <MessageSquare size={64} className="mb-4" />
                        <p className="text-xl font-semibold">Select a conversation to start chatting.</p>
                        <p className="text-sm mt-2">Manage your pet adoption inquiries here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OwnerChat;