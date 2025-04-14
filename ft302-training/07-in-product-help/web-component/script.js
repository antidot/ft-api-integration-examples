const scripts = [
    "https://cdn.jsdelivr.net/npm/@fluid-topics/ft-in-product-help/build/ft-in-product-help.min.js",
    "https://cdn.jsdelivr.net/npm/@fluid-topics/ft-size-watcher/build/ft-size-watcher.min.js",
    "https://cdn.jsdelivr.net/npm/@fluid-topics/ft-button/build/ft-button.min.js",
    "https://cdn.jsdelivr.net/npm/@fluid-topics/ft-text-field/build/ft-text-field.min.js",
    "https://cdn.jsdelivr.net/npm/@fluid-topics/ft-search-bar/build/ft-search-bar.min.js",
    "https://cdn.jsdelivr.net/npm/@fluid-topics/public-api/dist/fluidtopics.min.js",
    "https://cdn.jsdelivr.net/npm/@fluid-topics/ft-reader-context/build/ft-reader-context.min.js"
];

scripts.forEach(src => {
    const script = document.createElement("script");
    script.setAttribute("src", src);
    document.head.appendChild(script);
});

// Wait for the DOM and the scripts to load
document.addEventListener("DOMContentLoaded", () => {
    // Ensure components are registered
    customElements.whenDefined('ft-button').then(() => {
        const button = document.querySelector("ft-button");
        button.addEventListener("click", () => {
            const help = document.querySelector("ft-in-product-help");
            if (help) {
                help.open();
            }
        });
    });

    // Ensure components are registered
    customElements.whenDefined('ft-text-field').then(() => {
        const textField = document.querySelector("ft-text-field");
        textField.addEventListener("change", (e) => {
            const help = document.querySelector("ft-in-product-help");
            if (help) {
                help.navigateTo(e.detail);
            }
        });
    });
});
