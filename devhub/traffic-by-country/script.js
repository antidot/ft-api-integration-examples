// Function to get today's date in ISO format
function getCurrentDate() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

// Function to fetch top countries' traffic data from Fluid Topics API
async function fetchTopCountriesTrafficData(startDate, endDate) {
  const apiUrl = "/analytics/api/v3/traffic/countries-top";
  const body = JSON.stringify({
    startDate: startDate,
    endDate: endDate,
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

    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Function to filter top countries based on minimum percentage
function filterTopCountriesByPercentage(data, minPercentage) {
  return data.results.filter((entry) => entry.percentage >= minPercentage);
}

// Function to create chart using Chart.js
function createChart(countryNames, visitCounts) {
  const ctx = document.getElementById("myChart");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: countryNames,
      datasets: [
        {
          label: "Percentage of visits",
          data: visitCounts,
          borderWidth: 3,
        },
      ],
    },
  });
}

async function main() {
  const today = getCurrentDate();
  const minPercentage = 0.2;

  const trafficData = await fetchTopCountriesTrafficData("2025-01-01", today);
  const filteredTrafficData = filterTopCountriesByPercentage(
    trafficData,
    minPercentage
  );

  const countryNames = filteredTrafficData.map((entry) => entry.countryName);
  const visitCounts = filteredTrafficData.map((entry) => entry.percentage);

  createChart(countryNames, visitCounts);
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
