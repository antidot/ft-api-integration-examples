/*=== 
 Main
====*/

document.addEventListener('DOMContentLoaded', function() {
    initSearch();
})

/*====
Search
====*/

function initSearch() {
    function onSearchEnter(event, value = null) {
        if (value === null) {
            value = event.target.value;
        }
	//Redirect outside the app (i.e. to FTPortalHost portal)
        window.location.href = getFTSearchUrl(value);
    }
    
    //Get the search term(s) input
    const searchInput = document.getElementById('search-input');
    searchInput.focus();
    // Execute a function when the user hit 'Enter' key or click the "Search" button to validate the form
    document.getElementById('search-form').addEventListener('submit', function (event) {
	// Get the search term(s) value
        const searchKeywords = searchInput.value;
	//Submit the query
        onSearchEnter(event, searchKeywords);
    });
}

function getFTSearchUrl(searchTerm, language = null, filters = null) {
    let FTPortalHost = "/demo";
    let route = 'search/all?';
    let queryParams = ['query=' + searchTerm];
    return FTPortalHost + '/' + route + queryParams.join('&');
}



