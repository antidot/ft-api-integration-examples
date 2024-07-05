const excludedKeys = [
    'ft:attachmentsSize', 'ft:baseId', 'ft:contentSize', 'ft:document_type',
    'ft:editorialType', 'ft:isArticle', 'ft:isBook', 'ft:isPublication',
    'ft:isUnstructured', 'ft:khubVersion', 'ft:lastPublication', 'ft:openMode',
    'ft:outputSize', 'ft:publication_title', 'ft:publicationId', 'ft:sourceCategory',
    'ft:sourceId', 'ft:sourceName', 'ft:sourceType', 'ft:structure'
];

async function fetchDocuments(base_url) {
    try {
        const response = await fetch(`${base_url}/api/khub/maps`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching documents:', error);
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
        throw error;
    }
}

async function updateDocumentMetadata(base_url, selectedValue, requestBody) {
    try {
        const response = await fetch(`${base_url}/api/admin/khub/publications/update-metadata?ft:publicationId=${selectedValue}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const text = await response.text();
        return text ? JSON.parse(text) : {}; // Handle empty responses
    } catch (error) {
        console.error('Error updating metadata:', error);
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

function renderDropdown(productValues, productMap, metadataDisplay, metadataLi, replaceLi) {
    const select = document.createElement('select');
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

    select.addEventListener('change', () => handleSelectChange(select, metadataDisplay, metadataLi, replaceLi));
    return select;
}

function createSubmitButton() {
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.type = 'button';
    submitButton.classList.add("submit");
    submitButton.addEventListener('click', handleSubmit);
    return submitButton;
}

async function handleSelectChange(select, metadataDisplay, metadataLi, replaceLi) {
    const base_url = document.getElementById('base_url').value;
    const selectedValue = select.value;

    const toggleLi = document.querySelector('li:nth-child(5)'); 
    const submitLi = document.querySelector('li:nth-child(6)'); 

    if (selectedValue) {
        try {
            const document = await fetchDocumentById(base_url, selectedValue);
            displayMetadata(document.metadata.filter(meta => !excludedKeys.includes(meta.key)), metadataDisplay);
            
            // Check for and display elements correctly
            if (metadataLi) metadataLi.style.display = 'list-item';  
            if (replaceLi) replaceLi.style.display = 'list-item';
            if (toggleLi) toggleLi.style.display = 'list-item';
            if (submitLi) submitLi.style.display = 'list-item';  
        } catch (error) {
            console.error('Error fetching metadata:', error);
        }
    } else {
        metadataDisplay.innerHTML = ''; 
        if (metadataLi) metadataLi.style.display = 'none';
        if (replaceLi) replaceLi.style.display = 'none';
        if (toggleLi) toggleLi.style.display = 'none';
        if (submitLi) submitLi.style.display = 'none';
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
            const key = checkedRadio.getAttribute("data-metakey");
            const values = Array.from(inputs).map(input => input.value).filter(value => value.trim() !== "");
            if (values.length === 0) {
                console.log('Please fill out at least one input field.');
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
                await handleSelectChange(document.querySelector('select'), metadataDisplay, document.querySelector('li:nth-child(2)'), document.querySelector('li:nth-child(3)'));
            } catch (error) {
                console.error('Error updating metadata:', error);
            } finally {
                inputs.forEach(input => input.value = ''); 
            }
        } else if (!checkedRadio) {
            console.log('Please select a radio button');
        } else if (inputs.length === 0) {
            console.log('No input fields found');
        }
    } else {
        console.log('Please select a product');
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
        if (container.getElementsByClassName('input-group').length > 1) {
            inputGroup.remove();
        }
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

async function generateDropdown() {
    const swapper = document.getElementById("swapper");
    swapper.innerHTML = ''; 

    const ol = document.createElement('ol');

    const baseUrlLi = document.createElement('li');
    const dropdownLi = document.createElement('li');
    dropdownLi.className = 'metadataLi'; // This will help to identify later
    const metadataLi = document.createElement('li');
    metadataLi.className = 'metadataLi';
    const replaceLi = document.createElement('li');
    replaceLi.className = 'replaceLi';
    const toggleLi = document.createElement('li'); 
    const submitLi = document.createElement('li'); 

    const metadataDisplay = document.createElement('div');
    metadataDisplay.className = 'metadataDisplay';
    const additionalInfoContainer = document.createElement('div');

    additionalInfoContainer.className = "additional-info-container";

    const baseUrlLabel = document.createElement('span');
    baseUrlLabel.classList.add("instruction");
    baseUrlLabel.textContent = 'Enter base URL:';
    baseUrlLi.appendChild(baseUrlLabel);
    baseUrlLi.appendChild(document.createElement('br'));

    const baseUrlInput = document.createElement('input');
    baseUrlInput.type = 'text';
    baseUrlInput.id = 'base_url';
    baseUrlLi.appendChild(baseUrlInput);

    const dropdownLabel = document.createElement('span');
    dropdownLabel.classList.add("instruction");
    dropdownLabel.textContent = 'Select a document:';
    dropdownLi.appendChild(dropdownLabel);
    dropdownLi.appendChild(document.createElement('br'));

    const metadataLabel = document.createElement('span');
    metadataLabel.classList.add("instruction");
    metadataLabel.textContent = 'Select a metadata key to replace:';
    metadataLi.appendChild(metadataLabel);
    metadataLi.appendChild(document.createElement('br'));

    const replaceLabel = document.createElement('span');
    replaceLabel.classList.add("instruction");
    replaceLabel.textContent = 'Enter a replacement:';
    replaceLi.appendChild(replaceLabel);

    const toggleLabel = document.createElement('span');
    toggleLabel.classList.add("instruction");
    toggleLabel.textContent = 'Should the topics of the document inherit the new value(s)?';

    const toggleSwitch = document.createElement('input');
    toggleSwitch.type = 'checkbox';
    toggleSwitch.id = 'inheritance-toggle';
    toggleSwitch.classList.add("checkbox");
    toggleSwitch.checked = true;

    const toggleStateLabel = document.createElement('span');
    toggleStateLabel.id = 'toggle-state-label';
    toggleStateLabel.textContent = 'Yes';
    toggleSwitch.addEventListener('change', function () {
        toggleStateLabel.textContent = toggleSwitch.checked ? 'Yes' : 'No';
    });

    toggleLi.appendChild(toggleLabel);
    toggleLi.appendChild(toggleSwitch);
    toggleLi.appendChild(toggleStateLabel);

    const submitLabel = document.createElement('span');
    submitLabel.classList.add("instruction");
    submitLabel.textContent = 'Go?';
    submitLi.appendChild(submitLabel);

    metadataLi.style.display = 'none';
    replaceLi.style.display = 'none';
    toggleLi.style.display = 'none';
    submitLi.style.display = 'none';

    const documentsFetchButton = document.createElement('button');
    documentsFetchButton.textContent = 'Fetch documents';
    documentsFetchButton.type = 'button';
    documentsFetchButton.classList.add('fetch-documents');
    documentsFetchButton.addEventListener('click', async () => {
        try {
            const base_url = document.getElementById('base_url').value;
            const documents = await fetchDocuments(base_url);
            const { productValues, productMap } = createDropdownOptions(documents);
            const select = renderDropdown(productValues, productMap, metadataDisplay, metadataLi, replaceLi);
            const submitButton = createSubmitButton();

            const plusButtonContainer = document.createElement('div');
            plusButtonContainer.className = 'button-container';
            const plusButton = document.createElement('button');
            plusButton.textContent = '+';
            plusButton.type = 'button';
            plusButton.addEventListener('click', () => addNewInputField(additionalInfoContainer));
            plusButtonContainer.appendChild(plusButton);

            dropdownLi.appendChild(select);
            metadataLi.appendChild(metadataDisplay);

            addNewInputField(additionalInfoContainer);
            additionalInfoContainer.appendChild(plusButtonContainer);
            replaceLi.appendChild(additionalInfoContainer);
            ol.appendChild(dropdownLi);
            ol.appendChild(metadataLi);
            ol.appendChild(replaceLi);
            ol.appendChild(toggleLi);
            ol.appendChild(submitLi);
            submitLi.appendChild(submitButton);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    });

    baseUrlLi.appendChild(documentsFetchButton);
    ol.appendChild(baseUrlLi);

    swapper.appendChild(ol);
}

generateDropdown();