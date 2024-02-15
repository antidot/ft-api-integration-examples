window.onload = () => {
    const queryParams = new URLSearchParams(window.location.search.slice(1));
    /* NB:
      window.location.href ==> "http://mywebapp.antidot.net/readerpage/map.html?id=hKklVq_FN8NIao3uPW7Ryg"
      window.location.search ==> "?id=hKklVq_FN8NIao3uPW7Ryg"
      window.location.search.slice(1) ==> "id=hKklVq_FN8NIao3uPW7Ryg"
     */
    const mapId = queryParams.get('id'); // ==> hKklVq_FN8NIao3uPW7Ryg"

    loadAndDisplayMetadata(mapId);
    loadAndDisplayToc(mapId, queryParams.get('topic'));

    if (queryParams.has('topic')) {
        loadAndDisplayTopicMetadata(mapId, queryParams.get('topic'));
        loadAndDisplayTopicContent(mapId, queryParams.get('topic'));
    }
};

function loadAndDisplayMetadata(mapId) {
    // https://doc.antidot.net/reader/GVlhPlL7mrI0y70BQ87taQ/_wwPJH9jg8FimxjOG~6jNw
    const responsePromise = fetch(new Request(`/demo/api/khub/maps/${mapId}`), {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    responsePromise
        .then(response => response.json())
        .then(jsonTree => {
            const domTitle = document.getElementById('map-title');
            domTitle.innerText = jsonTree.title;
        });
}


function loadAndDisplayTopicMetadata(mapId, topicId) {
    // https://doc.antidot.net/reader/GVlhPlL7mrI0y70BQ87taQ/TP7OvTVo_gKHqMp_e3akKw
    const responsePromise = fetch(new Request(`/demo/api/khub/maps/${mapId}/topics/${topicId}`), {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    responsePromise
        .then(response => response.json())
        .then(jsonTree => {
            const domTitle = document.getElementById('topic-title');
            domTitle.innerText = jsonTree.title;
        });
}

function loadAndDisplayTopicContent(mapId, topicId) {
    // https://doc.antidot.net/reader/GVlhPlL7mrI0y70BQ87taQ/fv~7NKhrDxbwpjrTLP9QYQ
    const responsePromise = fetch(new Request(`/demo/api/khub/maps/${mapId}/topics/${topicId}/content`), {
        method: 'GET',
        headers: {
            'Accept': 'text/html'
        }
    });

    responsePromise
        .then(response => response.text())
        .then(html => {
            const domTopicContainer = document.getElementById('topic-content');
            domTopicContainer.innerHTML = html;
        });
}

/* TOC */
function loadAndDisplayToc(mapId, maybeTopicId) {
    // https://doc.antidot.net/reader/GVlhPlL7mrI0y70BQ87taQ/xbOBwYPl9xDnp3GNzyrIgg
    const responsePromise = fetch(new Request(`/demo/api/khub/maps/${mapId}/toc`), {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    responsePromise
        .then(response => response.json())
        .then(jsonTree => {
            const domTocContainer = document.getElementById('map-toc');
            domTocContainer.innerHTML = '';
            jsonTree.forEach(jsonTocEntry => createDomTocEntryAndAppendToContainer(mapId, maybeTopicId, jsonTocEntry, domTocContainer));
        });
}

//recursive function to loop over the TocEntry if there are children TocEntries
function createDomTocEntryAndAppendToContainer(mapId, maybeTopicId, jsonTocEntry, domContainer) {
    const domTocEntry = document.createElement('li');
    const domLink = document.createElement('a');

    domLink.innerText = jsonTocEntry.title;
    domLink.setAttribute('href', `./map.html?id=${mapId}&topic=${jsonTocEntry.contentId}`);

    if (jsonTocEntry.contentId === maybeTopicId) {
        domTocEntry.classList.add('current-topic');
    }

    domTocEntry.appendChild(domLink);

    if (jsonTocEntry.children.length > 0) {
        const domTocEntryChildrenList = document.createElement('ul');
        jsonTocEntry.children.forEach(jsonTocEntryChild => createDomTocEntryAndAppendToContainer(mapId, maybeTopicId, jsonTocEntryChild, domTocEntryChildrenList));
        domTocEntry.appendChild(domTocEntryChildrenList);
    }

    domContainer.appendChild(domTocEntry);
}
