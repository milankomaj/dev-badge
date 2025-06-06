import byteSize from "byte-size";


async function handleBundlephobia({ topic, pkgName }, options) {
  const resp = await fetch(
    `https://bundlephobia.com/api/size?package=${pkgName}@latest&record=true`
  );
  if (resp.status === 200) {
    const {
      size,
      gzip,
      dependencyCount,
      hasJSModule,
      hasJSNext,
    } = await resp.json();
    switch (topic) {
      case "min":
        return {
          subject: topic,
          status: byteSize(size, { units: "iec" })
            .toString()
            .replace(/iB\b/, "B"),
        };
      case "minzip":
        return {
          subject: topic,
          status: byteSize(gzip, { units: "iec" })
            .toString()
            .replace(/iB\b/, "B"),
          color: "blue",
        };
      case "dependency-count":
        return {
          subject: topic,
          status: dependencyCount.toString(),
          color: "blue",
        };
      case "tree-shaking":
        const isTreeShakeable = hasJSModule || hasJSNext;
        return {
          subject: topic,
          status: isTreeShakeable ? "supported" : "not supported",
          color: isTreeShakeable ? "green" : "red",
        };
    }
  } else { return { subject: "Response " + resp.status, status: resp.statusText, labelColor: "grey" } }
}

export default handleBundlephobia;
