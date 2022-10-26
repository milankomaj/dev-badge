// http://localhost:8787/actions/milankomaj/ps1/video
// http://localhost:8787/actions/milankomaj/ps1/video/main/schedule
// http://localhost:8787/actions/milankomaj/ps1/video/main/
// http://localhost:8787/actions/milankomaj/ps1/video/schedule
const statuses = [
 ["passing", "green"],
 ["failing", "red"],
 ["no status", "grey"],
];

async function handleActions({ user, repo, workflow, branch = String(), event = String() }) {
  const resp = await fetch(`https://github.com/${user}/${repo}/actions/workflows/${workflow}.yml/badge.svg?branch=${branch}&event=${event}`);
  const SvgText = await resp.text()
  //console.log("👉 SvgText:", SvgText)
  console.log("👉 resp:", resp.statusText, resp.status)

  const result = statuses.find(([status]) => {
    return (
      (SvgText.includes(status))
    );
  });

  if (resp.status === 200 || result) {

    const regex = SvgText.split("<title>")[1].split("<")[0].split(" - ")
    const result3 = regex[1].trim().toString().toLowerCase()
    const result2 = regex[0].trim().toString().toLowerCase()
    /**
    const regex_re = new RegExp(result3, 'g')
    const matchText = SvgText.match(regex_re).length
    console.log("👉 regex_re:", regex_re)
    console.log("👉 matchText:", new Boolean(matchText).toString(),(matchText).toString())
    console.log("👉 regex:", regex)
    console.log("👉 result:", result)
    console.log("👉 regex_result2:", result2)
    console.log("👉 regex_result3:", result3)
    console.log("👉 ?map:",(branch ? branch : "") , (event ? event : ""))
   */
    return {
      subject: regex ? result2 : "workflow",
      status: (result ? result[0] : result3).toUpperCase(),
      color: result ? result[1] : "blue",
    };
  } else { return { subject: "Response " + resp.status, status: resp.statusText, labelColor: "grey" } }
}
export default handleActions;
