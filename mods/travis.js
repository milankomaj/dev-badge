
const statuses = [
  ["passed", "green"],
  ["passing", "green"],
  ["failed", "red"],
  ["failing", "red"],
  ["error", "red"],
  ["errored", "red"],
  ["pending", "yellow"],
  ["fixed", "yellow"],
  ["broken", "red"],
  ["canceled", "grey"],
];

async function handleTravisCI({ user, repo, branch = "master" }, options) {


  const org = await fetch(`https://app.travis-ci.com/${user}/${repo}.svg?branch=${branch}`);


  const svgOrg  = await org.text()
  console.log("👉 svgOrg:",svgOrg)

  const result = statuses.find(([status]) => {
    return (
      (svgOrg && svgOrg.includes(status))
    );
  });

  if (result) {
    return {
      subject: "travis",
      status: result[0],
      color: result[1],
    };
  } else {
    return {
      subject: "travis",
      status: "unknown",
      color: "grey",
    };
  }
}

export default handleTravisCI;
