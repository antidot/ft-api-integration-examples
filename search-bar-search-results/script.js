const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const submitButton = document.getElementById("submitButton");
const resultLimitSelect = document.getElementById("resultLimit");
const noSuggestionsMessage = "No suggestions found, try another query.";
const contentLang = "en-US";

submitButton.addEventListener("click", handleSearch);

async function handleSearch() {
  const searchTerm = searchInput.value.trim();
  if (searchTerm === "") {
    clearSearchResults();
    return;
  }

  try {
    const response = await searchForTerm(searchTerm);
    updateSearchResults(response, searchTerm);
  } catch (error) {
    console.error("Error fetching suggestions:", error.message);
  }
}

function clearSearchResults() {
  searchResults.innerHTML = "";
}

async function searchForTerm(searchTerm) {
  const url = "/api/khub/clustered-search";
  const body = JSON.stringify({
    query: searchTerm,
    contentLocale: contentLang,
  });

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  };

  const response = await fetch(url, requestOptions);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

function updateSearchResults(response, searchTerm) {
  const results = response.results;
  clearSearchResults();

  if (results.length === 0) {
    displayNoSuggestionsMessage();
  } else {
    const resultLimit = parseInt(resultLimitSelect.value);
    const slicedResults = results.slice(0, resultLimit);
    displayResults(slicedResults, response, searchTerm);
  }
}

function displayNoSuggestionsMessage() {
  const li = document.createElement("li");
  li.textContent = noSuggestionsMessage;
  searchResults.appendChild(li);
}

function displayResults(results, response, searchTerm) {
  if (response.spellcheck && response.spellcheck.suggestedQuery) {
    displaySpellcheckInfo(response);
  }

  results.forEach((result) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const p = document.createElement("p");
    const entry = result.entries[0];

    if (entry.type === "MAP") {
      displayMapEntry(li, a, p, entry);
    } else if (entry.type === "TOPIC") {
      displayTopicEntry(li, a, p, entry);
    }

    searchResults.appendChild(li);
  });
}

function displaySpellcheckInfo(response) {
  const resultsFor = document.createElement("div");
  resultsFor.classList.add("resultsFor");
  resultsFor.textContent = `Results for: "${response.spellcheck.suggestedQuery}"`;

  const noResultsFor = document.createElement("div");
  noResultsFor.classList.add("noResultsFor");
  noResultsFor.textContent += `No results for query "${searchTerm}"`;

  searchResults.append(resultsFor, noResultsFor);
}

function displayMapEntry(li, a, p, entry) {
  a.href = entry.map.readerUrl;
  const titleDiv = createTitleDiv(entry.map.htmlTitle);
  p.appendChild(titleDiv);
  a.appendChild(p);
  li.appendChild(a);
}

function displayTopicEntry(li, a, p, entry) {
  a.href = entry.topic.readerUrl;
  const titleDiv = createTitleDiv(entry.topic.htmlTitle);
  p.appendChild(titleDiv);
  const excerptDiv = createExcerptDiv(entry.topic.htmlExcerpt);
  p.appendChild(excerptDiv);
  a.appendChild(p);
  li.appendChild(a);
}

function createTitleDiv(htmlTitle) {
  const titleDiv = document.createElement("div");
  titleDiv.classList.add("title");
  titleDiv.innerHTML = htmlTitle;
  return titleDiv;
}

function createExcerptDiv(htmlExcerpt) {
  const excerptDiv = document.createElement("div");
  excerptDiv.classList.add("excerpt");
  excerptDiv.innerHTML = htmlExcerpt;
  return excerptDiv;
}
