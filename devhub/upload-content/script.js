const excludedKeys = [
  'ft:attachmentsSize', 'ft:baseId', 'ft:contentSize', 'ft:document_type',
  'ft:editorialType', 'ft:isArticle', 'ft:isBook', 'ft:isPublication',
  'ft:isUnstructured', 'ft:khubVersion', 'ft:lastPublication', 'ft:openMode',
  'ft:outputSize', 'ft:publication_title', 'ft:publicationId', 'ft:sourceCategory',
  'ft:sourceId', 'ft:sourceName', 'ft:sourceType', 'ft:structure'
];

let apiKey = '';

async function fetchDocuments(base_url) {
  try {
      const response = await fetch(`${base_url}/api/khub/maps`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
  } catch (error) {
      console.error('Error fetching documents:', error);
      showMessage("errorMessage");
      throw error;
  }
}

async function fetchDocumentById(base_url, documentId) {
  try {
      const response = await fetch(`${base_url}/api/khub/maps/${documentId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
  } catch (error) {
      console.error('Error fetching document by ID:', error);
      showMessage("errorMessage");
      throw error;
  }
}

async function updateDocumentMetadata(base_url, selectedValue, requestBody) {
  try {
      const response = await fetch(`${base_url}/api/admin/khub/publications/update-metadata?ft:publicationId=${selectedValue}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(requestBody)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const text = await response.text();
      return text ? JSON.parse(text) : {}; // Handle empty responses
  } catch (error) {
      console.error('Error updating metadata:', error);
      showMessage("errorMessage");
      throw error;
  }
}

function createDropdownOptions(documents) {
  const productMap = new Map();
  documents.forEach(document => {
      const productMetadata = document.metadata.find(meta => meta.key === 'ft:title' && !excludedKeys.includes(meta.key));
      const documentId = document.id;
      if (productMetadata && productMetadata.values) {
          productMetadata.values.forEach(value => {
              productMap.set(value, documentId);
          });
      }
  });
  const productValues = [...new Set(productMap.keys())].sort((a, b) => a.localeCompare(b));
  return { productValues, productMap };
}

function renderDropdown(productValues, productMap) {
  const select = document.querySelector('select');
  select.innerHTML = ''; // Clear previous options
  const defaultOption = document.createElement('option');
  defaultOption.text = '';
  defaultOption.value = '';
  select.append(defaultOption);
  
  productValues.forEach(value => {
      const option = document.createElement('option');
      option.value = productMap.get(value);
      option.text = `${value} (${productMap.get(value)})`;
      select.append(option);
  });
}

function handleSelectChange(select, metadataDisplay, metadataLi, replaceLi, inheritLi, submitLi) {
  const base_url = document.getElementById('base_url').value;
  const selectedValue = select.value;

  if (selectedValue) {
      fetchDocumentById(base_url, selectedValue).then(document => {
          displayMetadata(document.metadata.filter(meta => !excludedKeys.includes(meta.key)), metadataDisplay);
          
          metadataLi.classList.remove('hidden');
          replaceLi.classList.remove('hidden');
          inheritLi.classList.remove('hidden');
          submitLi.classList.remove('hidden');
      }).catch(error => {
          console.error('Error fetching metadata:', error);
          showMessage("errorMessage");
      });
  } else {
      metadataLi.classList.add('hidden');
      replaceLi.classList.add('hidden');
      inheritLi.classList.add('hidden');
      submitLi.classList.add('hidden');
  }
}

async function handleSubmit() {
  const base_url = document.getElementById('base_url').value;
  const selectedValue = document.querySelector('select').value;
  const toggleState = document.getElementById('inheritance-toggle').checked;
  if (selectedValue) {
      const checkedRadio = document.querySelector('#swapper input[type="radio"]:checked');
      const inputs = document.querySelectorAll('.additionalInfo'); 
      if (checkedRadio && inputs.length > 0) {
          showMessage("waitingMessage");

          const key = checkedRadio.getAttribute("data-metakey");
          const values = Array.from(inputs).map(input => input.value).filter(value => value.trim() !== "");
          if (values.length === 0) {
              console.log('Please fill out at least one input field.');
              showMessage("errorMessage");
              return;
          }
          const requestBody = {
              metadata: [
                  { key: key, ...(values.length === 1 ? { value: values[0] } : { values: values }) }
              ],
              ...(!toggleState && { inheritance: false }) 
          };

          const spinnerOverlay = document.createElement('div');
          spinnerOverlay.className = 'overlay';
          const spinner = document.createElement('div');
          spinner.className = 'lds-dual-ring';
          spinnerOverlay.appendChild(spinner);
          const metadataDisplay = document.querySelector('.metadataDisplay');
          metadataDisplay.classList.add('relative');
          metadataDisplay.appendChild(spinnerOverlay);

          try {
              await updateDocumentMetadata(base_url, selectedValue, requestBody);
              await new Promise(resolve => setTimeout(resolve, 10000)); 
              handleSelectChange(document.querySelector('select'), metadataDisplay, document.querySelector('.metadataLi'), document.querySelector('.replaceLi'), document.querySelector('.inheritLi'), document.querySelector('.submitLi'));
              showMessage("successMessage");
          } catch (error) {
              console.error('Error updating metadata:', error);
              showMessage("errorMessage");
          } finally {
              inputs.forEach(input => input.value = ''); 
              spinnerOverlay.remove();
          }
      } else if (!checkedRadio) {
          console.log('Please select a radio button');
          showMessage("errorMessage");
      } else if (inputs.length === 0) {
          console.log('No input fields found');
          showMessage("errorMessage");
      }
  } else {
      console.log('Please select a product');
      showMessage("errorMessage");
  }
}

function addNewInputField(container) {
  const inputGroup = document.createElement('div');
  inputGroup.className = 'input-group';

  const newInput = document.createElement('input');
  newInput.type = 'text';
  newInput.classList.add('additionalInfo');
  newInput.placeholder = 'Enter new value here';

  const minusButton = document.createElement('button');
  minusButton.textContent = '-';
  minusButton.type = 'button';
  minusButton.classList.add("minus");
  minusButton.addEventListener('click', () => {
      inputGroup.remove();
  });

  inputGroup.appendChild(newInput);
  inputGroup.appendChild(minusButton);
  container.insertBefore(inputGroup, container.querySelector('.button-container'));
}

function displayMetadata(metadataArray, container) {
  container.innerHTML = ""; 
  if (metadataArray.length) {
      const filteredMetadata = metadataArray.filter(meta => !excludedKeys.includes(meta.key));
      const sortedMetadata = filteredMetadata.sort((a, b) => a.key.localeCompare(b.key));
      const groupedMetadata = sortedMetadata.reduce((acc, meta) => {
          acc[meta.key] = acc[meta.key] ?? [];
          acc[meta.key].push(...meta.values);
          return acc;
      }, {});
      const table = document.createElement("table");
      table.style.width = "100%";
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      ["", "Key", "Value"].forEach(text => {
          const th = document.createElement("th");
          th.textContent = text;
          headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);
      const tbody = document.createElement("tbody");
      for (const [key, values] of Object.entries(groupedMetadata)) {
          values.forEach((value, index) => {
              const row = document.createElement("tr");
              if (index === 0) {
                  const selectCell = document.createElement("td");
                  const radio = document.createElement("input");
                  radio.type = "radio";
                  radio.id = value;
                  radio.name = "metadataRadioGroup";
                  radio.value = value;
                  radio.setAttribute("data-metakey", key);
                  selectCell.appendChild(radio);
                  selectCell.rowSpan = values.length;
                  row.appendChild(selectCell);
                  const keyCell = document.createElement("td");
                  const codeElement = document.createElement("code");
                  codeElement.textContent = key;
                  keyCell.appendChild(codeElement);
                  keyCell.rowSpan = values.length;
                  row.appendChild(keyCell);
              }
              const valueCell = document.createElement("td");
              valueCell.textContent = value;
              row.appendChild(valueCell);
              tbody.appendChild(row);
          });
      }
      table.appendChild(tbody);
      container.appendChild(table);
  } else {
      container.textContent = "No metadata available.";
  }
}

document.querySelector('.fetch-documents').addEventListener('click', async () => {
  try {
      const base_url = document.getElementById('base_url').value;
      const documents = await fetchDocuments(base_url);

      const { productValues, productMap } = createDropdownOptions(documents);

      renderDropdown(productValues, productMap);

      document.querySelector('.dropdownLi').classList.remove('hidden');
  } catch (error) {
      console.error('Error fetching documents:', error);
      showMessage("errorMessage");
  }
});

document.querySelector('select').addEventListener('change', () => {
  handleSelectChange(
      document.querySelector('select'), 
      document.querySelector('.metadataDisplay'), 
      document.querySelector('.metadataLi'), 
      document.querySelector('.replaceLi'), 
      document.querySelector('.inheritLi'), 
      document.querySelector('.submitLi')
  );
});

document.querySelector('.submit').addEventListener('click', handleSubmit);

document.getElementById('inheritance-toggle').addEventListener('change', function() {
  document.getElementById('toggle-state-label').textContent = this.checked ? 'Yes' : 'No';
});

document.querySelector('.plus').addEventListener('click', () => {
  addNewInputField(document.querySelector('.additional-info-container'));
});

document.querySelector('.additional-info-container').addEventListener('click', (event) => {
  if (event.target.classList.contains("minus")) {
      event.target.closest('.input-group').remove();
  }
});

document.querySelector('.confirm-api-key').addEventListener('click', () => {
  apiKey = document.getElementById('api_key').value;
  console.log('API Key confirmed:', apiKey);
});

function showMessage(messageId) {
  const messageElements = ["waitingMessage", "successMessage", "errorMessage"];

  messageElements.forEach(function (id) {
      document.getElementById(id).style.display = "none";
  });

  document.getElementById(messageId).style.display = "block";
}