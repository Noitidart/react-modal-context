import logo from './logo.svg';
import './App.css';
import { useModal, useModalContainer } from './modal-context';
import AlertModal from './AlertModal';
import RemoteDropdownModal from './RemoteDropdownModal';

function App() {
  const modal = useModal();

  const handleOpenAlertModal = async (e) => {
    e.preventDefault();
    const result = await modal.open(<AlertModal message="Hi" />);
    console.log('Did press confirm on AlertModal:', result.confirmed);
  };

  const handleOpenRemoteDropdownModal = async (e) => {
    e.preventDefault();
    const modalResult = await modal.open(
      <RemoteDropdownModal url="https://duckduckgo.com/" />
    );
    if (modalResult.confirmed) {
      console.log('Your selected country:', modalResult.value);
    } else {
      console.log('You cancelled the dialog');
    }
  };

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
      <div style={{ backgroundColor: 'midnightblue', height: '300px' }} />
    </div>
  );
}

export default App;
