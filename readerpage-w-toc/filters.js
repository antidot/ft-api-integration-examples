/*======
 Facets
======*/
function initFilters(locale, facetsIds) {
    getFilters(createFilters, facetsIds, locale)
}

function getFilters(callback, facetIds, contentLocale){
    let facetIdsFormatted = [];
    facetIds.map((facetId) => facetIdsFormatted.push({"id": facetId}));
    const payload = {
        "facets": facetIdsFormatted,
        "contentLocale": contentLocale,
        "uiLocale": contentLocale,
         // Hack in order to return no results as
         // we are only interested by getting the facets + their values (and no dedicated route exists).
        "paging": {
            "page": 1,
            "perPage": 0
        }
    };
    send('POST', "/api/khub/clustered-search", callback, payload);
}

function createFilters(data) {   
    data.facets.forEach(facetItem => {
        let facetId = facetItem.key;
        let facetName = facetItem.label;

        // create <select id="${facetId}">
        let select = document.createElement('select');
        select.setAttribute('id', facetId);
            
        // create <option selected disabled>${facetName}</option>
        let facetNameOption = document.createElement('option');
        facetNameOption.setAttribute('selected','');
        facetNameOption.setAttribute('disabled','');
        facetNameOption.text = facetName;
        select.appendChild(facetNameOption);

        facetItem.rootNodes.forEach(facetValueItem => {
            let facetValueKey = facetValueItem.value;
            let facetValueLabel = facetValueItem.label;
                // create <option id="${facetKey}">${facetLabel}</option>\n
            let facetValueOption = document.createElement('option');
            facetValueOption.setAttribute('id', facetValueKey);
            facetValueOption.text = facetValueLabel;
            select.appendChild(facetValueOption);
        });
        document.getElementById('facets').appendChild(select);
        /* ---------------------------------------------------
        create: 
           <select id="${facetId}">
             <option selected disabled>${facetName}</option>
             <option id="${facetKey}">${facetLabel}</option>
             <option id="${facetKey}">${facetLabel}</option>
             ...
           </select>
        --------------------------------------------------- */      
    });  
}
