document.addEventListener('ft:pageopening', function(event){ 
	if (window.location.href.endsWith('/home')){ 
		window.alert('Welcome to the documentation portal'); 
	} 
});