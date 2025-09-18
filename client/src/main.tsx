import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Prevent MetaMask injection errors
if (typeof window !== 'undefined') {
  // Suppress MetaMask connection attempts
  const originalError = console.error;
  console.error = (...args) => {
    const message = args[0]?.toString() || '';
    if (
      message.includes('MetaMask') ||
      message.includes('ethereum') ||
      message.includes('Failed to connect') ||
      message.includes('extension not found')
    ) {
      // Silently ignore MetaMask-related errors
      return;
    }
    originalError.apply(console, args);
  };

  // Prevent unhandled promise rejections from MetaMask
  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || event.reason?.toString() || '';
    if (
      message.includes('MetaMask') ||
      message.includes('ethereum') ||
      message.includes('Failed to connect') ||
      message.includes('extension not found')
    ) {
      event.preventDefault();
      return;
    }
  });

  // Override window.ethereum if it exists but we don't want to use it
  if (window.ethereum && !window.__PRIVATE_VAULT_ETHEREUM_DISABLED__) {
    window.__PRIVATE_VAULT_ETHEREUM_DISABLED__ = true;
    
    // Create a proxy that prevents connection attempts
    const originalEthereum = window.ethereum;
    window.ethereum = new Proxy(originalEthereum, {
      get(target, prop) {
        if (prop === 'request' || prop === 'enable' || prop === 'send') {
          return () => Promise.reject(new Error('Ethereum provider disabled for Private Vault'));
        }
        return target[prop];
      }
    });
  }
}

createRoot(document.getElementById("root")!).render(<App />);
