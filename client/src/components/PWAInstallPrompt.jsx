import { useState, useEffect } from 'react';
import { isPWAInstalled } from '../utils/pwaUtils';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (isPWAInstalled()) {
      setIsInstalled(true);
      return;
    }

    const dismissed = localStorage.getItem('pwaPromptDismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowPrompt(true), 3000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwaPromptDismissed', new Date().toISOString());
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <div className="pwa-install-prompt">
      <div className="pwa-prompt-content">
        <div className="pwa-prompt-icon">
          <img src="/icons/icon-96x96.png" alt="Quran Deen" />
        </div>
        <div className="pwa-prompt-text">
          <h4>Install Quran Deen</h4>
          <p>Add to your home screen for quick access and offline reading</p>
        </div>
        <div className="pwa-prompt-actions">
          <button onClick={handleDismiss} className="pwa-dismiss-btn">
            Not Now
          </button>
          <button onClick={handleInstall} className="pwa-install-btn">
            Install
          </button>
        </div>
      </div>
      <style>{`
        .pwa-install-prompt {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10000;
          width: calc(100% - 32px);
          max-width: 400px;
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        .pwa-prompt-content {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid rgba(26, 125, 92, 0.3);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }
        .pwa-prompt-icon img {
          width: 48px;
          height: 48px;
          border-radius: 12px;
        }
        .pwa-prompt-text {
          flex: 1;
          min-width: 150px;
        }
        .pwa-prompt-text h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
          color: #fff;
          font-weight: 600;
        }
        .pwa-prompt-text p {
          margin: 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
        }
        .pwa-prompt-actions {
          display: flex;
          gap: 8px;
          width: 100%;
        }
        .pwa-dismiss-btn {
          flex: 1;
          padding: 10px 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: transparent;
          color: rgba(255, 255, 255, 0.8);
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pwa-dismiss-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .pwa-install-btn {
          flex: 1;
          padding: 10px 16px;
          border: none;
          background: linear-gradient(135deg, #1a7d5c 0%, #2ecc71 100%);
          color: #fff;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pwa-install-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(26, 125, 92, 0.4);
        }
        @media (max-width: 400px) {
          .pwa-prompt-content {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default PWAInstallPrompt;
