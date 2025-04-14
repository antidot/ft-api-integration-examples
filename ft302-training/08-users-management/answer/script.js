document.getElementById('listBookmarks').addEventListener('click', listBookmarks);

const AUTH_HEADER = 'Bearer *addApiKey*'; // Replace with your actual token

function listBookmarks() {
    const userId = document.getElementById('userId').value;
    const portalUrl = document.getElementById('portalUrl').value;
    
    fetch(`${portalUrl}/api/users/${userId}/bookmarks`, {
        headers: {
            'Authorization': AUTH_HEADER
        }
    })
    .then(response => response.json())
    .then(data => displayResponse(data))
    .catch(error => console.error('Error:', error));
}

function displayResponse(data) {
    let html = `
        <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Color</th>
                    <th>Creation Date</th>
                    <th>Last Update</th>
                    <th>Map Title</th>
                    <th>Reader URL</th>
                    <th>Breadcrumb</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(bookmark => {
        html += `
            <tr>
                <td>${bookmark.title}</td>
                <td>${bookmark.color}</td>
                <td>${new Date(bookmark.creationDate).toLocaleString()}</td>
                <td>${new Date(bookmark.lastUpdate).toLocaleString()}</td>
                <td>${bookmark.mapTitle}</td>
                <td><a href="${bookmark.readerUrl}" target="_blank">Link</a></td>
                <td>${bookmark.breadcrumb.join(' > ')}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    document.getElementById('response').innerHTML = html;
}