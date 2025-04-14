const scripts = [
    "https://cdn.jsdelivr.net/npm/@fluid-topics/ft-search-bar/build/ft-search-bar.min.js",
    "https://cdn.jsdelivr.net/npm/@fluid-topics/public-api/dist/fluidtopics.min.js"
];

scripts.forEach(src => {
    const script = document.createElement("script");
    script.setAttribute("src", src);
    document.head.appendChild(script); // Append the script to the document
});

const searchBar = document.querySelector('ft-search-bar');
searchBar.addEventListener("launch-search", event => {
    const searchUrl = searchBar.searchRequestSerializer(event.detail);

    // Open the search URL in a new tab
    window.open(searchUrl, '_blank');
});