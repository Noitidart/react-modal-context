import { useModal } from './modal-context';

/**
 *
 * @param {Object} props
 * @param {string} props.message
 */
export default function AlertModal(props) {
  const modal = useModal();

  return (
    <div
      style={{ width: '400px', height: '300px', backgroundColor: 'steelblue' }}
    >
      {props.message}
      <button type="button" onClick={modal.cancel}>
        Cancel
      </button>
      <button type="button" onClick={() => modal.confirm()}>
        Confirm
      </button>
    </div>
  );
}
