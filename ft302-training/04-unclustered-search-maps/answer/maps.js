function initMaps(keywords, locale) {
    getMaps(buildMapsResults, keywords, locale)
}

function getMaps(callback, keywords, locale) {
    //look for the results matching "keywords" and return the first 10 maps only
    const payload = {
	"query": keywords,
        "contentLocale": locale,
	"paging": {
	   "page": 1,
	   "perPage": 10
	}
    }
    // new request from the endpoint of Maps search
    send('POST', "/api/khub/maps/search", callback, payload);
}

function buildMapsResults(jsonTree){

    const domMapsResultsList = document.querySelector('ul#maps');
    domMapsResultsList.innerHTML = '';
    
    // add a title for the maps results    
    const domMapsResultsSection = document.querySelector('div#maps-results');
    const domMapsResultsTitle = document.createElement('p');
    domMapsResultsTitle.innerHTML="Maps Results";
    domMapsResultsTitle.classList.add('map-results-list-title');
    domMapsResultsSection.appendChild(domMapsResultsTitle);
    
    //iterate over the maps results
    jsonTree.results //from the "results" json node
        .map(jsonResult => createDomMapItemResult(jsonResult))  // transform every item of the list (one item being a map)
        .forEach(domListItem => domMapsResultsList.appendChild(domListItem)); // add every map result to the <ul id="maps"> (maps container)
}

function createDomMapItemResult(jsonMapEntry) {
    const link = document.createElement('a');
    const article = document.createElement('article');
    const title = document.createElement('div');
    const excerpt = document.createElement('div');

    fillDomMapResult(jsonMapEntry, title, excerpt, link); 

    link.setAttribute('target', '_blank');

    article.classList.add('result-map-item');
    article.classList.add('result-type-map');
    title.classList.add('result-title');
    excerpt.classList.add('result-excerpt');

    link.appendChild(article);
    article.appendChild(title);

    if (excerpt.innerHTML.length > 0) {
        article.appendChild(excerpt);
    }
    return link;
}

function fillDomMapResult(jsonMapEntry, domTitle, domExcerpt, domLink) {
    domTitle.innerHTML = jsonMapEntry.htmlTitle;
    domExcerpt.innerHTML = jsonMapEntry.htmlExcerpt;
    domLink.setAttribute('href', new URL(`${jsonMapEntry.readerUrl}`));
}
