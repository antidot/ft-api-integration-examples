FTAPI = await new window.fluidtopics.FluidTopicsApi();
body = {
  startDate: "2024-01-01",
  endDate: "2024-02-01",
  paging: {
    page: 1,
    perPage: 50,
  },
  contentLocale: "en-US",
};

terms_top = await FTAPI.post(`/analytics/api/v2/searches/terms-top`, body);
const parsed_terms_top = JSON.parse(terms_top);
const filtered_terms_top = parsed_terms_top.results;

// Dynamically load D3.js library
function loadScript(url, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  
  script.onload = function () {
    callback();
  };
  
  script.src = url;
  document.getElementById("wordcloud").appendChild(script);
}

// Define your word cloud script
function initWordCloud() {
  const weightedWords = filtered_terms_top.map((term) => ({
    text: term.terms,
    size: term.queryCount,
  }));

  d3.layout
    .cloud()
    .size([800, 400])
    .words(weightedWords)
    .padding(10) // Adjust the padding here
    .rotate(0)
    .fontSize(function (d) {
      return d.size;
    })
    .on("end", draw)
    .start();

  function draw(words) {
    let select = document.getElementById("wordcloud");
    d3.select(select)
      .append("svg")
      .attr("width", 800)
      .attr("height", 400)
      .append("g")
      .attr("transform", "translate(400,200)")
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .style("font-size", function (d) {
        return d.size + "px";
      })
      .style("font-family", "Arial")
      .attr("text-anchor", "middle")
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")rotate(" + d.rotate + ")";
      })
      .text(function (d) {
        return d.text;
      });
  }
}

// Load D3.js and then initialize word cloud
loadScript("https://d3js.org/d3.v6.min.js", function () {
  loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/d3-cloud/1.2.7/d3.layout.cloud.min.js",
    initWordCloud
  );
});
