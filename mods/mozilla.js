// http://localhost:8787/mozilla/checked/milankomaj-934e3.firebaseapp.com        // GET
// http://localhost:8787/mozilla/checked/milankomaj-934e3.firebaseapp.com/POST   // GET or POST(rescan)

import {
  formatDistanceToNow
} from 'date-fns';
import {
  differenceInSeconds
} from 'date-fns';

async function handleMozilla({
  topic,
  domain,
  method
}) {

  //console.log("👉 handleMozilla:", topic, domain, method)
  //const random = Math.random() > 0.1 ? ("GET") : ("POST");
  //console.log("👉 random:", random)

  const endpoint = `https://observatory-api.mdn.mozilla.net/api/v2/analyze?host=${domain}`
  const resp = await fetch(endpoint, {
    method: method ? method : "GET"
  });

  //console.log("👉 resp.status:", resp.status)
  //console.log("👉 endpoint.hostname:", new URL(endpoint).hostname)
  //console.log("👉 endpoint.search:", new URL(endpoint).search)
  //const cl = resp.headers.get('Content-Length');
  //console.log("👉 log:", cl)

  const {
    scan,
    history,
    tests,
    statusCode,
    error,
    message
  } = await resp.json();

  //console.log("👉 history", new Date(history[0].scanned_at).toUTCString())
  //console.log("👉 log:", scan.grade, scan.score, scan.scanned_at, scan.status_code, scan.tests_failed, scan.tests_passed, scan.tests_quantity, scan.error)
  //console.log("👉 statusCode:", statusCode ? statusCode : scan.status_code)

  if (!statusCode) {
    // console.log("👉 scan.json", scan.json)

    const letter = scan.grade[0].toLowerCase();
    const end = new Date(Date.now()).toJSON();
    const start = scan.scanned_at;

    const startfn = (formatDistanceToNow(new Date(start), { addSuffix: true })); // date-fns
    // const endfn = (formatDistanceToNow(new Date(end), { addSuffix: true })); // date-fns
    const dif = differenceInSeconds(new Date(end), new Date(start)); // date-fns
    //console.log("👉:", "cl=", cl, "letter=", letter, "end=", end, "start=", start, "endfn=", endfn, "dif=", dif, ":👈")
    const colorMap = {
      a: '34af00',
      b: 'green',
      c: 'ffd242',
      d: 'e57322',
      e: 'fa508',
      f: 'db1e1e',
    }
    const scoreMap = {
      3: '34af00',
      2: 'orange',
      1: 'red',
    }

    switch (topic) {
      case 'grade':
        return {
          subject: 'SecurityMozilla',
          status: scan.grade,
          color: colorMap[letter]
        };
      case 'score':
        const Sscore = Object.keys(scan.score.toString()).length
        //console.log("👉 score.length :", Sscore)
        return {
          subject: 'Score',
          status: scan.score.toString() + " points",
          color: scoreMap[Sscore]
        };
      case 'checked':
        return {
          subject: 'checked',
          status: startfn.toString() + ' (' + dif.toString() + ' s)',
          color: 'blue',
          labelColor: 'grey'
        };
      default:
        return {
          subject: topic,
          status: resp.statusText + " - " + resp.status,
          color: "grey",
        };
    }
  } else { return { subject: error ? error : resp.status, status: message ? message : resp.statusText, labelColor: "grey" } }

}



export default handleMozilla