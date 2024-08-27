const APIhost = "/demo";

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

