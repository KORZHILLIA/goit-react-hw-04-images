import { Component } from 'react';
import SearchBar from 'components/ImageFinder/SearchBar';
import ImageGallery from './ImageGallery';

class ImageFinder extends Component {
  state = {
    query: '',
  };

  submitHandler = query => {
    this.setState({ query });
  };

  render() {
    const { submitHandler } = this;
    const { query } = this.state;
    return (
      <>
        <SearchBar onSubmit={submitHandler} />
        <ImageGallery query={query} />
      </>
    );
  }
}

export default ImageFinder;
