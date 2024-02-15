let language;
language='en-US'

//window.addEventListener("load", function() {
  //Add a listener for each tooltip
  //const helps = document.getElementsByClassName('help-tip');
  const helps = document.querySelectorAll('.help-tip');
  
  for (let helpTip of helps) {
    console.log(helpTip)
    helpTip.addEventListener('mouseenter', function(event){
      loadHelp(helpTip.children[0], helpTip.id);
    });
    }
//});

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
