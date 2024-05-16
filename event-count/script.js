let chart;

// Function to fetch event count data from Fluid Topics API
async function fetchEventCountData(startDate, eventType) {
  const apiUrl = "/analytics/api/v1/traffic/event-counts";

  const body = JSON.stringify({
    startDate: startDate,
    endDate: "2024-05-01",
    groupByPeriod: "month",
    filters: {
      name: [eventType],
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

    // Check if results array is empty or not
    if (terms_top.results && terms_top.results.length > 0) {
      return terms_top.results[0].periods;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Function to create or update the chart using Chart.js
function createOrUpdateChart(periodStartDates, eventCount, eventType) {
  const ctx = document.getElementById("myChart");

  if (periodStartDates.length === 0 || eventCount.length === 0) {
    showNoDataMessage();
    return;
  }

  // Hide the "No data available" message and show the chart canvas
  const messageElement = document.getElementById("noDataMessage");
  messageElement.style.display = "none";
  document.querySelector(".container").style.display = "block";

  if (chart) {
    // Update the existing chart
    chart.data.labels = periodStartDates;
    chart.data.datasets[0].data = eventCount;
    chart.data.datasets[0].label = `Number of ${eventType} events over time`;
    chart.update();
  } else {
    // Create a new chart
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: periodStartDates,
        datasets: [
          {
            label: `Number of ${eventType} events over time`,
            data: eventCount,
          },
        ],
      },
    });
  }
}

// Function to display a "No data available" message
function showNoDataMessage() {
  const messageElement = document.getElementById("noDataMessage");
  messageElement.style.display = "block";
  document.querySelector(".container").style.display = "none";
}

// Function to process data and display it on the chart or show no data message
function processAndDisplayData(data, eventType) {
  if (data && data.length > 0) {
    const periodStartDates = data.map((entry) => entry.periodStartDate);
    const eventCount = data.map((entry) => entry.eventCount);
    createOrUpdateChart(periodStartDates, eventCount, eventType);
  } else {
    showNoDataMessage();
  }
}

// Event listener for the dropdown to fetch data on selection change
document.getElementById("event-type-dropdown").addEventListener("change", () => {
    const startDate = "2023-04-01";
    const eventType = document.getElementById("event-type-dropdown").value;

    fetchEventCountData(startDate, eventType)
      .then((data) => processAndDisplayData(data, eventType))
      .catch((error) => {
        console.error("Error fetching data:", error);
        showNoDataMessage();
      });
  });

async function main() {
  const startDate = "2023-04-01";
  const eventType = document.getElementById("event-type-dropdown").value;

  const terms_top = await fetchEventCountData(startDate, eventType);
  processAndDisplayData(terms_top, eventType);
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
