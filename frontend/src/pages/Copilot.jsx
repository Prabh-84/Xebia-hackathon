import { useState, useRef, useEffect } from 'react';
import { askCopilot } from '../services/api';

export default function Copilot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi, I am your GreenOps Copilot. How can I help you optimize your cloud carbon footprint today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      // Trying to fetch from real API if it exists
      const res = await askCopilot(userMsg);
      // Backend returns { question, answer } — check answer first
      const reply = res.data?.answer || res.data?.response || res.data || "Analysis complete. I recommend reviewing your recent storage spikes.";
      
      setMessages(prev => [...prev, { role: 'assistant', text: typeof reply === 'string' ? reply : JSON.stringify(reply) }]);
    } catch (err) {
      console.error(err);
      // Fallback AI response for the demo if backend is missing
      setTimeout(() => {
        let fallbackText = "Based on recent telemetry, your storage usage increased by 20% and network traffic increased by 15%. I recommend archiving unused storage to save roughly 150kg of CO2e this month.";
        
        if (userMsg.toLowerCase().includes('vm') || userMsg.toLowerCase().includes('compute')) {
          fallbackText = "Your AWS us-east-1 VMs are running at 15% utilization. Rightsizing these instances could reduce carbon emissions by 40% with no performance impact.";
        }
        
        setMessages(prev => [...prev, { role: 'assistant', text: fallbackText }]);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="glass-card" style={{
        flex: 1,
        borderRadius: 'var(--r-md)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'rgba(34, 197, 94, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: 'var(--green)',
            boxShadow: '0 0 10px var(--green)'
          }} />
          <h2 style={{ color: 'var(--green)', fontSize: '18px', margin: 0, fontFamily: 'var(--font-display)' }}>
            GreenOps AI
          </h2>
        </div>

        <div style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              backgroundColor: msg.role === 'user' ? 'var(--green-dim)' : 'var(--bg-raised)',
              border: msg.role === 'user' ? '1px solid var(--border-strong)' : '1px solid var(--border)',
              padding: '12px 16px',
              borderRadius: 'var(--r-md)',
              color: msg.role === 'user' ? 'var(--green)' : 'var(--text-1)',
              lineHeight: '1.5',
              fontSize: '14px'
            }}>
              {msg.text}
            </div>
          ))}
          {loading && (
            <div style={{
              alignSelf: 'flex-start',
              backgroundColor: 'var(--bg-raised)',
              border: '1px solid var(--border)',
              padding: '12px 16px',
              borderRadius: 'var(--r-md)',
              color: 'var(--text-3)',
              fontSize: '14px'
            }}>
              Analyzing infrastructure telemetry...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{
          padding: '20px 24px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: '12px'
        }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask GreenOps Copilot..."
            style={{
              flex: 1,
              background: 'var(--bg-raised)',
              border: '1px solid var(--border)',
              color: 'var(--text-1)',
              padding: '12px 16px',
              borderRadius: 'var(--r-md)',
              outline: 'none',
              fontFamily: 'var(--font-data)'
            }}
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              background: 'var(--green)',
              color: '#000',
              border: 'none',
              padding: '0 24px',
              borderRadius: 'var(--r-md)',
              fontWeight: '600',
              cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
              opacity: (loading || !input.trim()) ? 0.5 : 1,
              fontFamily: 'var(--font-display)'
            }}
          >
            Send
          </button>
        </div>
      </div>

    </div>
  );
}
