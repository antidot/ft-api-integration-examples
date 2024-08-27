let FtCallingApp = 'custom-landing-page';

let bookmarks;

let FTAPI = new window.fluidtopics.FluidTopicsApi();
FTAPI['ftCallingApp'] = FtCallingApp;
// console.log('FTAPI', FTAPI);

async function main() {
  bookmarks = await FTAPI.get(`/api/users/${user.profile.id}/bookmarks`);
  addEventonBookmarkSortInput();
  addEventonBookmarkFilterInput();
  renderBookmarks();
}

function renderBookmarks() {
  let filteredBookmarks = filterBookmarks(bookmarks);
  let sortedBookmarks = sortBookmarks(filteredBookmarks);
  showBookmarks(sortedBookmarks);
}

function addEventonBookmarkSortInput() {
  let inputs = document.querySelectorAll('input[name="bookmark-sort"]');
  for (let input of inputs) {
    input.addEventListener('click', renderBookmarks);
  }
}

function addEventonBookmarkFilterInput() {
  let inputFilter = document.querySelector('#bookmark-filter');
  inputFilter.addEventListener('keyup', renderBookmarks);
}

function updateBookmarkTitle(visibleBookmarks) {
  let bookmarkTitle = document.querySelector('#bookmark-title');
  let bookmarkTitleLabel = visibleBookmarks.length > 1 ? 'bookmarks' : 'bookmark';
  bookmarkTitle.textContent = `${visibleBookmarks.length} ${bookmarkTitleLabel}`;
}

function filterBookmarks(unFilteredBookmarks) {
  let inputFilter = document.querySelector('#bookmark-filter');
  let filteredBookmarks = unFilteredBookmarks.filter((bookmark) => bookmark.title.toLowerCase().includes(inputFilter.value.toLowerCase()) || getBreadCrumb(bookmark).toLowerCase().includes(inputFilter.value.toLowerCase()));
  return filteredBookmarks;
}

function sortBookmarks(unSortedBookmarks) {
  let sorting = document.querySelector('input[name="bookmark-sort"]:checked').value;

  switch (sorting) {
    case 'title':
      return unSortedBookmarks.sort(compareTitle);
    case 'creationDate':
      return unSortedBookmarks.sort(compareCreationDates);
    default:
      return unSortedBookmarks;
  }
}

function compareTitle(a, b) {
  return a.title.localeCompare(b.title);
}

function compareCreationDates(d1, d2) {
  let date1 = new Date(d1.creationDate).getTime();
  let date2 = new Date(d2.creationDate).getTime();

  if (date1 < date2) {
    return -1;
  } else if (date1 > date2) {
    return 1;
  } else {
    return 0;
  }
}

function showBookmarks(sortedBookmarks) {
  updateBookmarkTitle(sortedBookmarks);
  let tableElement = document.querySelector('table');
  tableElement.textContent = '';
  let trElement = document.createElement('tr');
  addThElement(trElement, 'Color');
  addThElement(trElement, 'Title');
  addThElement(trElement, 'Map Title');
  addThElement(trElement, 'Breadcrumb');
  addThElement(trElement, 'Creation Date');
  addThElement(trElement, 'Last Update');
  addThElement(trElement, 'Delete');
  tableElement.appendChild(trElement);

  for (let bookmark of sortedBookmarks) {
    let trElement = document.createElement('tr');

    addTdElement(trElement, bookmark, 'color');
    addTdElement(trElement, bookmark, 'title');
    addTdElement(trElement, bookmark, 'mapTitle');
    addTdElement(trElement, bookmark, 'breadcrumb');
    addTdElement(trElement, bookmark, 'creationDate');
    addTdElement(trElement, bookmark, 'lastUpdate');
    addTdElement(trElement, bookmark, 'delete');

    tableElement.appendChild(trElement);
  }
}
function addThElement(trElement, header) {
  let tdElement = document.createElement('th');
  tdElement.textContent = header;
  trElement.appendChild(tdElement);
}

function addTdElement(trElement, bookmark, header) {
  let tdElement = document.createElement('td');
  switch (header) {
    case 'color':
      tdElement.classList.add('dot');
      tdElement.classList.add(`color-${bookmark[header]}`);
      break;
    case 'title':
      let titleElement = document.createElement('a');
      titleElement.href = bookmark['readerUrl'];
      titleElement.textContent = bookmark[header];
      tdElement.appendChild(titleElement);
      break;
    case 'mapTitle':
      tdElement.textContent = bookmark[header];
      break;
    case 'breadcrumb':
      tdElement.textContent = getBreadCrumb(bookmark);
      break;
    case 'creationDate':
      let creationDate = new Date(bookmark[header]);
      tdElement.textContent = creationDate.toLocaleDateString('en');
      break;
    case 'lastUpdate':
      let lastUpdate = new Date(bookmark[header]);
      tdElement.textContent = lastUpdate.toDateString();
      break;
    case 'delete':
      let deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.classList.add('button-delete');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => {
        removeBookmark(trElement, bookmark);
      });
      tdElement.appendChild(deleteButton);
      break;
    default:
      tdElement.textContent = 'undefined';
  }

  trElement.appendChild(tdElement);
}

function getBreadCrumb(bookmark) {
  return `${bookmark['mapTitle']} > ${bookmark['breadcrumb'].join(' > ')}`;
}

async function removeBookmark(trElement, bookmark) {
  await FTAPI.delete(`/api/users/${user.profile.id}/bookmarks/${bookmark.id}`);
  bookmarks = bookmarks.filter((savedBookmark) => savedBookmark.id != bookmark.id);
  trElement.remove();
  FluidTopicsNotificationService.info('Bookmark Deleted');
  renderBookmarks();
}

main();
