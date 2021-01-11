import React, {
  useEffect,
  createContext,
  useState,
  useContext,
  useRef,
} from 'react';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [opened, setOpened] = useState(false);

  const cancel = () => {
    if (!opened) {
      return;
    }
    opened.resolve({ canceled: true, confirmed: false });
    setOpened(null);
  };
  const confirm = (value) => {
    if (!opened) {
      return;
    }
    opened.resolve({ value, canceled: false, confirmed: true });
    setOpened(null);
  };

  const open = async (dialogNode) => {
    if (opened) {
      setOpened({ ...opened, dialogNode });
      return opened.promise;
    }
    let resolve;
    const promise = new Promise((r) => {
      resolve = r;
    });
    setOpened({ promise, resolve, dialogNode });
    return promise;
  };

  // add/remove escape key listener when modal is shown/hidden
  const savedHandleEscapePressed = useRef(null);
  useEffect(() => {
    if (opened?.resolve) {
      savedHandleEscapePressed.current = (e) => {
        if (e.code === 'Escape') {
          e.preventDefault();
          cancel();
        }
      };
      document.addEventListener('keyup', savedHandleEscapePressed.current);
      return () => {
        document.removeEventListener('keyup', savedHandleEscapePressed.current);
      };
    } else {
      if (savedHandleEscapePressed.current) {
        document.removeEventListener('keyup', savedHandleEscapePressed.current);
      }
    }
  }, [opened?.resolve]);

  const ModalContainer = () => {
    const containerNodeRef = useRef();
    if (opened) {
      const { dialogNode } = opened;

      function handleBackgroundClick(e) {
        if (e.target === containerNodeRef.current) {
          cancel();
        }
      }

      return (
        <div
          style={{
            height: '100vh',
            width: '100vw',
            position: 'absolute',
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
          {dialogNode}
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
        open,
        cancel,
        confirm,
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
