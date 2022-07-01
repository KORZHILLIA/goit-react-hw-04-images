import { Component } from 'react';
import { Oval } from 'react-loading-icons';
import { fetchImages } from '../../../shared/services/searchApi';
import ImageGalleryItem from './ImageGalleryItem';
import Button from '../Button';
import Modal from '../../../shared/components/Modal';
import styles from './imageGallery.module.css';

class ImageGallery extends Component {
  state = {
    foundInfo: null,
    searchPageNumber: 1,
    loading: false,
    showModal: false,
    currentImg: null,
    error: null,
  };

  componentDidUpdate(prevProps, prevState) {
    const prevQuery = prevProps.query;
    const currentQuery = this.props.query;
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
    const { loadMoreClickHandler, setCurrentImg, closeModal } = this;
    const {
      foundInfo,
      loading,
      searchPageNumber,
      showModal,
      currentImg,
      error,
    } = this.state;

    if (!foundInfo) {
      return (
        <>
          {error && <p className={styles.errorMessage}>{error}</p>}
          {loading ? (
            <Oval
              className={styles.spinner}
              stroke="#3f51b8"
              fill="#3f51b5"
              strokeOpacity={0.825}
              speed={2.0}
            />
          ) : null}
        </>
      );
    }
    const { hits, total } = foundInfo;
    const totalPages = Math.ceil(total / hits.length);
    const images = hits.map(({ id, tags, webformatURL, largeImageURL }) => (
      <ImageGalleryItem
        key={id}
        onClick={() => setCurrentImg({ img: largeImageURL, alt: tags })}
        previewImg={webformatURL}
        alt={tags}
        largeImg={largeImageURL}
      />
    ));
    return (
      <>
        {error && <p className={styles.errorMessage}>{error}</p>}
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
        {!error && <ul className={styles.gallery}>{images}</ul>}
        {loading && searchPageNumber > 1 && (
          <Oval
            className={styles.spinner}
            stroke="#3f51b8"
            fill="#3f51b5"
            strokeOpacity={0.825}
            speed={2.0}
          />
        )}
        {!error && totalPages > 1 ? (
          <Button onClick={loadMoreClickHandler} />
        ) : (
          ''
        )}
      </>
    );
  }
}

export default ImageGallery;
