async function handelUptime({
  topic,
  apikey,
  period
}, options) {

  const endpoint = `https://api.uptimerobot.com/v2/getMonitors`
  const resp = await fetch(endpoint, {
    method: "post",
    cf: {
      cacheTtl: 300,
      cacheEverything: true,
    },
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "Cache-Control": "max-age=300"
    },
    body: `api_key=${apikey}&response_times=1&response_times_limit=12&logs=0&custom_uptime_ratios=${period}&format=json`
  });
  if (resp.status === 200) {
    const {
      stat,
      monitors
    } = await resp.json();
    const ss = monitors[0].status.toString();
    const statuses = {
      0: ['paused', 'yellow'],
      1: ['not checked yet', 'grey'],
      2: ['up', 'green'],
      8: ['seems down', 'orange'],
      9: ['down', 'red']
    };
    const _stat = statuses[ss];

    const type = monitors[0].type.toString();
    const colorType = {
      1: ['HTTP(s)', 'blue'],
      2: ['Keyword', 'black'],
      3: ['Ping', 'green'],
      4: ['Port', 'yellow'],
      5: ['Heartbeat', 'red']
    };
    const _type = colorType[type];

    const colorStat = { ok: 'green', fail: 'red' };
    const cur = monitors[0].custom_uptime_ratio.toString();
    const curCM = ((cur).replace(/.[0-9]+$/, ''));
    const colorMap = {
      "100": ['green'],
      "99": ['9C1'],
      "98": ['EA2'],
      "97": ['orange']
    };
    const _color = colorMap[curCM];
    const art = monitors[0].average_response_time.toString();
    const fn = monitors[0].friendly_name.toString();
    const cdd = (monitors[0].custom_down_durations.toString() / 1000);
    const interval = (monitors[0].interval.toString() / 60);
    // console.log("👉:","stat=",stat,"cur=",cur,"curCM=",curCM,"art=",art,"fn=",fn,"cdd=",cdd,"period=",period,"interval=",interval,":👈")
    switch (topic) {
      case 'stat':
        return {
          subject: _type ? _type[0] + " ➧ " + fn + " ➧ interval:" + interval + " min" : 'unknown',
          status: stat,
          color: colorStat[stat],
          labelColor: _type ? _type[1] : 'grey'
        }
      case 'status':
        return {
          subject: fn + ' is',
          status: _stat ? _stat[0] : 'unknown',
          color: _stat ? _stat[1] : 'grey'
        }
      case 'period':
        return {
          subject: 'uptime/' + period + ' day(s)',
          status: Number(cur).toFixed(3).replace(/.[0]+$/, '') + ' %',
          color: _color ? _color[0] : 'red'
        }
      case 'response':
        return {
          subject: 'response',
          status: Number(art).toFixed(2) + ' ms',
          color: 'blue'
        }
      case 'down':
        return {
          subject: 'down during ' + period + ' day(s)',
          status: Number(cdd).toFixed(2) + ' s',
          color: 'blue'
        }
    }

  } else {
    return {
      subject: "uptimerobot",
      status: resp.status.toString() + ' (' + resp.statusText.toString() + ')',
      color: "grey"
    };
  }
}
export default handelUptime