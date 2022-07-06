import { memo } from 'react';
import PropTypes from 'prop-types';
import styles from './button.module.css';

const Button = ({ onClick }) => (
  <button className={styles.button} type="button" onClick={onClick}>
    Load more
  </button>
);

Button.defaultProps = {
  onClick: () => {},
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default memo(Button);
