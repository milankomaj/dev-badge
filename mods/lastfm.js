// http://127.0.0.1:8787/lastfm/last-played/last_fm_M?icon=lastfm&style=flat&scale=1.5
// https://dev-badge.xxx.workers.dev/lastfm/top-track/last_fm_M/12month
import { formatDistanceToNow } from 'date-fns';

async function handleLastfm({
    topic,
    user,
    period
}) {
    const endpoint = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${LASTFM_KEY}&format=json&limit=1`
    const resp = await fetch(endpoint, {
        method: "get",
        headers: { "Cache-Control": "no-store" }
    });
    //console.log("👉 log:",user,LASTFM_KEY)
    if (resp.status === 200) {
        const { recenttracks } = await resp.json();
        const lastPtrack = (recenttracks.track['0'].name)
        const lastPartist = (recenttracks.track['0'].artist['#text'])
        const lastPalbum = (recenttracks.track['0'].album['#text'])

        const endpoint2 = `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=${encodeURIComponent(lastPartist)}&api_key=${LASTFM_KEY}&format=json`
        const resp2 = await fetch(endpoint2, { method: "get", headers: { "Cache-Control": "no-store" } });
        const { toptags } = await resp2.json();
        const lastPgenre = (toptags.tag['0'].name);
        // console.log("👉 log:",lastPgenre)
        const lastPnow = (recenttracks.track['0']['@attr'])

        switch (topic) {
            case "last-played":
                if (typeof lastPnow === 'undefined') {
                    const lastPdate = (recenttracks.track['0'].date['#text'])
                    const lastPdatefn = (formatDistanceToNow(new Date(lastPdate), { addSuffix: true })); // date-fns
                    return {
                        subject: "Played " + lastPdatefn + ": " + lastPartist + " (#" + lastPgenre + ")",
                        status: lastPtrack + " (" + lastPalbum + ")",
                        color: 'd92323',
                    };
                } else {
                    return {
                        subject: "Now playing" + ": " + lastPartist + " (#" + lastPgenre + ")",
                        status: lastPtrack + " (" + lastPalbum + ")",
                        color: '115724',
                    };
                }
        case "top-track":
            const endpoint3 = `https://ws.audioscrobbler.com/2.0/?method=user.getTopTracks&user=${user}&api_key=${LASTFM_KEY}&format=json&limit=1&period=${period}`
            const resp3 = await fetch(endpoint3, { method: "get", headers: { "Cache-Control": "no-store" } });
            const { toptracks } = await resp3.json();
            const playcount = (toptracks.track['0'].playcount)
            return {
                subject: "top-track (" +  playcount + '/' + `${period})`,
                status: toptracks.track['0'].name + ' (' +  toptracks.track['0'].artist.name + ')',
                color: 'd92323',
            };
        }


    } else {
        return {
            subject: "Lastfm",
            status: resp.status.toString() + ' (' + resp.statusText.toString() + ')',
            labelColor: "grey"
        }
    }
}
export default handleLastfm