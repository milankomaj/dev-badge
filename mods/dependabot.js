//http://127.0.0.1:8787/dependabot/milankomaj/data-livewallpaper/master?icon=dependabot&style=flat&scale=1.5
async function handleDependabot({
  owner,
  repo,
  branch
}) {
  const endpoint = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/.github/dependabot.yml`
  const resp = await fetch(endpoint, {
    method: "HEAD",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
  // console.log("👉 status:", resp.status.toString() + ' (' + resp.statusText.toString() + ')')
  if (resp.status === 200) {
    const status = resp.status.toString()
    return {
      subject: 'dependabot ✔️',
      status: status + ' (' + resp.statusText.toString() + ')',
      color: 'green',
    };
  } else {
    return {
      subject: "dependabot ❌",
      status: resp.status.toString() + ' (' + resp.statusText.toString() + ')',
      color: "grey"
    };
  }

}

export default handleDependabot;
