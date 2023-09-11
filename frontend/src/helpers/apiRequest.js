let API_URL = "http://localhost:4005";

export class HTTPError extends Error {
  /* status is the HTTP status, message is a user-facing error message. */
  constructor(status, message) {
    /* Call the Error constructor with the given message. */
    super(message);
    this.status = status;
  }
}

const apiRequest = async (method, path, body = null) => {
  const uri = API_URL + path;
  const res = await fetch(uri, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : null,
  });
  let data = await res.json();
  if (res.status !== 200) {
    throw new HTTPError(res.status, data.error);
  }
  return data;
};

export default apiRequest;
