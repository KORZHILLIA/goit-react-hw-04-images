import PropTypes from 'prop-types';
import styles from './imageGalleryItem.module.css';

const ImageGalleryItem = ({ alt, previewImg, onClick }) => (
  <li onClick={onClick} className={styles.galleryItem}>
    <img
      className={styles.galleryItemImage}
      src={previewImg}
      alt={alt}
      loading="lazy"
    />
  </li>
);

ImageGalleryItem.defaultProps = {
  alt: 'some image',
  onClick: () => {},
};

ImageGalleryItem.propTypes = {
  alt: PropTypes.string.isRequired,
  previewImg: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ImageGalleryItem;
