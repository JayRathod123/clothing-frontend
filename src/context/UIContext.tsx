'use client';

import React, { createContext, useContext, useState, useRef, useCallback, ReactNode } from 'react';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface UIContextType {
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  openSearch: () => void;
  closeSearch: () => void;

  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  setIsAuthModalOpen: (open: boolean) => void;
  openAuthModal: (mode?: 'login' | 'register' | unknown) => void;
  closeAuthModal: () => void;

  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastCounterRef = useRef(0);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    toastCounterRef.current += 1;
    const id = `toast_${toastCounterRef.current}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, [removeToast]);

  const openAuthModal = useCallback((modeOrEvent?: 'login' | 'register' | unknown) => {
    const targetMode = modeOrEvent === 'register' ? 'register' : 'login';
    setAuthModalMode(targetMode);
    setIsAuthModalOpen(true);
  }, []);

  return (
    <UIContext.Provider
      value={{
        isCartOpen,
        setIsCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),

        isSearchOpen,
        setIsSearchOpen,
        openSearch: () => setIsSearchOpen(true),
        closeSearch: () => setIsSearchOpen(false),

        isAuthModalOpen,
        authModalMode,
        setIsAuthModalOpen,
        openAuthModal,
        closeAuthModal: () => setIsAuthModalOpen(false),

        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
