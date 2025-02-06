class Terminal extends WindowApp {
    #urls;
    currentUrl;

    constructor(urls) {
        this.#urls = urls;
        this.currentUrl = "";
    }

    goTo(search) {
        search = search.toLowerCase();
        if (this.#urls.Includes(search)) {
            // C'est une url connue
        } else {
            // C'est une recherche
        }
    }
}