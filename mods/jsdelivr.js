import millify from 'millify'

async function handelJsdelivr({
  topic,
  period,
  type,
  name
}, options) {
  const endpoint = `https://data.jsdelivr.com/v1/package/${type}/${name}/stats/${period}`
  const resp = await fetch(endpoint, {
    method: "get"
  });

  if (resp.status === 200 ) {
    const {
      total,
      rank
    } = await resp.json();


    //console.log("👉:",resp.status,rank,total,":👈")


    switch (topic) {

      case 'hits':
        return {
          subject: "jsDelivr " + topic,
            status: millify(total, {
              precision: 2,
              space: false,
              decimalSeparator: ',',
              lowercase: true
            }) + " /" + period,
            color: 'ff5627'
        };
      case 'rank':
        return {
          subject: "jsDelivr " + topic,
            status: rank + " /" + period,
            color: 'ff5627'
        }
    }

  }  else { return { subject: "Response " + resp.status, status: resp.statusText, labelColor: "grey" } }

}



export default handelJsdelivr