
export default {
  defaultCacheDurationSecond: 10800, // ms("180m") / 1000
  // maxCacheAgeSecond: the absolute ttl for data in workers kv.
  // this is just to prevent workers kv to grow non-stop
  // import ms from "ms";
  maxCacheAgeSecond: 604800, // ms("7d") / 1000
  githubGraphqlUrl: "https://api.github.com/graphql",
  githubApiUrl: "https://api.github.com/",
  hhMap : {
    'lastfm': '60',
    'uptimerobot': '300',
    'spotify': '60'
  }
};