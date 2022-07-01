import { Component } from 'react';
import PropTypes from 'prop-types';
import { BiSearchAlt2 } from 'react-icons/bi';
import styles from './searchBar.module.css';

class SearchBar extends Component {
  static defaultProps = {
    onSubmit: () => {},
  };

  state = {
    query: '',
  };

  inputChangeHandler = ({ target }) => {
    const { value } = target;
    this.setState({ query: value });
  };

  submitHandler = event => {
    event.preventDefault();
    const { query } = this.state;
    this.props.onSubmit(query);
  };

  render() {
    const { inputChangeHandler, submitHandler } = this;
    const { query } = this.state;
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
  }
}

SearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default SearchBar;
