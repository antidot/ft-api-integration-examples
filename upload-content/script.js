function showMessage(messageId) {
  var messageElements = ["waitingMessage", "successMessage", "errorMessage"];

  messageElements.forEach(function (id) {
    document.getElementById(id).style.display = "none";
  });

  document.getElementById(messageId).style.display = "block";
}

function populateSources() {
  fetch("/api/admin/khub/sources")
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
    })
    .catch((error) => {
      console.error("Error fetching sources:", error);
    });
}

function uploadFile(sourceId) {
  var fileInput = document.getElementById("fileInput");
  var file = fileInput.files[0];
  if (!file) {
    alert("Please select a file.");
    return;
  }

  var formData = new FormData();
  formData.append("file", file);

  var apiKey = "";

  showMessage("waitingMessage");

  fetch(`/api/admin/khub/sources/${sourceId}/upload`, {
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
      // Handle error
      showMessage("errorMessage");
    });
}

document.getElementById("uploadForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var sourceSelect = document.getElementById("sourceSelect");
    var selectedSourceId = sourceSelect.value;
    uploadFile(selectedSourceId);
  });

// Populate sources when the page loads
populateSources();
