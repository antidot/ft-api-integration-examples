/*=== Constants ====*/
const FLUID_TOPICS_PORTAL = "*addPortalURLhere*"; 

/*=== Main ====*/
document.addEventListener('DOMContentLoaded', function() {
    initLanguages();
    initSearch();
})

/*==== Search ====*/
function initSearch() {
    const searchInput = document.getElementById('search-input');
    searchInput.focus();

    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', handleSearchSubmit);
}

function handleSearchSubmit(event) {
    event.preventDefault(); // Prevent default form submission
    const searchInput = document.getElementById('search-input');
    const searchKeywords = searchInput.value;

    let language = document.querySelector('select#languages option:checked').id;
    initResults(searchKeywords, language);
}

