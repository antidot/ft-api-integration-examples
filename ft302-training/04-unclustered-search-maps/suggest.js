/*===== Suggest ======*/
window.addEventListener("load", function() {
    const suggestInput = document.getElementById('search-input');
    suggestInput.addEventListener('keyup', function(event) {
        handleKeyup(event);
    });
});

function handleKeyup(event) {
    const minCharacters = 3;
    const input = event.target.value;

    if (input.length >= minCharacters) {
        fetchSuggestions(input).then(renderSuggestions);
    }
}

async function fetchSuggestions(input) {
    const headers = new Headers({
        "Accept": "application/json",
        "Content-Type": "application/json",
        "FT-Calling-App": "ft-api-demo",
        "FT-Calling-App-Version": "0.42",
    });

    const response = await fetch(new Request(FLUID_TOPICS_PORTAL + '/api/khub/suggest'), {
        method: 'POST',
        body: JSON.stringify({
            input: input,
            contentLocale: "en-US",
            maxCount: '10'
        }),
        headers: headers
    });
    return response.json();
}

function renderSuggestions(jsonTree) {
    const suggestionsList = document.getElementById('json-datalist');
    suggestionsList.innerHTML = "";

    jsonTree.suggestions.forEach(listItem => {
        const option = document.createElement('option');
        option.text = `[${listItem.type}]`;
        option.value = listItem.value;
        suggestionsList.appendChild(option);
    });
}