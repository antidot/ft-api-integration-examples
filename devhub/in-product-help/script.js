var iph = document.createElement('script');
iph.async = true;
iph.src = 'https://cdn.jsdelivr.net/npm/@fluid-topics/ft-in-product-help/build/ft-in-product-help.min.js';
document.append(iph);

var b = document.createElement('script');
b.async = true;
b.src = 'https://cdn.jsdelivr.net/npm/@fluid-topics/ft-button/build/ft-button.min.js';
document.append(b);

var sw = document.createElement('script');
sw.async = true;
sw.src = 'https://cdn.jsdelivr.net/npm/@fluid-topics/ft-size-watcher/build/ft-size-watcher.min.js';
document.append(sw);

document.getElementById('question-button').addEventListener('click', function() {
  let iph = document.getElementById('iph');
  //iph.setAttribute('opened', 'true');
  console.log(iph.getAttribute('opened'))
  if (iph.hasAttribute('opened')){
      iph.removeAttribute('opened');
  }
  else{
      iph.setAttribute('opened', "");
  }

});

