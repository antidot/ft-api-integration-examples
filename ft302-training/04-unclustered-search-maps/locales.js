/*======= Locales =======*/

function initLanguages() {
    getLanguages(createLanguageFacet);
}

function getLanguages(callback){
    send('GET', "/api/khub/locales", callback);
}

function createLanguageFacet(data) {
    let firstLang = true;    
    data.contentLocales.forEach(localeItem => {
        let code = localeItem.lang;
        let label = localeItem.label;
            
        if (firstLang) {
            var option = document.createElement('option');
            option.setAttribute('id', code);
            option.setAttribute('selected','');
            option.text = label;
        }
        else{
            var option = document.createElement('option');
            option.setAttribute('id', code);
            option.text = label;
        }
        firstLang = false;
        document.getElementById('languages').appendChild(option);
    });
}