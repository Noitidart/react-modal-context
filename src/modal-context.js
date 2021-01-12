import React, {
  useEffect,
  createContext,
  useState,
  useContext,
  useRef,
} from 'react';
import { RemoveScrollBar } from 'react-remove-scroll-bar';
import { AnimatePresence, motion } from 'framer-motion';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [dialog, setDialog] = useState(null);
  const opened = Boolean(dialog);

  const stableFinalizers = useRef(null);

  const stableUpdaters = useRef({
    animationDuration: 0.15,
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
  });

  // add/remove escape key listener when modal is shown/hidden
  const stableHandleEscapePress = useRef((e) => {
    if (e.code === 'Escape') {
      e.preventDefault();
      stableUpdaters.current.cancel();
    }
  });
  useEffect(() => {
    if (opened) {
      document.addEventListener('keyup', stableHandleEscapePress.current);
      return () => {
        document.removeEventListener('keyup', stableHandleEscapePress.current);
      };
    } else {
      document.removeEventListener('keyup', stableHandleEscapePress.current);
    }
  }, [opened]);

  return (
    <ModalContext.Provider value={stableUpdaters.current}>
      <>
        {children}
        <ModalContainer opened={opened} dialog={dialog} />
      </>
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

function ModalContainer(props) {
  const [visible, setVisible] = useState(props.opened);
  const modal = useModal();
  useEffect(() => {
    if (props.opened) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [props.opened]);
  const containerNodeRef = useRef();

  function handleBackgroundClick(e) {
    if (e.target === containerNodeRef.current) {
      modal.cancel();
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: modal.animationDuration }}
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
            boxSizing: 'border-box',
          }}
          ref={containerNodeRef}
          onClick={handleBackgroundClick}
        >
          <RemoveScrollBar />
          <AnimatePresence>{props.opened && props.dialog}</AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
