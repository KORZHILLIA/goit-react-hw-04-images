import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import styles from './modal.module.css';

const modalRoot = document.querySelector('#modal-root');

const Modal = ({ onClose, children }) => {
  useEffect(() => {
    window.addEventListener('keydown', closeModal);

    return () => {
      window.removeEventListener('keydown', closeModal);
    };
  });

  function closeModal({ code, target, currentTarget }) {
    if (code === 'Escape' || target === currentTarget) {
      onClose();
    }
  }

  return createPortal(
    <div className={styles.overlay} onClick={closeModal}>
      <div className={styles.modal}>{children}</div>
    </div>,
    modalRoot
  );
};

Modal.defaultProps = {
  onClose: () => {},
};

Modal.propTypes = {
  onClose: PropTypes.func,
};

export default Modal;
