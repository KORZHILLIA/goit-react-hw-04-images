import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { BiSearchAlt2 } from 'react-icons/bi';
import styles from './searchBar.module.css';

const SearchBar = ({ onSubmit }) => {
  const [query, setQuery] = useState('');

  function inputChangeHandler({ target }) {
    const { value } = target;
    setQuery(value);
  }

  function submitHandler(event) {
    event.preventDefault();
    onSubmit(query);
  }

  return (
    <header className={styles.searchbar}>
      <form onSubmit={submitHandler} className={styles.form}>
        <button type="submit" className={styles.button}>
          <BiSearchAlt2 className={styles.icon} />
          <span className={styles.buttonLabel}>Search</span>
        </button>

        <input
          onChange={inputChangeHandler}
          value={query}
          className={styles.input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          required
        />
      </form>
    </header>
  );
};

SearchBar.defaultProps = {
  onSubmit: () => {},
};

SearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default memo(SearchBar);
