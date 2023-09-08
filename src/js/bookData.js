import axios from 'axios';

async function getBookData(category) {
  try {
    const response = await axios.get(`https://openlibrary.org/subjects/${category}.json`);
    
    if (response.status === 200) {
      const subjectData = response.data;

      if (subjectData.works) {
        const books = subjectData.works.map((rawBook) => {
          const title = rawBook.title;
          const authors = rawBook.authors ? rawBook.authors.map((author) => author.name) : ['N/A'];
          const cover_id = rawBook.cover_id;
          const key = rawBook.key;

          return {
            title,
            authors,
            cover_id,
            key,
          };
        });
        
        return books;
      } else {
        console.error('Error API');
        return [];
      }
    } else {
      console.error('Error API');
      return [];
    }
  } catch (error) {
    console.error('Error API:', error);
    return [];
  }
}

export { getBookData };
