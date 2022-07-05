import { useState, useEffect, useRef } from 'react';
import { Oval } from 'react-loading-icons';
import { fetchImages } from '../../shared/services/searchApi';
import SearchBar from './SearchBar';
import Button from './Button';
import Modal from '../../shared/components/Modal';
import ImageGallery from './ImageGallery';
import styles from './imageFinder.module.css';

const ImageFinder = () => {
  const [state, setState] = useState({
    foundInfo: null,
    searchPageNumber: 1,
    loading: false,
    error: null,
    query: '',
  });
  const [modal, setModal] = useState({
    showModal: false,
    currentImg: null,
  });

  const { query, foundInfo, searchPageNumber, loading, error } = state;

  const { showModal, currentImg } = modal;

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    async function getImages(query, page = 1) {
      try {
        const newFoundInfo = await fetchImages(query, page);
        if (!newFoundInfo.hits.length) {
          throw new Error('Nothing found, please try something else');
        }
        if (page === 1) {
          setState(prevState => ({
            ...prevState,
            foundInfo: newFoundInfo,
            loading: false,
          }));
          return;
        }
        const { hits: newHits } = newFoundInfo;
        setState(prevState => {
          const { foundInfo } = prevState;
          const { hits } = foundInfo;
          const updatedHits = [...hits, ...newHits];
          return {
            ...prevState,
            foundInfo: { ...foundInfo, hits: updatedHits },
            loading: false,
          };
        });
      } catch (error) {
        setState(prevState => ({
          ...prevState,
          error: error.message,
          foundInfo: null,
          loading: false,
        }));
      }
    }

    setState(prevState => ({
      ...prevState,
      loading: true,
      searchPageNumber,
      error: null,
    }));

    getImages(query, searchPageNumber);
  }, [searchPageNumber, query]);

  function submitHandler(query) {
    setState(prevState => ({ ...prevState, query, searchPageNumber: 1 }));
  }

  function loadMoreClickHandler() {
    setState(prevState => ({
      ...prevState,
      searchPageNumber: prevState.searchPageNumber + 1,
    }));
  }

  function setCurrentImg(img) {
    setModal({ currentImg: img, showModal: true });
  }

  function closeModal() {
    setModal(prevState => ({ ...prevState, showModal: false }));
  }

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
        <ImageGallery hits={foundInfo.hits} currentImgChanger={setCurrentImg} />
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
};

export default ImageFinder;
