import logo from './logo.svg';
import './App.css';
import { useModal, ModalAction } from './modal-context';
import { useEffect, useState } from 'react';

function AlertModal() {
  const modal = useModal();

  return (
    <div
      style={{ width: '400px', height: '300px', backgroundColor: 'steelblue' }}
    >
      This is AlertModal
      <button type="button" onClick={modal.cancel}>
        Cancel
      </button>
      <button type="button" onClick={() => modal.confirm()}>
        Confirm
      </button>
    </div>
  );
}

/**
 *
 * @param {Object} props
 * @param {String} props.url - A url that returns status code 200 with a payload of an object with a key `data` that is an array of strings. Example: { data: ['USA', 'UK'] }
 */
function RemoteDropdownModal(props) {
  const modal = useModal();
  const [state, setState] = useState({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      // TODO: uncomment this for production
      // const res = await fetch(props.url);
      // TODO: remove this, this is a mock fetch for demo purposes
      const res = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            status: 200,
            text: () =>
              JSON.stringify({
                data: ['USA', 'Canada', 'UK', 'Australia', 'New Zealand'],
              }),
          });
        }, 5000);
      });

      if (!mounted) {
        console.log(
          'modal was destroyed while fetch was in progress, so dont continue to setState as that will throw react warnings'
        );
        return;
      }

      if (res.status === 200) {
        let reply = await res.text();
        let error;
        try {
          reply = JSON.parse(reply);
        } catch (error) {
          error =
            'Reply was succesfully fetched however it could not be parsed. Non-parsed reply: ' +
            reply;
        }
        if (error) {
          setState({
            loading: false,
            error,
            data: null,
          });
        } else {
          setState({
            loading: false,
            error: null,
            data: reply.data,
          });
        }
      } else {
        setState({
          loading: false,
          error: `Server responded with bad status code (${res.status}).`,
          data: null,
        });
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      style={{
        width: '400px',
        height: '300px',
        backgroundColor: 'springgreen',
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const values = Object.fromEntries(formData.entries());
          modal.confirm(values.strings);
        }}
      >
        <div>
          {state.loading && 'Loading...'}
          {state.error}
          {!state.loading && !state.error && (
            <fieldset>
              <label>
                Choices:
                <br />
                <select name="strings">
                  {state.data.map((string) => (
                    <option key={string} value={string}>
                      {string}
                    </option>
                  ))}
                </select>
              </label>
            </fieldset>
          )}
        </div>
        <div>
          <button type="button" onClick={modal.cancel}>
            Cancel
          </button>
          <button type="submit">Confirm</button>
        </div>
      </form>
    </div>
  );
}

function App() {
  const modal = useModal();

  const handleOpenAlertModal = async (e) => {
    e.preventDefault();
    const confirmed = await modal.open(<AlertModal />);
    console.log('Did press confirm on AlertModal:', confirmed);
  };

  const handleOpenRemoteDropdownModal = async (e) => {
    e.preventDefault();
    const modalResult = await modal.open(
      <RemoteDropdownModal url="https://duckduckgo.com/" />
    );
    if (modalResult.action === ModalAction.CONFIRM) {
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
