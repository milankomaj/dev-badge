//http://127.0.0.1:8787/spotify/toptrack/long_term
// 🕨🕩🕪
//long_term (calculated from several years of data and including all new data as it becomes available), medium_term (approximately last 6 months), short_term (approximately last 4 weeks). Default: medium_term
import { getAccessToken } from '../helpers/spotify.js'
import { formatDistanceToNow } from 'date-fns';
async function handleSpotify({ topic, period }) {
    const accessToken = await getAccessToken()

    const term = {
        long_term: ['long_term', 'all'],
        medium_term: ['medium_term', 'last 6 months'],
        short_term: ['short_term', 'last 4 weeks'],
        undefined: ['short_term', 'last 4 weeks'],
    };
    const termperiod = term[period];

    //console.log("👉 log.termperiod:", termperiod)
    const api = {
        'toptrack': 'https://api.spotify.com/v1/me/top/tracks?limit=1&time_range=' + `${termperiod ? termperiod[0] : undefined}`,
        'recently-played': 'https://api.spotify.com/v1/me/player/recently-played?limit=1',
        'playback-state': 'https://api.spotify.com/v1/me/player',
        'currently-playing': 'https://api.spotify.com/v1/me/player/currently-playing',
        'recently-saved': 'https://api.spotify.com/v1/me/tracks?limit=1',
    };
    const endpoint = api[topic]  ?  api[topic] : "😒"

    const resp = await fetch(endpoint, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Cache-Control": "no-store",
        }
    });


    //console.log("👉 log:", accessToken)
    //console.log("👉 log.endpoint:", endpoint)
    console.log("👉 log.resp.status:", resp.status)

    if (resp.status === 200) {
        const json = await resp.json();

        //console.log("👉 log.topic:", topic)
        //console.log("👉 log.artist:", artist)
        //console.log("👉 log.resp:", JSON.stringify(json))


        switch (topic) {
            case "toptrack":
                const track = json.items['0'].name
                const artist = json.items['0'].artists['0']['name']
                const album = json.items['0'].album.name
                return {
                    subject: "Top track " + termperiod[1],
                    status: artist + " | " + album + " | " + track,
                    color: "2941ab",
                };
            case "recently-played":
                const RPtrack = json.items['0'].track.name
                const RPartist = json.items['0'].track.artists.map((artist) => artist.name).join(', ')
                const RPalbum = json.items['0'].track.album.name
                const time = (formatDistanceToNow(new Date(json.items['0'].played_at), { addSuffix: true, includeSeconds: true }))

                return {
                    subject: "Recently played " + time,
                    status: RPartist + " | " + RPalbum + " | " + RPtrack,
                    color: "d92323",
                };
            case "recently-saved":
                const RStrack = json.items['0'].track.name
                const RSartist = json.items['0'].track.artists.map((artist) => artist.name).join(', ')
                const RSalbum = json.items['0'].track.album.name
                const RStime = (formatDistanceToNow(new Date(json.items['0'].added_at), { addSuffix: true, includeSeconds: true }))

                return {
                    subject: "Recently saved/liked 💚 " + RStime,
                    status: RSartist + " | " + RSalbum + " | " + RStrack,

                };
            case "playback-state":
                const PStrack = json.item.name
                const PSartist = json.item.artists.map((artist) => artist.name).join(', ')
                const PSalbum = json.item.album.name
                const isplaying = json.is_playing
                const PlayingMap2 = {
                    true: ' ▶️ ',
                    false: ' ⏸️ ',
                }
                const DevicerMap = {
                    Computer: '💻',
                    Smartphone: '📱',
                    Speaker: '📢',
                }
                const device_name = json.device.name + DevicerMap[json.device.type]
                //const device_type = json.device.type + " :" + json.device.id
                const volume_percent = json.device.volume_percent
                return {
                    subject: "Now playing on " + json.device.type + " (" + device_name + ")" + PlayingMap2[isplaying] + " 🔊 " + volume_percent,
                    status: PSartist + " | " + PSalbum + " | " + PStrack,
                    color: "00a575",
                };
            case "currently-playing":
                const CPtrack = json.item.name
                const CPartist = json.item.artists['0']['name']
                const CPalbum = json.item.album.name
                const is_playing = json.is_playing
                const PlayingMap = {
                    true: '▶️',
                    false: '⏸️',
                }
                return {
                    subject: "Now playing " + PlayingMap[json.is_playing],
                    status: CPartist + " | " + CPalbum + " | " + CPtrack,
                    color: "00a575",
                };
        }
    } else if (resp.status === 204) {
        const resp = await fetch(api['recently-played'], {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Cache-Control": "no-store",
            }
        });
        const { items } = await resp.json();
        const RPtrack = items['0'].track.name
        const RPartist = items['0'].track.artists.map((artist) => artist.name).join(', ')
        const RPalbum = items['0'].track.album.name
        const time = (formatDistanceToNow(new Date(items['0'].played_at), { addSuffix: true, includeSeconds: true }))
        return {
            subject: "Recently played " + time,
            status: RPartist + " | " + RPalbum + " | " + RPtrack,
            color: "d92323",
        };
    } else { return { subject: "Response " + resp.status, status: resp.statusText, labelColor: "grey" } }
}
export default handleSpotify