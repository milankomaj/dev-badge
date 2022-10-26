
async function handleSecurityheaders({
    topic,
    domain
}) {
    const endpoint = `https://securityheaders.com/?followRedirects=on&hide=on&q=${domain}/`
    const resp = await fetch(endpoint, {
        method: "HEAD",
        cf: {
            cacheTtl: 86402,
            cacheEverything: true,
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "max-age=86401"
        }
    });

    if (resp.status === 200) {
        const grades = resp.headers.get('x-grade')
        const letter = grades[0].toLowerCase()
        const colorMap = {
            a: '34af00',
            b: '2b9100',
            c: 'ffd242',
            d: 'e57322',
            e: 'fa508',
            f: 'db1e1e',
        }

        switch (topic) {


            case topic:
                return {
                    subject: 'SecurityHeaders',
                    status: [`${grades}`].toString(),
                    color: colorMap[letter],
                };


        }
    }

}


export default handleSecurityheaders