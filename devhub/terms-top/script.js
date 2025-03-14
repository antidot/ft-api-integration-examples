// Function to get today's date in ISO format
function getCurrentDate() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

// Division factor for adjusting word size
const DIVISION_FACTOR = 8;

// Function to fetch top search terms data from Fluid Topics API
async function fetchTopSearchTerms(endDate) {
  const apiUrl = "/analytics/api/v2/searches/terms-top";
  const body = JSON.stringify({
    startDate: "2024-12-01",
    endDate: endDate,
    paging: {
      page: 1,
      perPage: 50,
    },
    contentLocale: "en-US",
  });

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    if (!response.ok) {
      throw new Error("Network response was not OK.");
    }

    const parsedResponse = await response.json();
    return parsedResponse.results;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Define your word cloud script
function initWordCloud(filtered_terms_top) {
  const weightedWords = filtered_terms_top.map((term) => ({
    text: term.terms,
    size: term.queryCount / DIVISION_FACTOR,
  }));

  d3.layout
    .cloud()
    .size([900, 400])
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
      .style("width", 900)
      .style("height", 400)
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
      .html(function (d) {
        return `<a href="/search?query=${d.text}&filters=Version_FT~%2522Latest%2522&content-lang=en-US">${d.text}</a>`; // Wrap each word with a link
      });
  }
}

// Load D3.js and then initialize word cloud
function loadScript(url, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";

  script.onload = function () {
    callback();
  };

  script.src = url;
  document.getElementById("wordcloud").appendChild(script);
}

// Function to fetch data and initialize word cloud
async function fetchDataAndInitializeWordCloud() {
  const endDate = getCurrentDate();
  const filtered_terms_top = await fetchTopSearchTerms(endDate);

  // Load D3.js and then initialize word cloud
  loadScript("https://d3js.org/d3.v6.min.js", function () {
    loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/d3-cloud/1.2.7/d3.layout.cloud.min.js",
      function () {
        initWordCloud(filtered_terms_top);
      }
    );
  });
}

// Call the function to fetch data and initialize word cloud
fetchDataAndInitializeWordCloud();
