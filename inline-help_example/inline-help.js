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
