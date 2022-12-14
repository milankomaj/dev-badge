// http://localhost:8787/calendar/today
// http://localhost:8787/calendar/12-oktober
async function handleCalendar({ topic }) {
    const endpoint = 'https://raw.githubusercontent.com/milankomaj/data/main/namedays/names_days_min.json'
    const resp = await fetch(endpoint, {
        method: "GET",
        cf: {
            cacheTtl: 7200,
            cacheEverything: true,
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "max-age=86401"
        }
    });
    const json = await resp.json()
    console.log("π resp:", resp.statusText, resp.status)
    try {
        switch (topic) {
            case "today":
                const mm = new Date().toLocaleDateString('sk' || 'sk', { month: 'long' }).replace("Γ‘", "a").replace("ΓΊ", "u").replace("Γ­", "i").replace("Γ³", "o");
                const dd = new Date().toLocaleDateString('sk' || 'sk', { day: 'numeric' }).replace(".", "-");
                const DM = dd + mm
                const on2 = json.month[mm][DM].h3
                const o2 = on2.map(h3_values2 => h3_values2).join(', ')
                //console.log("π date_today:", dd, mm, "DM:", DM)
                //console.log("π on2:", on2)
                console.log("π o2:", o2)
                return {
                    subject: DM,
                    status: o2,
                    color: 'green',
                };
            case (topic):
                const th = (`${topic}`).split("-")[1]
                const on = json.month[th][`${topic}`].h3
                const o = on.map(h3_values => h3_values).join(', ')
                //console.log("π date_topic:", `${topic}`)
                //console.log("π on:", on)
                console.log("π o:", o)
                return {
                    subject: `${topic}`,
                    status: o,
                    color: 'green',
                };
        }
    } catch (e) { console.log("π e.message:", e.message); return { subject: "Response " + resp.status, status: resp.statusText, labelColor: "grey" } }
}
export default handleCalendar;