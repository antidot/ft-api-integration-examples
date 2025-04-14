/*=== Constants ====*/
const FLUID_TOPICS_PORTAL = "*addPortalURLhere*"; 

/*=== Main ====*/
document.addEventListener('DOMContentLoaded', function() {
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
    redirectToSearch(searchKeywords);
}

function redirectToSearch(searchTerm) {
    const url = getFTSearchUrl(searchTerm);
    window.location.href = url;
}

function getFTSearchUrl(searchTerm) {
    const FTPortalHost = FLUID_TOPICS_PORTAL;
    const route = 'search/all?';
    const queryParams = [`query=${encodeURIComponent(searchTerm)}`];
    return `${FTPortalHost}/${route}${queryParams.join('&')}`;
}
