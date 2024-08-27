const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

const noSuggestionsMessage = "No suggestions found, try another query.";
const contentLang = "en-US";
const Version_FT = "Version_FT";
const Version_FT_value = "Latest";

searchInput.addEventListener('input', async function() {
    const searchTerm = this.value.trim();
    if (searchTerm === '') {
        searchResults.innerHTML = '';
        return;
    }

    try {
        const FTAPI = await new window.fluidtopics.FluidTopicsApi();

        const body = {
            "input": searchTerm,
            "contentLocale": contentLang,
            "filters": [{
                "key": Version_FT,
                "values": [Version_FT_value]
            }]
        };

        let response = await FTAPI.post(`/api/khub/suggest`, body);

        let suggestions = response.suggestions;

        searchResults.innerHTML = '';

        if (suggestions.length === 0) {
            const li = document.createElement('li');
            li.textContent = noSuggestionsMessage;
            searchResults.appendChild(li);
        } else {
            suggestions.forEach(suggestion => {
                const li = document.createElement('li');

                const encodedSuggestion = suggestion.value.replace(/ /g, '+');
                const encodedFilters = encodeURIComponent(`${Version_FT}~"${Version_FT_value}"`);

                const url = `/search?content-lang=${contentLang}&query=${encodedSuggestion}&filters=${encodedFilters}`;

                const a = document.createElement('a');
                a.href = url;
                a.textContent = suggestion.value;

                li.appendChild(a);
                searchResults.appendChild(li);
            });
        }

    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
});
