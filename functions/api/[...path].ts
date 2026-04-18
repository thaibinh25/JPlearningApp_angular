export async function onRequest(context: any) {
  const { request, params } = context;

  const backendBase = "http://jplearning-backend-env.eba-zmn92mjm.ap-southeast-2.elasticbeanstalk.com";

  const url = new URL(request.url);
  const path = params.path ? params.path.join("/") : "";

  const targetUrl = `${backendBase}/api/${path}${url.search}`;

  const newRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.method === "GET" ? null : request.body
  });

  return fetch(newRequest);
}