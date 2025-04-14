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
    redirectToSearch(searchKeywords, language);
}

function redirectToSearch(searchTerm, language) {
    const url = getFTSearchUrl(searchTerm, language);
    window.location.href = url;
}

function getFTSearchUrl(searchTerm, language = null) {
    const FTPortalHost = FLUID_TOPICS_PORTAL;
    const route = 'search/all?';
    const queryParams = [`query=${encodeURIComponent(searchTerm)}`];

    // add the content-locale to the search url (e.g. content-lang=<languageCode>)
    if (language !== null){
        queryParams.push(`content-lang=${language}`);
    }

    return `${FTPortalHost}/${route}${queryParams.join('&')}`;
}

