/**
 * Classe DesktopIconApp
 * Cette classe représente une application avec une icône et un titre, comme celles que l'on trouve sur un bureau virtuel.
 */
class DesktopIconApp {
    #img;
    #title;
    element;

    /**
     * Constructeur de la classe DesktopIconApp.
     * @param {string} img - L'URL de l'image pour l'icône.
     * @param {string} title - Le titre affiché sous l'icône.
     */
    constructor(img, title) {
        // Création de l'élément principal du composant (un div avec une classe CSS)
        this.element = document.createElement('div');
        this.element.className = 'desktop-app';

        // Création de l'élément img pour l'icône et ajout au div principal
        this.#img = document.createElement('img');
        this.#img.className = 'desktop-icon';
        this.#img.src = img;
        this.element.appendChild(this.#img);

        // Création de l'élément span pour le titre et ajout au div principal
        this.#title = document.createElement('span');
        this.#title.innerText = title;
        this.element.appendChild(this.#title);
    }
}
