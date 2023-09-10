import '../css/style.css';
import { getBookData } from './bookData';
import { getBookInfo } from './bookInfo';
import bookCover from './bookCover';

document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('btn');
  const searchInput = document.getElementById('book-name');
  const resultList = document.getElementById('result');
  const bookContainer = document.getElementById('book-container');

  searchButton.addEventListener('click', async () => {
    resultList.innerHTML = ''; // clear result
    bookContainer.innerHTML = ''; // clear container
    await performSearch();
  });

  // logo settings
  const logoImage = document.querySelector('.logo-image');

  logoImage.addEventListener('click', () => {
    window.location.href = 'index.html'; 
  });

  searchInput.addEventListener('keyup', async (event) => {
    if (event.key === 'Enter') {
      resultList.innerHTML = ''; // clean result
      bookContainer.innerHTML = ''; // clear container
      await performSearch();
    }
  });

  async function performSearch() {
    // loader before
    document.getElementById('loader').style.display = 'block';
    bookContainer.style.display = 'none'; // hide container

    // search book name
    const categoryInput = document.getElementById('book-name');
    if (categoryInput) {
      const category = categoryInput.value;
      const books = await getBookData(category);

      // loader after
      document.getElementById('loader').style.display = 'none';

      if (books.length > 0) {
        books.forEach(async (book) => {
          const bookInfo = await getBookInfo(book);
          if (bookInfo) {
            const bookId = book.key; // bookinfo

            if (!bookContainer.querySelector(`[data-key="${bookId}"]`)) {
              const bookItem = document.createElement('div');
              bookItem.classList.add('book');
              bookItem.setAttribute('data-key', bookId);

              const titleElement = document.createElement('h2');
              titleElement.classList.add('book-title');
              titleElement.textContent = `Title: ${book.title}`;

              const authorElement = document.createElement('p');
              authorElement.classList.add('book-author');
              authorElement.textContent = `Author: ${book.authors.join(', ')}`;
              
              //book cover 
              const coverImg = document.createElement('img');
              if (book.cover_id) {
                const coverUrl = bookCover.getCoverUrl(book.cover_id);
                if (coverUrl) {
                  coverImg.src = coverUrl;
                } 
              } else {
                coverImg.src = './img/default-cover.jpg';
              }
              //description

              const descriptionDiv = document.createElement('div');
              descriptionDiv.classList.add('book-description');
              descriptionDiv.textContent = bookInfo.descriptionString || 'Description not found';
              descriptionDiv.style.display = 'none';

              const toggleDescription = document.createElement('span');
              toggleDescription.classList.add('arrow-icon');
              toggleDescription.textContent = '\u2193';
              toggleDescription.style.fontWeight = 'bold';

              toggleDescription.addEventListener('click', () => {
                if (descriptionDiv.style.display === 'none' || !descriptionDiv.style.display) {
                  descriptionDiv.style.display = 'block';
                  toggleDescription.textContent = '\u2191';
                } else {
                  descriptionDiv.style.display = 'none';
                  toggleDescription.textContent = '\u2193';
                }
              });

              bookItem.appendChild(titleElement);
              bookItem.appendChild(authorElement);
              bookItem.appendChild(coverImg);
              bookItem.appendChild(toggleDescription);
              bookItem.appendChild(descriptionDiv);

              bookContainer.appendChild(bookItem);
            }
          }
        });

        bookContainer.style.display = 'flex';
      } else {
        // error no results

        const noResultsElement = document.createElement('div');
        noResultsElement.classList.add('book');
        noResultsElement.classList.add('no-results');
        noResultsElement.textContent = 'No results found.';
        bookContainer.innerHTML = ''; // clear container
        bookContainer.appendChild(noResultsElement);
        bookContainer.style.display = 'block'; 
      }
    }
  }
});
