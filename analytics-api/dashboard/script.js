const FLUID_TOPICS_PORTAL = "https://fluid-topics-portal-url"
const MOST_VIEWED_DOCS_API_URL = FLUID_TOPICS_PORTAL + '/analytics/api/v2/documents/views-top';
const USER_TRAFFIC_API_URL = FLUID_TOPICS_PORTAL + '/analytics/api/v1/traffic/user-activity';
const API_CALLS_API_URL = FLUID_TOPICS_PORTAL + '/analytics/api/v2/traffic/api-calls';
const TOP_BROWSERS_API_URL = FLUID_TOPICS_PORTAL + '/analytics/api/v3/traffic/browsers-top';
const TOP_FACETS_API_URL = FLUID_TOPICS_PORTAL + '/analytics/api/v2/searches/facets-heatmap';
const TOP_SEARCH_TERMS_API_URL = FLUID_TOPICS_PORTAL + '/analytics/api/v2/searches/terms-top';

const API_KEY = "AnalyticsApiKey"

const API_HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + API_KEY,
  'Ft-Calling-App': 'FT302-training'
};

// Fetch Data

async function fetchMostViewedDocuments() {
  const payload = {
    "startDate": "2024-12-01",
    "endDate": "2025-03-01",
    "paging": {
      "page": 1,
      "perPage": 50
    },
    "sortOrder": "TopFirst",
    "filters": {
      "titleContains": "guide",
      "metadata": []
    }
  };

  try {
    const response = await fetch(MOST_VIEWED_DOCS_API_URL, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Re-throw to be caught by the render function
  }
}

async function fetchUserTrafficData() {
  const payload = {
    "startDate": "2024-02-01",
    "endDate": "2025-04-01",
    "groupByPeriod": "month"
  };

  try {
    const response = await fetch(USER_TRAFFIC_API_URL, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user traffic data:', error);
    throw error;
  }
}

async function fetchApiCallsData() {
  const payload = {
    "startDate": "2024-02-01",
    "endDate": "2025-04-01",
    "groupByPeriod": "month",
    "callingApps": ["undefined (default)", "crawler", "DroneLiftRevamp-Custom-Function",
      "FT302-training", "ftclone-http-client", "page-designer", "ReaderCustom",
      "search-page-designer"
    ]
  };

  try {
    const response = await fetch(API_CALLS_API_URL, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching API calls data:', error);
    throw error;
  }
}

async function fetchTopBrowsersData() {
  const payload = {
    "startDate": "2024-12-01",
    "endDate": "2025-03-01"
  };

  try {
    const response = await fetch(TOP_BROWSERS_API_URL, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching top browsers data:', error);
    throw error;
  }
}

async function fetchTopFacetsData() {
  const payload = {
    "startDate": "2024-12-01",
    "endDate": "2025-03-01",
    "contentLocale": "en-US"
  };

  try {
    const response = await fetch(TOP_FACETS_API_URL, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching top facets data:', error);
    throw error;
  }
}

async function fetchTopSearchTermsData() {
  const payload = {
    "startDate": "2024-12-01",
    "endDate": "2025-03-01",
    "paging": {
      "page": 1,
      "perPage": 50
    },
    "contentLocale": "en-US",
    "askTotalQueryCount": true
  };

  try {
    const response = await fetch(TOP_SEARCH_TERMS_API_URL, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching top search terms data:', error);
    throw error;
  }
}

// Rendering

async function renderMostViewedDocumentsTable() {
  const tile = document.getElementById('most-viewed-docs');
  const tableBody = document.querySelector('#most-viewed-table tbody');
  const loadingIndicator = tile.querySelector('.loading-indicator');

  try {
    const data = await fetchMostViewedDocuments();
    loadingIndicator.style.display = 'none';

    if (data && data.results && Array.isArray(data.results)) {
      data.results.forEach(item => {
        const row = tableBody.insertRow();
        const titleCell = row.insertCell();
        const viewsCell = row.insertCell();
        const linkCell = row.insertCell();

        titleCell.textContent = item.title;
        viewsCell.textContent = item.displayCount;

        const link = document.createElement('a');
        link.href = item.link;
        link.textContent = 'View Document';
        link.target = "_blank"; // Open in a new tab
        linkCell.appendChild(link);
      });
    } else {
      tableBody.innerHTML = '<tr><td colspan="3">No data available.</td></tr>';
    }
  } catch (error) {
    console.error('Error rendering table:', error);
    loadingIndicator.textContent = 'Error loading data.';
  }
}

async function renderUserTrafficChart() {
  const tile = document.getElementById('user-traffic');
  const canvas = document.getElementById('user-traffic-chart');
  const loadingIndicator = tile.querySelector('.loading-indicator');

  try {
    const data = await fetchUserTrafficData();
    loadingIndicator.style.display = 'none';

    if (data && data.results && data.results[0] && data.results[0].periods) {
      const periods = data.results[0].periods;
      const labels = periods.map(period => period.periodStartDate.substring(0, 7)); // Get YYYY-MM
      const activeCounts = periods.map(period => period.activeCount);
      const totalCounts = periods.map(period => period.totalCount);

      new Chart(canvas, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
              label: 'Active Users',
              data: activeCounts,
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              fill: false
            },
            {
              label: 'Total Users',
              data: totalCounts,
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
              fill: false
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'User Count'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Month'
              }
            }
          }
        }
      });
    } else {
      canvas.outerHTML = '<p>No data available for user traffic.</p>';
    }
  } catch (error) {
    console.error('Error rendering user traffic chart:', error);
    loadingIndicator.textContent = 'Error loading data.';
  }
}

async function renderApiCallsChart() {
  const tile = document.getElementById('api-calls');
  const canvas = document.getElementById('api-calls-chart');
  const loadingIndicator = tile.querySelector('.loading-indicator');

  try {
    const data = await fetchApiCallsData();
    loadingIndicator.style.display = 'none';

    if (data && data.results && Array.isArray(data.results)) {
      const appNames = data.results.map(app => app.name);
      const datasets = data.results.map(app => {
        return {
          label: app.name,
          data: app.periods.map(period => period.callCount),
          backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`,
          borderWidth: 1
        };
      });

      const periodLabels = data.results[0].periods.map(period => period.periodStartDate.substring(0, 7)); // Get YYYY-MM

      new Chart(canvas, {
        type: 'bar',
        data: {
          labels: periodLabels,
          datasets: datasets
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Call Count'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Month'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'API Calls by App'
            }
          }
        }
      });
    } else {
      canvas.outerHTML = '<p>No data available for API calls.</p>';
    }
  } catch (error) {
    console.error('Error rendering API calls chart:', error);
    loadingIndicator.textContent = 'Error loading data.';
  }
}

async function renderTopBrowsersChart() {
  const tile = document.getElementById('top-browsers');
  const canvas = document.getElementById('top-browsers-chart');
  const loadingIndicator = tile.querySelector('.loading-indicator');

  try {
    const data = await fetchTopBrowsersData();
    loadingIndicator.style.display = 'none';

    if (data && data.results && Array.isArray(data.results)) {
      const browserNames = data.results.map(browser => browser.browserName);
      const percentages = data.results.map(browser => browser.percentage);

      // Limit to top N browsers for better readability (e.g., top 5)
      const topN = 5;
      const topBrowserNames = browserNames.slice(0, topN);
      const topPercentages = percentages.slice(0, topN);

      new Chart(canvas, {
        type: 'pie',
        data: {
          labels: topBrowserNames,
          datasets: [{
            label: 'Browser Usage',
            data: topPercentages,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)' // Add more colors if needed
            ],
            borderWidth: 1
          }]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Top Browsers'
            }
          }
        }
      });
    } else {
      canvas.outerHTML = '<p>No data available for top browsers.</p>';
    }
  } catch (error) {
    console.error('Error rendering top browsers chart:', error);
    loadingIndicator.textContent = 'Error loading data.';
  }
}

async function renderTopFacetsChart() {
  const tile = document.getElementById('top-facets');
  const canvas = document.getElementById('top-facets-chart');
  const loadingIndicator = tile.querySelector('.loading-indicator');

  try {
    const data = await fetchTopFacetsData();
    loadingIndicator.style.display = 'none';

    if (data && data.results && Array.isArray(data.results)) {
      // Combine all facet values into a single array for charting
      const facetLabels = [];
      const facetData = [];

      data.results.forEach(facet => {
        facet.byFacetValue.forEach(value => {
          facetLabels.push(`${facet.facetLabel}: ${value.facetValue}`);
          facetData.push(value.queryCount);
        });
      });

      new Chart(canvas, {
        type: 'pie',
        data: {
          labels: facetLabels,
          datasets: [{
            label: 'Facet Usage',
            data: facetData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(199, 181, 255, 0.6)',
              'rgba(99, 159, 64, 0.6)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Top Facets'
            }
          }
        }
      });
    } else {
      canvas.outerHTML = '<p>No data available for top facets.</p>';
    }
  } catch (error) {
    console.error('Error rendering top facets chart:', error);
    loadingIndicator.textContent = 'Error loading data.';
  }
}

async function renderTopSearchTermsTable() {
  const tile = document.getElementById('top-search-terms');
  const tableBody = document.querySelector('#top-search-terms-table tbody');
  const loadingIndicator = tile.querySelector('.loading-indicator');

  try {
    const data = await fetchTopSearchTermsData();
    loadingIndicator.style.display = 'none';

    if (data && data.results && Array.isArray(data.results)) {
      data.results.forEach(item => {
        const row = tableBody.insertRow();
        const searchTermCell = row.insertCell();
        const queryCountCell = row.insertCell();

        searchTermCell.textContent = item.terms;
        queryCountCell.textContent = item.queryCount;
      });
    } else {
      tableBody.innerHTML = '<tr><td colspan="2">No data available.</td></tr>';
    }
  } catch (error) {
    console.error('Error rendering top search terms table:', error);
    loadingIndicator.textContent = 'Error loading data.';
  }
}

// Call the rendering functions
renderMostViewedDocumentsTable();
renderUserTrafficChart();
renderApiCallsChart();
renderTopBrowsersChart();
renderTopFacetsChart();
renderTopSearchTermsTable();
