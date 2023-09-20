import '../css/style.css';  //import CSS
import { getBookData } from './bookData'; //import data
import { getBookInfo } from './bookInfo'; //import book info
import bookCover from './bookCover'; //import book covers

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form');
  const resultList = document.getElementById('result');
  const bookContainer = document.getElementById('book-container');
  const logoImage = document.querySelector('.logo-image');
  const searchInput = document.getElementById('book-name');
  const loader = document.getElementById('loader');

  // DOM elements
  const createHTMLElement = (tagName, className, text) => {
    const element = document.createElement(tagName);
    if (className) {
      element.classList.add(className);
    }
    if (text) {
      element.textContent = text;
    }
    return element;
  };
// book cover
  const createCoverImage = (book) => {
    const coverImg = document.createElement('img');
    const coverUrl = book.cover_id ? bookCover.getCoverUrl(book.cover_id) : null;
    coverImg.src = coverUrl || './img/default-cover.jpg';
    coverImg.alt = 'Book Cover'; 
    coverImg.loading = 'lazy';
    return coverImg;
  };
// clear results
  const clearResults = () => {
    while (bookContainer.firstChild) {
      bookContainer.removeChild(bookContainer.firstChild);
    }
    bookContainer.style.display = 'none';
  };
// no results found
  const displayNoResults = () => {
    clearResults();

    const noResultsElement = createHTMLElement('div', 'book-no-results', 'No results found. Please try again.');
    const notFoundImage = createHTMLElement('img');
    notFoundImage.src = './img/notfound.png';
    notFoundImage.alt = 'Not Found';

    bookContainer.appendChild(notFoundImage);
    bookContainer.appendChild(noResultsElement);
  };
// book description
  const toggleDescription = (descriptionDiv, toggleDescriptionSpan) => {
    const isHidden = descriptionDiv.style.display === 'none' || !descriptionDiv.style.display;
    descriptionDiv.style.display = isHidden ? 'block' : 'none';
    toggleDescriptionSpan.textContent = isHidden ? '\u2191' : '\u2193';
  };
// search input validation
  const handleSearchInputValidation = (isInvalid) => {
    searchInput.setCustomValidity(isInvalid ? 'Please enter a book category.' : '');
    searchInput.classList.toggle('search-empty', isInvalid);
  };
// book element
  const createBookElement = (book, bookInfo) => {
    const bookItem = createHTMLElement('div', 'book');
    bookItem.setAttribute('data-key', book.key);

    const titleElement = createHTMLElement('h2', 'book-title', `Title: ${book.title}`);
    const authorElement = createHTMLElement('p', 'book-author', `Author: ${book.authors.join(', ')}`);
    const coverImg = createCoverImage(book);
    const descriptionDiv = createHTMLElement('div', 'book-description', bookInfo.descriptionString || 'Description not found');
    descriptionDiv.style.display = 'none';
    const toggleDescriptionSpan = createHTMLElement('span', 'arrow-icon', '\u2193');
    toggleDescriptionSpan.style.fontWeight = 'bold';

    // description click
    toggleDescriptionSpan.addEventListener('click', () => {
      toggleDescription(descriptionDiv, toggleDescriptionSpan);
    });

    bookItem.appendChild(titleElement);
    bookItem.appendChild(authorElement);
    bookItem.appendChild(coverImg);
    bookItem.appendChild(toggleDescriptionSpan);
    bookItem.appendChild(descriptionDiv);

    return bookItem;
  };
  // clear results
  const clearAndDisplayNoResults = () => {
    clearResults();
    displayNoResults();
  };
 // perform the search
  const performSearch = async () => {
    loader.style.display = 'block'; // show loader
    resultList.innerHTML = ''; // clear results

    const categoryInput = searchInput.value.trim().replace(/\s+/g, '_');
    if (categoryInput) {
      const books = await getBookData(categoryInput); // get book data
      loader.style.display = 'none'; // hide loader

      if (books.length > 0) {
        books.forEach(async (book) => {
          const bookInfo = await getBookInfo(book); // get book info
          if (bookInfo) {
            const bookId = book.key;

            if (!bookContainer.querySelector(`[data-key="${bookId}"]`)) {
              const bookItem = createBookElement(book, bookInfo);
              bookContainer.appendChild(bookItem);
            }
          }
        });
      } else {
        clearAndDisplayNoResults();
      }

      bookContainer.style.display = 'flex';// show results container
    }
  };
// search form sub
  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearResults();
    await performSearch();
  });

  searchInput.addEventListener('invalid', () => {
    handleSearchInputValidation(true);
  });

  searchInput.addEventListener('input', () => {
    handleSearchInputValidation(false);
  });
// reload page
  logoImage.addEventListener('click', () => {
    window.location.reload();
  });

  // event delegation
  resultList.addEventListener('click', (event) => {
    if (event.target.classList.contains('book')) {
      const bookElement = event.target;
      toggleDescription(bookElement.querySelector('.book-description'), bookElement.querySelector('.arrow-icon'));
    }
  });
});
