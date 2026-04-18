const BACKEND_BASE = 'http://jplearning-backend-env.eba-zmn92mjm.ap-southeast-2.elasticbeanstalk.com';

function buildCorsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true'
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: buildCorsHeaders(request.headers.get('Origin'))
        });
      }

      const targetUrl = `${BACKEND_BASE}${url.pathname}${url.search}`;

      const headers = new Headers(request.headers);
      headers.set('Host', new URL(BACKEND_BASE).host);

      const init = {
        method: request.method,
        headers,
        redirect: 'follow'
      };

      if (request.method !== 'GET' && request.method !== 'HEAD') {
        init.body = request.body;
      }

      const backendResponse = await fetch(targetUrl, init);

      const responseHeaders = new Headers(backendResponse.headers);

      const corsHeaders = buildCorsHeaders(request.headers.get('Origin'));
      Object.entries(corsHeaders).forEach(([key, value]) => {
        responseHeaders.set(key, value);
      });

      return new Response(backendResponse.body, {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        headers: responseHeaders
      });
    }

    return env.ASSETS.fetch(request);
  }
};