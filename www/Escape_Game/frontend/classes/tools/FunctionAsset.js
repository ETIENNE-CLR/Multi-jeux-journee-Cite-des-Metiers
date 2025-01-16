class FunctionAsset {
    /**
     * Fonction qui permet de mettre le mode plein écran
     */
    static openFullscreen() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { // Firefox
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { // Chrome, Safari et Opera
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // Internet Explorer/Edge
            elem.msRequestFullscreen();
        }
    }

    /**
     * Fonction qui permet de quitter le mode plein écran
     */
    static closeFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari et Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // Internet Explorer/Edge
            document.msExitFullscreen();
        }
    }

    /**
     * Fonction qui attend un temps de secondes données
     * @param {string} secondes 
     * @returns {Promise} Promesse réalisée
     */
    static sleep(secondes) {
        return new Promise(resolve => setTimeout(resolve, secondes * 1000));
    }

    /**
     * Méthode qui permet d'affecter un style css en format json à un élément html
     * @param {HTMLElement} element 
     * @param {JSON} jsonStyle 
     */
    static applyStyle(element, jsonStyle){
        Object.assign(element.style, jsonStyle);
    }
}