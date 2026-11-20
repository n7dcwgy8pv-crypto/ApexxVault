import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, Bell, X } from 'lucide-react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback((msg, dur) => addToast(msg, 'success', dur), [addToast]);
  const showAlert = useCallback((msg, dur) => addToast(msg, 'alert', dur), [addToast]);
  const showInfo = useCallback((msg, dur) => addToast(msg, 'info', dur), [addToast]);

  return (
    <NotificationContext.Provider
      value={{
        addToast,
        removeToast,
        showSuccess,
        showAlert,
        showInfo
      }}
    >
      {children}

      {/* Render Active Toasts */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-message ${t.type}`}>
            {t.type === 'success' && <CheckCircle2 size={18} color="var(--emerald-primary)" />}
            {t.type === 'alert' && <AlertCircle size={18} color="var(--rose-primary)" />}
            {t.type === 'info' && <Info size={18} color="var(--cyan-primary)" />}
            <span style={{ flex: 1 }}>{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              style={{ color: 'var(--text-muted)', padding: '2px' }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
