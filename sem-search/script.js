const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const submitButton = document.getElementById("submitButton");

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
    let jsonResponse = await searchForTermSemantically(searchTerm);
    updateSearchResults(jsonResponse, searchTerm);
  } catch (error) {
    console.error("Error fetching suggestions:", error.message);
  }
}

async function searchForTermSemantically(searchTerm) {
  const url = "/api/beta/khub/topics/semantic-search";
  const body = {
    query: searchTerm,
    contentLocale: contentLang,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  const response = await fetch(url, requestOptions);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

function clearSearchResults() {
  searchResults.innerHTML = "";
}

function updateSearchResults(response, searchTerm) {
  const results = response.results;
  clearSearchResults();

  if (results.length === 0) {
    displayNoSuggestionsMessage();
  } else {
    results.forEach((result) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      const title = document.createElement("div");
      const excerpt = document.createElement("div");

      title.classList.add("title");
      excerpt.classList.add("excerpt");

      a.href = "/r/" + result.topic.map_id + "/" + result.topic.toc_id;

      title.innerHTML = result.topic.title;
      excerpt.innerHTML = result.topic.excerpt.replace(/\n/g, "<br>");
      excerpt.innerHTML = excerpt.innerHTML.replace(/^.*?<br><br>/, "");

      a.appendChild(title);
      a.appendChild(excerpt);
      li.appendChild(a);
      searchResults.appendChild(li);
    });
  }
}

function displayNoSuggestionsMessage() {
  const li = document.createElement("li");
  li.textContent = noSuggestionsMessage;
  searchResults.appendChild(li);
}
