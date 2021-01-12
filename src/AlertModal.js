import { useModal } from './modal-context';
import { motion } from 'framer-motion';

/**
 *
 * @param {Object} props
 * @param {string} props.message
 */
export default function AlertModal(props) {
  const modal = useModal();

  return (
    <motion.div
      animate={{ y: 16 }}
      exit={{ y: 0 }}
      transition={{ duration: modal.animationDuration }}
      style={{
        marginTop: '20vh',
        width: '400px',
        height: '300px',
        backgroundColor: 'steelblue',
      }}
    >
      {props.message}
      <button type="button" onClick={modal.cancel}>
        Cancel
      </button>
      <button type="button" onClick={() => modal.confirm()}>
        Confirm
      </button>
    </motion.div>
  );
}
