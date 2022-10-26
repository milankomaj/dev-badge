
import {badgen} from "badgen";
import icons from "dev-badge-icon";

function serveBadge(params, options) {
  Object.keys(options).forEach((key) => {
    switch (key) {
      case "list":
        params.status = params.status.replaceAll(
          ",",
          ` ${options.list || "|"} `
        );
        break;
      case "icon":
        const icon = icons[options.icon || params.subject];
        if (icon) {
          options.icon = icon.base64;
          options.iconWidth = parseInt(icon.width || 13);
          // console.log("👉 iconWidth:", options.iconWidth)
        } else {
          delete options.icon;
        }
        break;
      case "label":
        options.label = decodeURIComponent(options.label);
      default:
        if (!options[key]) delete options[key];
        break;
    }
  });

  return badgen({
    ...params,
    ...options
  });
}

export default serveBadge;