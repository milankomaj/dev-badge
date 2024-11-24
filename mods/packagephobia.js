
async function handlePackagephobia(params) {
  const { topic, scope } = params;
  let { pkgName } = params;
  if (scope && pkgName) {
    pkgName = `${scope}/${pkgName}`;
  }

  // console.log("👉 params.scope:", (params.scope))
  // console.log("👉 params.pkgName:", (params.pkgName))
  // console.log("👉 decodeURIComponent(pkgName):", encodeURIComponent(pkgName))
  const endpoint = `https://packagephobia.com/v2/api.json?p=${encodeURIComponent(pkgName)}`;
  // console.log("👉 endpoint:", endpoint)

  const resp = await fetch(endpoint);

  if (resp.status === 200) {
    const { install, publish } = await resp.json();
    switch (topic) {
      case 'publish':
        return {
          subject: 'publish size/files',
          status: publish.pretty + "/" + publish.files,
          color: publish.color.replace('#', ''),
        };
      case 'install':
        return {
          subject: 'install size/files',
          status: install.pretty + "/" + install.files,
          color: install.color.replace('#', ''),
        };
      default:
        return {
          subject: topic,
          status: "unknown",
          color: "grey",
        };
    }
  } else { return { subject: "Response " + resp.status, status: resp.statusText, labelColor: "grey" } }
}

export default handlePackagephobia;

