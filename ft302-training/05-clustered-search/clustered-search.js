function initResults(keywords, locale) {
    getResults(buildResults, keywords, locale)
}

function getResults(callback, keywords, locale) {
    // https://doc.antidot.net/reader/GVlhPlL7mrI0y70BQ87taQ/wvQwV_vkgEUujpdXBAQGww
    // look for the results matching "keywords" and return the first 10 clusters only
    const payload = {
	"query": keywords,
	"contentLocale": locale,
	"paging": {
		"page": 1,
		"perPage": 10
	    }
    };
    // new request from the endpoint of clustered search
    send('POST', "*addClusteredSearchRoute*", callback, payload)
}

function buildResults(jsonTree){
    const domResultsList = document.querySelector('ul');
    domResultsList.innerHTML = '';

    jsonTree.results //from the "results" json node
        .map(jsonResult => createDomListClusterItemResult(jsonResult))  // transform every item of the list (one item being a cluster of results)
        .forEach(domListItem => domResultsList.appendChild(domListItem)); // add every cluster to the <ul> (clusters container)	
}

function createDomListClusterItemResult(jsonCluster) {
    const container = document.createElement('li');

    container.classList.add('result-cluster');

    jsonCluster.entries // from the "entries" json node
        .map(entry => createDomClusterItemResult(entry)) // transform every item of a cluster (create a dom for every item - i.e map, topic or document - of a cluster)
        .forEach(domClusterItem => container.appendChild(domClusterItem)); // add every item of a cluster to the <li> (cluster item container)

    return container;
}

function createDomClusterItemResult(jsonClusterEntry) {
    const link = document.createElement('a');
    const article = document.createElement('article');
    const title = document.createElement('div');
    const excerpt = document.createElement('div');

    switch (jsonClusterEntry.type) {
        case 'TOPIC':
            fillDomClusterTopicResult(jsonClusterEntry.topic, title, excerpt, link);
            break;
        case 'MAP':
            fillDomClusterMapResult(jsonClusterEntry.map, title, excerpt, link);
            break;
        case 'DOCUMENT':
            fillDomClusterDocumentResult(jsonClusterEntry.document, title, excerpt, link);
            break;
    }

    link.setAttribute('target', '_blank');

    article.classList.add('result-cluster-item');
    article.classList.add('result-type-' + computeResultType(jsonClusterEntry));
    title.classList.add('result-title');
    excerpt.classList.add('result-excerpt');

    link.appendChild(article);
    article.appendChild(title);

    if (excerpt.innerHTML.length > 0) {
        article.appendChild(excerpt);
    }

    return link;
}

function computeResultType(jsonClusterEntry) {
    return jsonClusterEntry.type === 'MAP'
        ? jsonClusterEntry.map.editorialType.toLowerCase() // when that's a MAP, precise the Editorial Type (BOOK or ARTICLE) instead (to choose a different icon according to the type)
        : jsonClusterEntry.type.toLowerCase();
}

function fillDomClusterTopicResult(jsonTopicEntry, domTitle, domExcerpt, domLink) {
    domTitle.innerHTML = jsonTopicEntry.htmlTitle; // fill the title with the topic "htmlTitle" json node content
    domExcerpt.innerHTML = jsonTopicEntry.htmlExcerpt; // fill the excerpt  with the tppic "htmlExcerpt" json node content
    domLink.setAttribute('href', new URL(`${jsonTopicEntry.readerUrl}`));
}

function fillDomClusterMapResult(jsonMapEntry, domTitle, domExcerpt, domLink) {
    domTitle.innerHTML = jsonMapEntry.htmlTitle;
    domExcerpt.innerHTML = jsonMapEntry.htmlExcerpt;
    domLink.setAttribute('href', new URL(`${jsonMapEntry.readerUrl}`));
}

function fillDomClusterDocumentResult(jsonDocumentEntry, domTitle, domExcerpt, domLink) {
    domTitle.innerHTML = jsonDocumentEntry.htmlTitle;
    domExcerpt.innerHTML = jsonDocumentEntry.htmlExcerpt;
    domLink.setAttribute('href', new URL(`${jsonDocumentEntry.viewerUrl}`));
}
