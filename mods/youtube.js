// http://127.0.0.1:8787/youtube/video/WYCpibS2xM0
// https://dev-badge.xxx.workers.dev/youtube/video/WYCpibS2xM0
// http://127.0.0.1:8787/youtube/channel/UCWLCN-t9KAkbw3lwiNWLogg

async function handleYoutube({ topic, id }) {

    const api = {
        'video': `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${YOUTUBE_KEY}&part=snippet,statistics`,
        'channel': `https://youtube.googleapis.com/youtube/v3/channels?id=${id}&key=${YOUTUBE_KEY}&part=snippet,statistics`,
    };
    const endpoint = api[topic]


    const resp = await fetch(endpoint, {
        method: "GET"
    });


    if (resp.status === 200) {
        const json = await resp.json();
        const viewCount = json.items['0'].statistics.viewCount
        const likeCount = json.items['0'].statistics.likeCount
        const subscriberCount = json.items['0'].statistics.subscriberCount
        const videoCount = json.items['0'].statistics.videoCount
        const title = json.items['0'].snippet.title
        const topicMap = {
            video: ["👀: " + viewCount + "  👍🏻: " + likeCount, title],
            channel: ["👀: " + viewCount + "  subscriber: " + subscriberCount, title +  " : " + videoCount]
        };
        const _statusMap = topicMap[topic];

        switch (topic) {
            case topic:

                return {
                    subject: _statusMap ? _statusMap[1] : resp.status,
                    status: _statusMap ? _statusMap[0] : resp.statusText,
                    color: "282828",
                    labelColor: "FF0000"
                };
        }
    } else { return { subject: "Response " + resp.status, status: resp.statusText, labelColor: "grey" } }
}
export default handleYoutube