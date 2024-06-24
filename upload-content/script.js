var apiKey = "";

document.getElementById("setApiKeyButton").addEventListener("click", function () {
    const apiKey = document.getElementById("api_key").value;
    const url = document.getElementById("url").value;
    populateSources(apiKey, url);
  });

function showMessage(messageId) {
  var messageElements = ["waitingMessage", "successMessage", "errorMessage"];

  messageElements.forEach(function (id) {
    document.getElementById(id).style.display = "none";
  });

  document.getElementById(messageId).style.display = "block";
}

function populateSources(apiKey, url) {
  fetch(`${url}/api/admin/khub/sources`, {
    headers: {
      Authorization: "Bearer " + apiKey,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      var sourceSelect = document.getElementById("sourceSelect");
      data.forEach(function (source) {
        var option = document.createElement("option");
        option.value = source.id;
        option.textContent = source.name;
        sourceSelect.appendChild(option);
      });
      // Show upload form on successful source population
      document.getElementById("uploadForm").style.display = "block";
      document.getElementById("sourceSelect").style.display = "block";
    })
    .catch((error) => {
      console.error("Error fetching sources:", error);
      showMessage("errorMessage");
    });
}

function uploadFile(sourceId, url, apiKey) {
  var fileInput = document.getElementById("fileInput");
  var file = fileInput.files[0];
  if (!file) {
    alert("Please select a file.");
    return;
  }

  var formData = new FormData();
  formData.append("file", file);

  showMessage("waitingMessage");

  fetch(`${url}/api/admin/khub/sources/${sourceId}/upload`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("File uploaded successfully:", data);
      showMessage("successMessage");
    })
    .catch((error) => {
      console.error("Error uploading file:", error);
      showMessage("errorMessage");
    });
}

document.getElementById("uploadForm").addEventListener("submit", function (event) {
    event.preventDefault();
    
    var sourceSelect = document.getElementById("sourceSelect");
    var urlValue = document.getElementById("url");
    var api_keyValue = document.getElementById("api_key");

    var selectedSourceId = sourceSelect.value;
    var enteredUrl = urlValue.value;
    var enteredKey = api_keyValue.value;

    uploadFile(selectedSourceId, enteredUrl, enteredKey);
  });
