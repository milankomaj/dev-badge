import {
  formatDistanceToNow
} from 'date-fns';
import {
  differenceInSeconds
} from 'date-fns';

async function handleMozilla({
  topic,
  domain
}) {
  const endpoint = `https://http-observatory.security.mozilla.org/api/v1/analyze?host=${domain}`
  const resp = await fetch(endpoint, {
    method: "GET"
  });

  //const cl = resp.headers.get('Content-Length');
  //console.log("👉 log:", cl)
  if (resp.status === 200) {
    const {
      grade,
      score,
      end_time,
      start_time,
      likelihood_indicator,
      error
    } = await resp.json();

    const er = error;
    // console.log("👉 log:",er,resp.status)
    if (er != "recent-scan-not-found") {

      const letter = grade[0].toLowerCase();
      const risk = likelihood_indicator;
      const riskMap = {
        MAXIMUM: ['MAXIMUM Risk', 'd04437'],
        HIGH: ['HIGH Risk', 'ffd351'],
        MEDIUM: ['MEDIUM Risk', '4a6785'],
        LOW: ['LOW Risk', '555555'],
        UNKNOWN: ['UNKNOWN Risk', 'grey']
      };
      const _riskColor = riskMap[risk];

      const end = end_time;
      const start = start_time;
      //const startfn = (formatDistanceToNow(new Date(start), {addSuffix: true})); // date-fns
      const endfn = (formatDistanceToNow(new Date(end), { addSuffix: true })); // date-fns
      const dif = differenceInSeconds(new Date(end), new Date(start)); // date-fns   
      //console.log("👉:", "cl=", cl, "letter=", letter, "end=", end, "start=", start, "startfn=", startfn, "endfn=", endfn, "dif=", dif, ":👈")
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
            status: grade,
            color: colorMap[letter]
          };
        case 'score':
          const Sscore = Object.keys(score.toString()).length
          //console.log("👉 score.length :", Sscore)
          return {
            subject: 'Score',
            status: score.toString() + " points",
            color: scoreMap[Sscore]
          };
        case 'checked':
          return {
            subject: _riskColor ? _riskColor[0] : 'checked',
            status: endfn.toString() + ' (' + dif.toString() + ' s)',
            color: 'blue',
            labelColor: _riskColor ? _riskColor[1] : 'grey'
          };
      }
    } else {
      const endpointPost = `https://http-observatory.security.mozilla.org/api/v1/analyze?host=${domain}&rescan=true`
      const respPost = await fetch(endpointPost, {
        method: "POST"
      });
      const {
        state
      } = await respPost.json();
      const states = state;
      const statesMap = {
        ABORTED: ['ABORTED', 'red'],
        FINISHED: ['FINISHED', 'green'],
        FAILED: ['FAILED', 'red'],
        PENDING: ['PENDING', 'yellow'],
        STARTING: ['STARTING', 'green'],
        RUNNING: ['RUNNING', 'orange']
      };
      const _stateColor = statesMap[states];

      return {
        subject: 'SecurityMozilla',
        status: _stateColor ? _stateColor[0] : "⏲",
        color: _stateColor ? _stateColor[1] : 'blue'
      };
    }
  } else { return { subject: "Response", status: resp.statusText, labelColor: "grey" } }
}


export default handleMozilla