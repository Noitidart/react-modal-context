import App from './App';
import { ModalProvider } from './modal-context';

function Root() {
  return (
    <ModalProvider>
      <App />
    </ModalProvider>
  );
}

export default Root;
