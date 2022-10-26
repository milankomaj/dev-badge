// http://localhost:8787/metrics/errors/dev-badge/1
import { subDays, format, differenceInHours } from 'date-fns'

async function handelMetrics({ topic, script, subtract }) {
  const now = new Date(Date.now())
  const endTime = format(now, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
  console.log("👉 now:", now)
  console.log("👉 endTime:", endTime)
  const startTime = format(now, "yyyy-MM-dd") + "T00:00:00.000Z"
  console.log("👉 startTime:", startTime)
  const days = subDays(new Date(endTime), subtract)
  console.log("👉 days:", days)
  const hours = differenceInHours(now, days)
  //console.log("👉 parseISO(endTime):", parseISO(endTime))
  console.log("👉 days.toISOString():", days.toISOString())
  console.log("👉 hours:", hours)

  const PAYLOAD = {
    "query":
      `query GetWorkersAnalytics($accountTag: string, $datetimeStart: string, $datetimeEnd: string, $scriptName: string) {
        viewer {
          accounts(filter: {accountTag: $accountTag}) {
            workersInvocationsAdaptive(limit: 10000, filter: {
              scriptName: $scriptName,
              datetime_geq: $datetimeStart,
              datetime_leq: $datetimeEnd
            }) {
              sum {
                subrequests
                requests
                errors
              }
              quantiles {
                cpuTimeP50
                cpuTimeP75
                cpuTimeP99
                cpuTimeP999
                durationP50
                durationP75
                durationP99
                durationP999
              }
              dimensions{
                datetime
                scriptName
                status
              }
            }
          }
        }
      }`,
    "variables": {
      "accountTag": `${CLOUDFLARE_ACCOUNT_ID}`,
      "datetimeStart": days,
      "datetimeEnd": endTime,
      "scriptName": script
    }
  }
  const endpoint = 'https://api.cloudflare.com/client/v4/graphql/'
  const resp = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify(PAYLOAD),
    cf: {
      cacheTtl: 604800,
      cacheEverything: true,
    },
    headers: {
      "content-type": "application/json",
      "Cache-Control": "max-age=604800",
      "X-Auth-Email": `${CLOUDFLARE_EMAIL}`,
      "X-Auth-key": `${CLOUDFLARE_API_TOKEN}`
    }
  });


  if (resp.status === 200) {
    const json = await resp.json()
    console.log("👉 Response:", resp.statusText)
    const format = Object.values(json.data.viewer["accounts"][0])
    // console.log("👉 (format):", (format))
    const qveryMap = {
      requests: ['sum'],
      subrequests: ['sum'],
      errors: ['sum'],
      status: ['dimensions'],
      cpuTimeP50: ['quantiles'],
      cpuTimeP75: ['quantiles'],
      cpuTimeP99: ['quantiles'],
      cpuTimeP999: ['quantiles'],
      durationP50: ['quantiles'],
      durationP75: ['quantiles'],
      durationP99: ['quantiles'],
      durationP999: ['quantiles']
    };
    const qvery = String(qveryMap[topic]);

    const summary = (format[0].map(req => req[qvery][topic]))
    console.log("👉 summary:", summary)
    const sumSum = Number(summary.reduce((a, b) => a + b, 0))
    console.log("👉 sumSum:", sumSum)

    console.log("👉 summary.length:", summary.length)

    switch (topic) {
      case "requests":
      case "subrequests":
      case "errors":
        return {
          subject: String(topic).toUpperCase() + " " + script,
          status: sumSum + " in last " + subtract + " day's (" + hours + " hour's)",
          color: "blue",
        };

      case "cpuTimeP50":
      case "cpuTimeP75":
      case "cpuTimeP99":
      case "cpuTimeP999":
      case "durationP50":
      case "durationP75":
      case "durationP99":
      case "durationP999":
        const avarge = (sumSum / summary.length) || 0;
        console.log("👉 avarge:", avarge)
        return {
          subject: topic + " ⍉ " + script,
          status: Number(avarge).toFixed(3) + " in last " + subtract + " day's (" + hours + " hour's)",
          color: "blue",
        };

      case "status":
        const summary_success = (Object.values(summary).filter(element => element == "success").length)
        const summary_clientDisconnected = (Object.values(summary).filter(element => element == "clientDisconnected").length)
        const summary_scriptThrewException = (Object.values(summary).filter(element => element == "scriptThrewException").length)
        const summary_exceededResources = (Object.values(summary).filter(element => element == "exceededResources").length)
        const summary_internalError = (Object.values(summary).filter(element => element == "internalError").length)
        console.log("👉 summary_success:", summary_success)
        console.log("👉 summary_clientDisconnected:", summary_clientDisconnected)
        console.log("👉 summary_scriptThrewException:", summary_scriptThrewException)
        console.log("👉 summary_exceededResources:", summary_exceededResources)
        console.log("👉 summary_internalError:", summary_internalError)
        return {
          subject: script + " | Success:" + summary_success,
          status: " Disconnected:" + summary_clientDisconnected + " | Exception:" + summary_scriptThrewException + " | ExceededResources:" + summary_exceededResources + " | InternalError:" + summary_internalError,
          color: "red",
          labelColor: "green",
        };
    }
  } else { return { subject: "Response " + resp.status, status: resp.statusText, labelColor: "grey" } }
}
export default handelMetrics