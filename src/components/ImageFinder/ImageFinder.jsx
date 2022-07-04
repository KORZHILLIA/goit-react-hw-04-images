import { Component } from 'react';
import { Oval } from 'react-loading-icons';
import { fetchImages } from '../../shared/services/searchApi';
import SearchBar from './SearchBar';
import Button from './Button';
import Modal from '../../shared/components/Modal';
import ImageGallery from './ImageGallery';
import styles from './imageFinder.module.css';

class ImageFinder extends Component {
  state = {
    query: '',
    foundInfo: null,
    searchPageNumber: 1,
    loading: false,
    showModal: false,
    currentImg: null,
    error: null,
  };

  componentDidUpdate(prevProps, prevState) {
    const prevQuery = prevState.query;
    const currentQuery = this.state.query;
    const prevSearchPageNumber = prevState.searchPageNumber;
    const { searchPageNumber: currentSearchPageNumber } = this.state;
    if (prevQuery !== currentQuery) {
      this.setState({ loading: true, searchPageNumber: 1, error: null });
      this.getImages(currentQuery);
      return;
    }
    if (prevSearchPageNumber !== currentSearchPageNumber) {
      this.setState({
        loading: true,
        searchPageNumber: currentSearchPageNumber,
        error: null,
      });
      this.getImages(currentQuery, currentSearchPageNumber);
    }
  }

  submitHandler = query => {
    this.setState({ query });
  };

  async getImages(query, page = 1) {
    try {
      const newFoundInfo = await fetchImages(query, page);
      if (!newFoundInfo.hits.length) {
        throw new Error('Nothing found, please try something else');
      }
      if (page === 1) {
        this.setState({
          foundInfo: newFoundInfo,
          loading: false,
        });
        return;
      }
      const { hits: newHits } = newFoundInfo;
      this.setState(prevState => {
        const { foundInfo } = prevState;
        const { hits } = foundInfo;
        const updatedHits = [...hits, ...newHits];
        return {
          foundInfo: { ...foundInfo, hits: updatedHits },
          loading: false,
        };
      });
    } catch (error) {
      this.setState({ error: error.message, foundInfo: null, loading: false });
    }
  }

  loadMoreClickHandler = () => {
    this.setState(({ searchPageNumber }) => ({
      searchPageNumber: searchPageNumber + 1,
    }));
  };

  setCurrentImg = img => {
    this.setState({ currentImg: img, showModal: true });
  };

  closeModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  render() {
    const { submitHandler, loadMoreClickHandler, setCurrentImg, closeModal } =
      this;
    const {
      foundInfo,
      loading,
      searchPageNumber,
      showModal,
      currentImg,
      error,
    } = this.state;

    // if (!foundInfo) {
    //   return (
    //     <>
    //       <SearchBar onSubmit={submitHandler} />
    //       {error && <p className={styles.errorMessage}>{error}</p>}
    //       {loading ? (
    //         <Oval
    //           className={styles.spinner}
    //           stroke="#3f51b8"
    //           fill="#3f51b5"
    //           strokeOpacity={0.825}
    //           speed={2.0}
    //         />
    //       ) : null}
    //     </>
    //   );
    // }
    // // const { hits, total } = foundInfo;
    // // const totalPages = Math.ceil(total / hits.length);

    // return (
    //   <>
    //     <SearchBar onSubmit={submitHandler} />
    //     {error && <p className={styles.errorMessage}>{error}</p>}
    //     {showModal && (
    //       <Modal onClose={closeModal}>
    //         {
    //           <img
    //             className={styles.modalImg}
    //             src={currentImg.img}
    //             alt={currentImg.alt}
    //           />
    //         }
    //       </Modal>
    //     )}
    //     {loading && searchPageNumber === 1 && (
    //       <Oval
    //         className={styles.spinner}
    //         stroke="#3f51b8"
    //         fill="#3f51b5"
    //         strokeOpacity={0.825}
    //         speed={2.0}
    //       />
    //     )}
    //     {!error && (
    //       <ImageGallery
    //         hits={foundInfo.hits}
    //         currentImgChanger={setCurrentImg}
    //       />
    //     )}
    //     {loading && searchPageNumber > 1 && (
    //       <Oval
    //         className={styles.spinner}
    //         stroke="#3f51b8"
    //         fill="#3f51b5"
    //         strokeOpacity={0.825}
    //         speed={2.0}
    //       />
    //     )}
    //     {!error && Math.ceil(foundInfo.total / foundInfo.hits.length) > 1 ? (
    //       <Button onClick={loadMoreClickHandler} />
    //     ) : (
    //       ''
    //     )}
    //   </>
    // );

    return (
      <>
        <SearchBar onSubmit={submitHandler} />
        {!foundInfo && error && <p className={styles.errorMessage}>{error}</p>}
        {!foundInfo && loading ? (
          <Oval
            className={styles.spinner}
            stroke="#3f51b8"
            fill="#3f51b5"
            strokeOpacity={0.825}
            speed={2.0}
          />
        ) : null}

        {foundInfo && error && <p className={styles.errorMessage}>{error}</p>}
        {showModal && (
          <Modal onClose={closeModal}>
            {
              <img
                className={styles.modalImg}
                src={currentImg.img}
                alt={currentImg.alt}
              />
            }
          </Modal>
        )}
        {loading && searchPageNumber === 1 && (
          <Oval
            className={styles.spinner}
            stroke="#3f51b8"
            fill="#3f51b5"
            strokeOpacity={0.825}
            speed={2.0}
          />
        )}
        {foundInfo && !error && (
          <ImageGallery
            hits={foundInfo.hits}
            currentImgChanger={setCurrentImg}
          />
        )}
        {loading && searchPageNumber > 1 && (
          <Oval
            className={styles.spinner}
            stroke="#3f51b8"
            fill="#3f51b5"
            strokeOpacity={0.825}
            speed={2.0}
          />
        )}
        {foundInfo &&
        !error &&
        Math.ceil(foundInfo.total / foundInfo.hits.length) > 1 ? (
          <Button onClick={loadMoreClickHandler} />
        ) : (
          ''
        )}
      </>
    );
  }
}

export default ImageFinder;
