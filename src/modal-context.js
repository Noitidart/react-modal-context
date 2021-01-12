import React, {
  useEffect,
  createContext,
  useState,
  useContext,
  useRef,
} from 'react';
import { RemoveScrollBar } from 'react-remove-scroll-bar';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [dialog, setDialog] = useState(null);
  const opened = Boolean(dialog);

  const stableFinalizers = useRef(null);

  const stableUpdaters = useRef({
    cancel: () => {
      const opened = Boolean(stableFinalizers.current);

      if (!opened) {
        return;
      }
      stableFinalizers.current.resolve({ canceled: true, confirmed: false });
      stableFinalizers.current = null;
      setDialog(null);
    },

    confirm: (value) => {
      const opened = Boolean(stableFinalizers.current);

      if (!opened) {
        return;
      }
      stableFinalizers.current.resolve({
        value,
        canceled: false,
        confirmed: true,
      });
      stableFinalizers.current = null;
      setDialog(null);
    },

    open: async (dialog) => {
      const opened = Boolean(stableFinalizers.current);

      if (opened) {
        setDialog(dialog);
        return stableFinalizers.current.promise;
      }

      let resolve;
      const promise = new Promise((r) => {
        resolve = r;
      });

      stableFinalizers.current = { promise, resolve };

      setDialog(dialog);

      return promise;
    },

    handleEscapePress: (e) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        stableUpdaters.current.cancel();
      }
    },
  });

  // add/remove escape key listener when modal is shown/hidden
  useEffect(() => {
    if (opened) {
      document.addEventListener(
        'keyup',
        stableUpdaters.current.handleEscapePress
      );
      return () => {
        document.removeEventListener(
          'keyup',
          stableUpdaters.current.handleEscapePress
        );
      };
    } else {
      document.removeEventListener(
        'keyup',
        stableUpdaters.current.handleEscapePress
      );
    }
  }, [opened]);

  const ModalContainer = () => {
    const containerNodeRef = useRef();
    if (opened) {
      function handleBackgroundClick(e) {
        if (e.target === containerNodeRef.current) {
          stableUpdaters.current.cancel();
        }
      }

      return (
        <div
          style={{
            height: '100vh',
            width: '100vw',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '20vh',
            boxSizing: 'border-box',
          }}
          ref={containerNodeRef}
          onClick={handleBackgroundClick}
        >
          <RemoveScrollBar />
          {dialog}
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <ModalContext.Provider
      value={{
        ModalContainer,
        open: stableUpdaters.current.open,
        cancel: stableUpdaters.current.cancel,
        confirm: stableUpdaters.current.confirm,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
