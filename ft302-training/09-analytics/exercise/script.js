const MOST_VIEWED_DOCS_API_URL = '*addAnalyticsMostViewedDocumentsRoute*';

// Additional API URL 

const API_HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer *addApiKey*',
  'Ft-Calling-App': 'my-app'
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

// Add other fetch functions ...


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

// Add other rendering functions ...



// Call the rendering functions
renderMostViewedDocumentsTable();

// Call other rendering functions ...