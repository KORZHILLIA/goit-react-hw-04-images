const KEY = '27083627-728c5d78e0dae05c6569d7d6c';
const BASE_URL = 'https://pixabay.com/api/';

const fetchImages = async (query, page) => {
  const params = new URLSearchParams({
    key: KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    per_page: 12,
    page,
  });
  const response = await fetch(`${BASE_URL}?q=${query}&${params}`);

  if (!response.ok) {
    throw new Error('Sorry, something went wrong, try again later');
  }

  const result = response.json();
  return result;
};

export { fetchImages };
