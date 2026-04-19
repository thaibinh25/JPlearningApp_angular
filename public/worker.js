export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const isStatic =
      url.pathname.includes('.') ||
      url.pathname.startsWith('/assets/');

    if (isStatic) {
      return env.ASSETS.fetch(request);
    }

    // fallback về index.html
    return env.ASSETS.fetch(new Request(new URL('/index.html', request.url)));
  }
};