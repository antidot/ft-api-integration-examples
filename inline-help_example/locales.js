const initLanguages = (callback) => {
  getLanguages((data) => {
    createLanguageFacet(data).then(callback)
  });
  registerLanguageChangeEvent(callback);
}

const getLanguages = (callback) => {
  send('GET', "/api/khub/locales", callback);
}

const createLanguageFacet = (data) => {
  let firstLang = true;
  data.contentLocales.forEach(localeItem => {
    const code = localeItem.lang;
    const label = localeItem.label;
    const option = document.createElement('option');
    option.setAttribute('id', code);
    option.text = label;
    if (firstLang) {
      option.setAttribute('selected','');
      language = code;
    }
    firstLang = false;
    document.getElementById('languages').appendChild(option);
  });
  return Promise.resolve();
};

const registerLanguageChangeEvent = (callback) => {
  const langSelect = document.getElementById('languages');
  langSelect.addEventListener('change', () => {
    language = langSelect.options[langSelect.selectedIndex].id;
    if (callback) {
        callback();
    }
  });
}