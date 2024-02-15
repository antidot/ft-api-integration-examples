/*=============================
 Generic method for FT API Call
=============================*/

function send(method, route, callback, payload = null){       
    payload = payload === null ? payload : JSON.stringify(payload);
    let defaultHeader = new Headers();
    defaultHeader.append("Accept", "application/json");
    defaultHeader.append("Content-Type", "application/json");
    defaultHeader.append("FT-Calling-App", "ft-api-demo");
    defaultHeader.append("FT-Calling-App-Version", "0.42");
    let APIhost = "/demo";
    
    let url = APIhost + route;
    
    if(method === 'GET'){
	const responsePromise = fetch(new Request(url),  {
	    method: method,
	    headers: defaultHeader
	});
	responsePromise
	    .then(response => response.json())
	    .then(jsonTree => {
		callback(jsonTree);
	    });
    } 
    else{ // add payload
	const responsePromise = fetch(new Request(url),  {
	    method: method,
	    body: payload,
	    headers: defaultHeader
	});
	responsePromise
	    .then(response => response.json())
	    .then(jsonTree => {
		callback(jsonTree);
	    });
    };
}
