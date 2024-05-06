/*=====
API
=====*/

const APIhost = "https://sandbox.fluidtopics.net/training";
// const APIhost = "https://sandbox.fluidtopics.net/docredesign";

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
//   console.log(method, route, url, payload)

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
Inline help
======*/

let language;
language='en-US'

window.addEventListener("load", function() {
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

    // Set a default callerID
    if(!callerID) {
      callerID = 'c3po';
    }

    const callback = (data) => {
      inlineHelp.innerHTML = data;
    };
    const route = `/api/khub/section/html?ft:baseId=${callerID}&ft:locale=${language}`;

    send('GET', route, callback);
  }
}


/*=====
Fake popup
=====*/

window.addEventListener("DOMContentLoaded", (event) => {
    const openBtn = document.getElementById('popupButton');
    const closeBtn = document.getElementById('closeButton');
    if (openBtn) {
        document.getElementById("popupButton").addEventListener("click", function() {
            document.getElementById("popup").style.display = "block";
        });
    }
    if (closeBtn) {
        document.getElementById("closeButton").addEventListener("click", function() {
            document.getElementById("popup").style.display = "none";
        });
      }
});
