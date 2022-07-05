import PropTypes from 'prop-types';
import ImageGalleryItem from './ImageGalleryItem';
import styles from './imageGallery.module.css';

const ImageGallery = ({ hits, currentImgChanger }) => {
  const images = hits.map(({ id, tags, webformatURL, largeImageURL }) => (
    <ImageGalleryItem
      key={id}
      currentImgChanger={currentImgChanger}
      previewImg={webformatURL}
      alt={tags}
      largeImg={largeImageURL}
    />
  ));
  return <ul className={styles.gallery}>{images}</ul>;
};

ImageGallery.defaultProps = {
  hits: [],
  currentImgChanger: () => {},
};

ImageGallery.propTypes = {
  hits: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      largeImageURL: PropTypes.string.isRequired,
      tags: PropTypes.string.isRequired,
      webformatURL: PropTypes.string.isRequired,
    })
  ),
  currentImgChanger: PropTypes.func,
};

export default ImageGallery;
