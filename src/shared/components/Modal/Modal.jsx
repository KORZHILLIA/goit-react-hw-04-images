import { Component } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import styles from './modal.module.css';

const modalRoot = document.querySelector('#modal-root');

class Modal extends Component {
  static defaultProps = {
    onClose: () => {},
  };

  componentDidMount() {
    window.addEventListener('keydown', this.closeModal);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.closeModal);
  }

  closeModal = ({ code, target, currentTarget }) => {
    if (code === 'Escape' || target === currentTarget) {
      this.props.onClose();
    }
  };
  render() {
    const { closeModal } = this;
    return createPortal(
      <div className={styles.overlay} onClick={closeModal}>
        <div className={styles.modal}>{this.props.children}</div>
      </div>,
      modalRoot
    );
  }
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Modal;
