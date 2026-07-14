import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, ArrowRight } from 'lucide-react';

const QA_KNOWLEDGE = [
  { q: "how to use", a: "You can use the Orchestration Editor to drag-and-drop AI agents onto the canvas, connect them to build workflows, and click 'Run Demo' to watch them execute." },
  { q: "approvals", a: "When an agent requires human permission to proceed (like making a payment), it appears in the 'Orders & Reviews' (Approvals) tab in your Inbox. You can click Approve or Reject there." },
  { q: "add product", a: "Go to the Inbox, click 'Products' in the sidebar, and then click '+ Add New Product'. Fill out the details across the tabs and hit Save." },
  { q: "command center", a: "The Command Center lets you manage Leases. You can Add, Edit, or Delete them, view live agent stats, toggle permissions, and export everything to CSV." },
];

const SupportPage = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am your Synapse OS AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    // Simple AI reply logic based on keyword matching
    setTimeout(() => {
      let reply = "I'm sorry, I don't have information on that yet. Try asking about how to use the app, approvals, adding products, or the command center.";
      const lowerMsg = userMsg.toLowerCase();
      
      if (lowerMsg.includes('status') || lowerMsg.includes('agents')) {
        reply = `| Agent Swarm | Status | Host |\n| :--- | :--- | :--- |\n| Ingestion Agent | 🟢 Online | Local Node |\n| Extraction Agent | 🟢 Online | Local Node |\n| AI Inference Agent | 🟢 Online | Cloud Service |\n| Action Sync Agent | 🟢 Online | Cloud Service |\n\n**Agent Swarm Operational Status: 4 Online, 0 Failed**`;
      } else if (lowerMsg.includes('lease') || lowerMsg.includes('abstract')) {
        reply = "Successfully extracted 14 clauses from the uploaded contract document. Financial ledgers updated.";
      } else if (lowerMsg.includes('revenue') || lowerMsg.includes('profit') || lowerMsg.includes('transactions')) {
        reply = "Based on current system data state, our analytical summary is as follows:\n- Total Revenue: $15,430\n- Total Expenses: $4,200\n- Net Profit: $11,230\n\nThe recent 5 transactions show healthy recurring subscription revenue and normal API/hosting expenses.";
      } else {
        for (const item of QA_KNOWLEDGE) {
          if (lowerMsg.includes(item.q)) {
            reply = item.a;
            break;
          }
        }
      }

      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    }, 600);
  };

  const handleQuickReply = (text) => {
    setInput(text);
  };

  return (
    <div className="flex flex-col h-full bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-sot-border dark:border-white/10 rounded-2xl overflow-hidden shadow-sm font-sans text-foreground dark:text-white transition-colors duration-500">
      {/* Header */}
      <div className="p-6 border-b border-sot-border dark:border-white/10 bg-transparent flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-xl font-bold text-foreground dark:text-white flex items-center gap-2">
            <Bot size={24} className="text-sot-blue" /> AI Support Assistant
          </h2>
          <p className="text-sm text-text-secondary dark:text-white/70 mt-1">System Orchestrator Core</p>
        </div>
        
        {/* WhatsApp Integration */}
        <a 
          href="https://wa.me/919263211969" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-[8px] text-sm font-bold hover:bg-green-100 transition-colors"
        >
          <MessageCircle size={16} /> Contact Support
        </a>
      </div>

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto p-6 space-y-4 no-scrollbar bg-transparent">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-sot-border dark:border-white/10 flex items-center justify-center shrink-0">
                <Bot size={14} className="text-sot-blue" />
              </div>
            )}
            
            <div className={`max-w-[85%] p-4 rounded-[12px] text-sm leading-relaxed whitespace-pre-wrap break-words border font-sans ${
              msg.role === 'user' 
                ? 'bg-sot-blue text-white rounded-br-none border-transparent' 
                : 'bg-white/80 dark:bg-black/30 backdrop-blur-md border-sot-border dark:border-white/10 text-foreground dark:text-white rounded-bl-none shadow-sm'
            }`}>
              {msg.text}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-sot-border dark:border-white/10 flex items-center justify-center shrink-0">
                <User size={14} className="text-text-secondary dark:text-white/70" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-transparent border-t border-sot-border dark:border-white/10 shrink-0">
        <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
          {["How to use", "Approvals", "Add product", "Command center"].map((qr, i) => (
            <button 
              key={i} 
              onClick={() => handleQuickReply(qr)}
              className="px-3 py-1.5 rounded-[16px] bg-sot-gray-light dark:bg-black border border-sot-border dark:border-white/10 text-xs font-medium text-text-secondary dark:text-white/70 whitespace-nowrap hover:bg-white dark:bg-[#111] hover:text-foreground dark:text-white transition-colors"
            >
              {qr}
            </button>
          ))}
        </div>
        
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about the app..."
            className="flex-grow bg-white/50 dark:bg-white/5 backdrop-blur-md border border-sot-border dark:border-white/10 rounded-xl px-4 py-2 text-sm text-foreground dark:text-white outline-none focus:shadow-sot-focus transition-shadow"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="px-6 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 backdrop-blur-md border border-cyan-400/50 hover:border-cyan-300 text-cyan-100 rounded-xl font-bold transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupportPage;
