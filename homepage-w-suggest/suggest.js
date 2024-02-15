/*=====
Suggest
======*/

window.addEventListener("load", function(){
    var suggestInput = document.getElementById('search-input');
    // Add a keyup event listener to the input element
    suggestInput.addEventListener('keyup', function(event){
	getSuggestions(event)
    });
});

function getSuggestions(event){
    // Get the <datalist> and <input> elements.
    var suggestionsList = document.getElementById('json-datalist');
    
    //arbitrary number of min chars to trigger a call to the suggest
    var minCharacters = 3;

    // retrieve the input element
    var inputElt = event.target;
    // retrieve the input element value
    var chars = inputElt.value

    if (chars.length < minCharacters ) { 
        return;
    } else { 
	// Set up headers
	let headers = new Headers();
	headers.append("Accept", "application/json");
	headers.append("Content-Type", "application/json");
    headers.append("FT-Calling-App", "ft-api-demo");
    headers.append("FT-Calling-App-Version", "0.42");
	// call the FT Suggest API...
	let APIhost = "/demo";
    const suggestPromise = fetch(new Request(APIhost + '/api/khub/suggest'),{
	    method: 'POST',
	    body:JSON.stringify({
		input: chars,
		contentLocale: "en-US",
		maxCount: '10'
	    }),
	    headers:headers
	}).then(response => response.json())        // Parse the Suggest response
	    .then(jsonTree => { //with the JSON array returned:
		// clear any previously loaded options in the datalist
		suggestionsList.innerHTML = "";    
		// Loop over the "suggestions" element of the JSON array.
		jsonTree.suggestions
		    .forEach(listItem => {
			// Create a new <option> element for each array item
			var option = document.createElement('option');
			// Set the value using the item in the JSON array.
			option.text = "[" + listItem.type + "]";
			option.value = listItem.value;
			// Add the <option> element to the <datalist> tag.
			suggestionsList.appendChild(option);
		    }) //end of forEach
	    }); // end of then(jsonTree =>
    }        
}
