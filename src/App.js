import logo from './logo.svg';
import './App.css';
import { useModal } from './modal-context';
import AlertModal from './AlertModal';
import RemoteDropdownModal from './RemoteDropdownModal';

function App() {
  const modal = useModal();

  const handleOpenAlertModal = async (e) => {
    e.preventDefault();
    const result = await modal.open(<AlertModal message="Hi" />);
    console.log('Did press confirm on AlertModal:', result.didConfirm);
  };

  const handleOpenRemoteDropdownModal = async (e) => {
    e.preventDefault();
    const modalResult = await modal.open(
      <RemoteDropdownModal url="https://duckduckgo.com/" />
    );
    if (modalResult.didConfirm) {
      console.log('Your selected country:', modalResult.value);
    } else {
      console.log('You cancelled the dialog');
    }
  };

  const { ModalContainer } = modal;
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <code>ModalContext</code> Demo
        </p>
        <p>
          <a className="App-link" href="#" onClick={handleOpenAlertModal}>
            Show Alert
          </a>
          <a
            className="App-link"
            href="#"
            onClick={handleOpenRemoteDropdownModal}
          >
            Show Remote Dropdown
          </a>
        </p>
      </header>
      <ModalContainer />
    </div>
  );
}

export default App;
