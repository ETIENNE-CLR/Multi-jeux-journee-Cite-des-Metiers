class Computer {
    username;
    #screen;

    /**
     * Init l'ordinateur
     * @param {String} idScreen id de l'objet html pour l'écran
     */
    constructor(idScreen, username) {
        this.#screen = document.getElementById(idScreen);
        this.username = username;
    }

    start() {
        // Démarrage de l'ordi
        this.#screen.style.backgroundImage = 'url("assets/wallpaper.jpg")';

        // Afficher la date et l'heure
        const dateTimeCont = document.createElement('div');
        this.addToScreen(dateTimeCont);
        FunctionAsset.applyStyle(dateTimeCont, {
            left: '0',
            top: '68%',
            display: 'flex',
            color: 'whitesmoke',
            position: 'relative',
            flexDirection: 'column',
            fontFamily: '"Noto Sans Newa"'
        });

        // L'heure
        const time = document.createElement('span');
        dateTimeCont.appendChild(time);
        FunctionAsset.applyStyle(time, {
            fontSize: '50px',
        });

        // Toutes les 60 secondes...
        time.innerText = this.#getTime();
        setInterval(() => {
            time.innerText = this.#getTime();
        }, 60 * 1000);

        // La date
        const theDate = document.createElement('span');
        FunctionAsset.applyStyle(theDate, {
            fontSize: '25px',
        });
        theDate.innerText = this.#getDate();
        dateTimeCont.appendChild(theDate);


        // Activer le onclick
        let open = async () => {
            this.#screen.removeEventListener('click', open);
            // Slide du time date
            dateTimeCont.style.transition = 'all 0.5s';
            dateTimeCont.style.top = '-40%';
            await FunctionAsset.sleep(0.5);

            // Floue dans le background
            this.#screen.style.transition = 'all 0.5s';
            dateTimeCont.remove();

            // Login
            const cont = document.createElement('div');
            cont.id = 'windowsLogIn';
            FunctionAsset.applyStyle(cont, {
                position: 'relative',
                top: '10%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            });
            cont.innerHTML = `<img src="assets/citeMetierLogo.png">
            <p>${this.username}</p>
            <input type="password" name="passwordLogIn" id="passwordLogIn" placeholder="Mot de passe">`;
            this.addToScreen(cont);
        }
        this.#screen.addEventListener('click', open);
    }

    #getDate() {
        const jours = [
            "Dimanche", "Lundi", "Mardi", "Mercredi",
            "Jeudi", "Vendredi", "Samedi"
        ];
        const mois = [
            "janvier", "février", "mars", "avril",
            "mai", "juin", "juillet", "août",
            "septembre", "octobre", "novembre", "décembre"
        ];

        let d = new Date();
        let jour = jours[d.getDay()];
        let date = d.getDate();
        let moisNom = mois[d.getMonth()];
        return `${jour} ${date} ${moisNom}`.toLowerCase();
    }

    #getTime() {
        let now = new Date();
        return now.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    addToScreen(elem) {
        this.#screen.appendChild(elem);
    }
}