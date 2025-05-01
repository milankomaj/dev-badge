import millify from 'millify';
import stars from '../helpers/stars';
import byteSize from 'byte-size';
import { formatDistanceToNow } from 'date-fns';
import { version, versionColor } from "../helpers/version";

async function handleAmo({
  topic,
  pkgName
}) {

  const resp = await fetch(
    `https://addons.mozilla.org/api/v5/addons/addon/${pkgName}/`
  );


  if (resp.status === 200) {
    const {
      average_daily_users,
      weekly_downloads,
      current_version,
      ratings,
      authors,
      type,
      slug,
      last_updated,
      created,
      promoted

    } = await resp.json();

    switch (topic) {

      case "users":
        return {
          subject: topic,
          status: millify(average_daily_users, {
            precision: 2,
            space: 'true',
            lowercase: 'true',
            decimalSeparator: '.'
          }),
          color: 'blue',
        };
      case 'weekly_downloads':
        return {
          subject: topic,
          status: millify(weekly_downloads, {
            precision: 2,
            space: 'true',
            lowercase: 'true',
            decimalSeparator: '.'
          })
        };
      case 'add-on':
        return {
          subject: (type),
          status: (slug)
        };
      case 'license':
        return {
          subject: 'license',
          status: (current_version.license.name['en-US']),
          color: 'green'
        };
      case 'version':
        return {
          subject: 'mozilla add-on',
          status: version(current_version.version),
          color: versionColor(current_version.version)
        };
      case 'stars':
        return {
          subject: 'stars',
          status: stars(ratings.average)
        };
      case 'rating':
        return {
          subject: 'rating',
          status: `${Number(ratings.average).toFixed(1)}/5`
        };
      case 'reviews':
        return {
          subject: 'reviews',
          status: millify(ratings.count, {
            precision: 2,
            space: 'true',
            lowercase: 'true',
            decimalSeparator: '.'
          })
        };
      case 'author':
        return {
          subject: 'author',
          status: (authors['0'].name),
          color: 'purple'
        };
      case 'last_updated':
        const fn1 = (formatDistanceToNow(new Date(last_updated), {
          addSuffix: true
        })); // date-fns


        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: "numeric",
          minute: "numeric",
          timeZone: 'utc',
          timeZoneName: 'short'
        };

        //await badgeKV.delete("locate");
        //const loc = await badgeKV.get("locate")
        //console.log("loc👉:",loc,":👈")
        const dt = new Date(last_updated).toLocaleDateString('en' || 'en', options);
        //console.log("👉:",country,":👈")

        return {
          subject: 'updated',
          status: fn1 + ' (' + dt + ')',
          color: 'blue',
        };


      case 'since':

        const fn2 = (formatDistanceToNow(new Date(created), {
          addSuffix: true
        })) // date-fns

        return {
          subject: 'since',
          status: fn2,
          color: 'blue'
        };
      case 'size':
        return {
          subject: 'size',
          status: byteSize(current_version.file.size, {
            units: "iec",
            precision: "2"
          }).toString().replace(/iB\b/, "B"),
          color: 'blue'
        };
      case 'add-on-flag':
        if (promoted != null) {
          const apps = (promoted['0'].apps);
          const category = (promoted['0'].category);
          const categoryMap = {
            line: ['By Firefox', 'purple'],
            recommended: ['Recommended', 'ff9400'],
            spotlight: ['Spotlight', 'yellow'],
            notable: ['Notable', 'blue'],
            strategic: ['Strategic', 'green'],
            // badged: ['badged', 'orange'],
          }
          const _ccm = categoryMap[category];
          //console.log("👉 //:", promoted['0'],promoted['0'].apps)
          //https://mozilla.github.io/addons-server/topics/api/addons.html#addon-detail-promoted-category
          return {
            subject: (apps) + '',
            status: _ccm ? _ccm[0] : 'unknown',
            color: _ccm ? _ccm[1] : 'grey'
          };
        } else { return { subject: "flag", status: 'unknown', labelColor: "grey" } }

    }
  } else {
    return {
      subject: "amo",
      status: resp.status.toString() + ' (' + resp.statusText.toString() + ')',
      color: "grey",
    };
  }
}



export default handleAmo