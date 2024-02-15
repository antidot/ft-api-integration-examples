/*=== 
 Main
====*/

document.addEventListener('DOMContentLoaded', function() {
    initLanguages();
    let facetsIds = ["Product", "Category"];
    initFilters('en-US', facetsIds);
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

	// select every selected filters, except languages related on
        let FtFilters = document.querySelectorAll('select:not(#languages) option:checked');
	// Because document.querySelectorAll() does not return an Array instance but an instance of NodeList (that does not have a .map() method), hence we need to use Array.prototype.map.call(array, function))

	FtFilters = Array.prototype.map.call(FtFilters, (elmt) => {
            if (elmt.id != ''){
                values=[];
                values.push(elmt.value);
                return {
                    'key': elmt.parentNode.id,
                    'values': values
                }
            }
        }).filter(elmt => elmt != null);
	
	let language = document.querySelector('select#languages option:checked').id;

	//clean spellcheck title
        let spellcheckSection = document.getElementById('spellcheck');
        spellcheckSection.innerHTML = "";

	// Now the results will be returned inside our custom page
	initResults(value, language, FtFilters);
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
