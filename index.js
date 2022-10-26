import Router from 'cloudworker-router';
import config from './config';
import badgen from './helpers/badge';
import * as handlers from './mods';
const router = new Router();

async function routeHandler(ctx, handler) {
  const { pathname } = new URL(ctx.request.href);
  const badgeOpts = await handler(ctx.params);
  const body = badgen(badgeOpts, ctx.query);
  // console.log("👉 body:",body)

  const req = ctx.event.request;
  const country = req.headers.get('CF-IPCountry');
  const ip = req.headers.get('CF-Connecting-IP');
  const colo = (req.cf || {}).colo;
  const http = (req.cf || {}).httpProtocol;
  const tls = (req.cf || {}).tlsVersion;
  const region = (req.cf || {}).region;
  const asn = (req.cf || {}).asn;
  const method = req.method;

  // console.log("👉 log:",pathname.split('/')[1])
  // console.log("👉 href:",(ctx.request.href))

  const hhPatch = pathname.split('/')[1]

  const _hh = config.hhMap[hhPatch];

  ctx.body = body;
  ctx.response.headers = {
    'content-type': 'image/svg+xml',
    'Cache-Control': `max-age=${_hh ? _hh : config.defaultCacheDurationSecond},immutable`,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, HEAD',
    'dev-badge': `v.2.0-${country}-${ip}-${colo}-${http}-${tls}-${region}-${asn}-${method}`,
    'Access-Control-Allow-Origin': '*',
    'X-Content-Type-Options': 'nosniff',
    'Alt-Svc': `h3=":443"; ma=${_hh ? _hh : config.defaultCacheDurationSecond}, h3-29=":443"; ma=${_hh ? _hh : config.defaultCacheDurationSecond}, h3-25=":443"; ma=${_hh ? _hh : config.defaultCacheDurationSecond}, h2=":443"; ma=${_hh ? _hh : config.defaultCacheDurationSecond}`
  };
  ctx.status = 200;
  // console.log("👉 log:",hhPatch,Object.values(ctx.response.headers).toString())
}
const rc = Math.random().toString(16).slice(-6);
const rc2 = Math.random().toString(16).slice(-6);
const handlerMap = {

  '/*': () => ({ subject: "badge", status: 'v:' + "2.0", labelColor: rc2, color: rc }),

  '/badge/:label/:status': handlers.badge,
  '/badge/:label/:status/:color': handlers.badge,

  '/npm/:topic/:pkgName': handlers.npm,

  '/github/:topic/:owner/:repo': handlers.github,

  '/bundlephobia/:topic/:pkgName': handlers.bundlephobia,

  '/packagephobia/:topic/:pkgName': handlers.packagephobia,
  '/packagephobia/:topic/:scope/:pkgName': handlers.packagephobia,

  '/travis/:user/:repo/:branch': handlers.travis,
  '/travis/:user/:repo': handlers.travis,

  '/appveyor/:account/:project/:branch': handlers.appveyor,
  '/appveyor/:account/:project': handlers.appveyor,

  '/vs-marketplace/:topic/:pkgName': handlers.vsmarketplace,

  '/docker/:topic/:scope/:name': handlers.docker,
  '/docker/:topic/:scope/:name/:tag': handlers.docker,
  '/docker/:topic/:scope/:name/:tag/:architecture': handlers.docker,
  '/docker/:topic/:scope/:name/:tag/:architecture/:variant': handlers.docker,

  '/amo/:topic/:pkgName': handlers.amo,

  '/securityheaders/:domain': handlers.securityheaders,

  '/mozilla/:topic/:domain': handlers.mozilla,

  '/jsdelivr/:topic/:period/:type/:name': handlers.jsdelivr,

  '/uptimerobot/:topic/:period/:apikey': handlers.uptime,

  '/lastfm/:topic/:user': handlers.lastfm,
  '/lastfm/:topic/:user/:period': handlers.lastfm,

  '/dependabot/:owner/:repo/:branch': handlers.dependabot,

  '/spotify/:topic': handlers.spotify,
  '/spotify/:topic/:period': handlers.spotify,

  '/youtube/:topic/:id': handlers.youtube,

  '/calendar/:topic': handlers.calendar,

  '/actions/:user/:repo/:workflow/:branch/:event': handlers.actions,
  '/actions/:user/:repo/:workflow/:event': handlers.actions,
  '/actions/:user/:repo/:workflow': handlers.actions,

  '/metrics/:topic/:script/:subtract': handlers.metrics,

};

router.get('/favicon.ico', async (ctx) => {
  ctx.status = 204;
  ctx.body = (null);
  ctx.response.headers = {};
});


Object.entries(handlerMap).forEach(([path, handler]) => {
  router.get(path, async (ctx) => routeHandler(ctx, handler));
});

// eslint-disable-next-line
addEventListener("fetch", (event) => {
  event.respondWith(router.resolve(event));
});
