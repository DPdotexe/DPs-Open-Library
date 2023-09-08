import axios from 'axios';

async function getBookInfo(book) {
  try {
    const response = await axios.get(`https://openlibrary.org${book.key}.json`);

    if (response.status === 200) {
      const bookData = response.data;

      if (bookData.authors) {
        let authorNames = 'N/A';

        if (Array.isArray(bookData.authors)) {
          authorNames = bookData.authors.map(author => author.name).join(', ');
        } else if (typeof bookData.authors === 'string') {
          authorNames = bookData.authors;
        }

        bookData.authors = authorNames;
      } else {
        bookData.authors = 'N/A';
      }

      if (bookData.description) {
        let description = bookData.description.value || bookData.description;
        bookData.descriptionString = description;
      } else {
        bookData.descriptionString = 'Description not found';
      }

      return bookData;
    } else {
      console.error('Error API');
      return null;
    }
  } catch (error) {
    console.error('Error API:', error);
    return null;
  }
}

export { getBookInfo };

