/*=====
API
=====*/

const APIhost = "https://sandbox.fluidtopics.net/training";

const setHeaders = () => {
  const headers = new Headers();
  headers.append("Accept", "application/json");
  headers.append("Content-Type", "application/json");
  headers.append("FT-Calling-App", "ft-api-demo");
  headers.append("FT-Calling-App-Version", "0.42");
  return headers;
}

const send = (method, route, callback, payload = null) => {
  const url = `${APIhost}${route}`;
  payload = payload === null ? payload : JSON.stringify(payload);
  const param = { method, headers: setHeaders() };
  if (method !== 'GET') {
    param.body = payload;
  }
  return fetch(new Request(url), param)
    .then(response => {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json()
      } else {
        return response.text()
      }
    })
    .then(jsonTree => {
      callback(jsonTree);
    });
};

/*=====
Locales
=====*/

const initLanguages = (callback) => {
    getLanguages((data) => {
      createLanguageFacet(data).then(callback)
    });
    registerLanguageChangeEvent(callback);
  }
  
  const getLanguages = (callback) => {
    send('GET', "/api/khub/locales", callback);
  }
  
  const createLanguageFacet = (data) => {
    let firstLang = true;
    data.contentLocales.forEach(localeItem => {
      const code = localeItem.lang;
      const label = localeItem.label;
      const option = document.createElement('option');
      option.setAttribute('id', code);
      option.text = label;
      if (firstLang) {
        option.setAttribute('selected','');
        language = code;
      }
      firstLang = false;
      document.getElementById('languages').appendChild(option);
    });
    return Promise.resolve();
  };
  
  const registerLanguageChangeEvent = (callback) => {
    const langSelect = document.getElementById('languages');
    langSelect.addEventListener('change', () => {
      language = langSelect.options[langSelect.selectedIndex].id;
      if (callback) {
          callback();
      }
    });
  }

/*=====
Inline help
======*/

let language;

window.addEventListener("load", function() {
  initLanguages(() => {
    loadHelp(document.getElementById('description'));
  });

  //Add a listener for each tooltip
  const helps = document.getElementsByClassName('help-tip');
  for (let helpTip of helps) {
    helpTip.addEventListener('mouseenter', function(event){
      loadHelp(helpTip.children[0], helpTip.id);
    });
    }
});

function loadHelp(inlineHelp, callerID){
  //Only call the API if we didn't already load the help content for this locale
  if (language && inlineHelp.getAttribute("language") !== language) {
    inlineHelp.innerHTML="Loading...";

    if(!callerID) {
      callerID = 'desc';
    }

    const callback = (data) => {
      inlineHelp.innerHTML = data;
      inlineHelp.setAttribute("language", language)
    };
    const route = `/api/khub/section/html?ft:baseId=${callerID}&ft:locale=${language}`;

    send('GET', route, callback);

  }
}
