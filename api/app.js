const express = require("express");
const client = require("cheerio-httpcli");
const app = express();

app.get("/getogp", (expressRequest, expressResponse, expressNext) => {
  const url = expressRequest.query.url;
  console.log("[INFO] Request for " + url);
  client.fetch(url, (err, $, res, body) => {
    if (err) {
      expressNext(err);
      return;
    }

    const result = {
      exists: false,
      title: "",
      description: "",
      url: "",
      image: "",
      site_name: "",
      type: "",
    };

    const ogTitleQuery = $("meta[property='og:title']");

    if (ogTitleQuery.length > 0) {
      const imageUrl =
        $("meta[property='og:image']").attr("content") === undefined
          ? "/images/noimg.webp"
          : $("meta[property='og:image']").attr("content");

      const siteName =
        $("meta[property='og:site_name']").attr("content") === undefined
          ? "No title"
          : $("meta[property='og:site_name']").attr("content");

      result.exists = true;
      result.title = $("meta[property='og:title']").attr("content");
      result.description = $("meta[property='og:description']").attr("content");
      result.url = $("meta[property='og:url']").attr("content");
      result.image = imageUrl;
      result.site_name = siteName;
      result.type = $("meta[property='og:type']").attr("content");
    } else {
      result.title = $("head title").text();
      result.description = $("meta[name='description']").attr("content");
    }

    expressResponse.json(result);
  });
});

app.listen(6060, () => console.log("Listening on port 6060"));
