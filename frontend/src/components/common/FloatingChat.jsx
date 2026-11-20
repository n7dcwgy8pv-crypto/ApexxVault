import React, { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';

export const FloatingChat = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const whatsappUrl = "https://wa.me/14165716702?text=Hello%20ApexxVault,%20I'm%20interested%20in%20an%20asset%20in%20your%20Scarborough%20liquidation%20depot.";

  return (
    <div className="floating-chat-container">
      {showTooltip && (
        <div className="floating-chat-tooltip">
          <div className="tooltip-header">
            <strong>ApexxVault Support</strong>
            <button 
              type="button" 
              onClick={() => setShowTooltip(false)}
              aria-label="Close tooltip"
              style={{ color: '#888', cursor: 'pointer' }}
            >
              <X size={13} />
            </button>
          </div>
          <p>Questions about a lot or pickup? Chat live with our Scarborough depot desk.</p>
        </div>
      )}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp-btn"
        onMouseEnter={() => setShowTooltip(true)}
        title="Chat with us on WhatsApp: (416) 571-6702"
        aria-label="Chat with ApexxVault on WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
};

export default FloatingChat;
