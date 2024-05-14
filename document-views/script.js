// Function to get today's date in ISO format
function getCurrentDate() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

// Function to fetch top document views data from Fluid Topics API
async function fetchTopDocumentsData(startDate, today) {
  const apiUrl = "/analytics/api/v2/documents/views-top";
  const body = JSON.stringify({
    startDate: startDate,
    endDate: today,
    paging: {
      page: 1,
      perPage: 10,
    },
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

    const terms_top = await response.json();
    return terms_top.results;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Function to create chart using Chart.js
function createChart(documentNames, visitCounts) {
  const ctx = document.getElementById("myChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: documentNames,
      datasets: [
        {
          label: "Number of visits",
          data: visitCounts,
          borderWidth: 3,
        },
      ],
    },
  });
}

async function main() {
  const today = getCurrentDate();

  const terms_top = await fetchTopDocumentsData("2024-01-01", today);

  if (terms_top) {
    const documentNames = terms_top.map((entry) => entry.title);
    const visitCounts = terms_top.map((entry) => entry.displayCount);
    createChart(documentNames, visitCounts);
  }
}

// Function to create and append the Chart.js script element
function createChartScriptElement() {
  const chartScript = document.createElement("script");
  chartScript.src = "https://cdn.jsdelivr.net/npm/chart.js";
  chartScript.onload = main;
  document.querySelector(".container").appendChild(chartScript);
}

// Execute createChartScriptElement function to load Chart.js script
createChartScriptElement();
