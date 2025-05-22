export class EtiennesAlert {
    text;
    #animationTime;
    #element;
    #isShow;

    /**
     * Crée une alerte visuelle sur la page.
     * @param {string} text - Le texte à afficher dans l'alerte.
     */
    constructor(text, animationTime = 3) {
        this.text = text;
        this.#animationTime = animationTime;
        this.#element = document.createElement('div');
        this.#element.innerText = text;
        this.#isShow = false;

        // Applique les styles à l'alerte
        Object.assign(this.#element.style, {
            top: '50%',
            left: '50%',
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            color: 'whitesmoke',
            backgroundColor: 'rgb(100 100 100 / 75%)',
            padding: '1% 3%',
            borderRadius: '50%',
            fontWeight: '400',
            fontSize: '21px',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '9999',
            boxShadow: '0 0 15px 1px #2196F3',
            textShadow: '0 0 6px #673AB7'
        });
    }

    /**
     * Affiche l'alerte avec une animation, puis la supprime après un délai.
     */
    async show(animationTime = this.#animationTime) {
        if (this.#isShow) { return }
        this.#isShow = true;
        document.body.appendChild(this.#element);

        // Attend la fin de l'animation
        await new Promise(resolve => setTimeout(resolve, animationTime * 1000));
        this.#element.remove();
        this.#isShow = false;
    }
}