import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { DateTime } from "luxon";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // custom filters:
  eleventyConfig.addFilter("humanReadableDate", function (date) {
    // Luxon date docs: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    return DateTime.fromJSDate(date, { zone: "utc" }).toLocaleString(
      DateTime.DATE_FULL,
    );
  });

  eleventyConfig.addFilter("machineReadableDate", function (date) {
    // I believe an ISO time is sufficient for datetimes: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time#attributes
    return date.toISOString();
  });

  // image support
  eleventyConfig.addPlugin(eleventyImageTransformPlugin);

  // Pass through file copy for css dependencies
  eleventyConfig.addPassthroughCopy("node_modules/papercss/dist/paper.min.css");
  eleventyConfig.addPassthroughCopy(".nojekyll");

  return {
    // Look here: https://www.11ty.dev/docs/config/ for explanation of config options
    markdownTemplateEngine: "njk",

    htmlTemplateEngine: "njk",

    dir: {
      input: "content" /* default: "." -> search in `./content` now. */,
      output:
        "public" /* defaults to "./_site" -> added for gitlab pages support */,
      includes:
        "../layouts" /* default: "./_includes" -> keep all njk html templates in their own folder */,
      data: "../_data" /* Relative to input, and want this on top level https://www.11ty.dev/docs/config/#directory-for-global-data-files */,
    },

    pathPrefix: "/",
  };
}
