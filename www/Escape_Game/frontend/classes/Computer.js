class Computer {
    username;
    screen;
    #motDePasse;
    #openLogInHandler;

    // application
    #explorer;
    #browser;
    #terminal;

    /**
     * Init l'ordinateur
     * @param {String} idScreen id de l'objet html pour l'écran
     * @param {String} username Nom d'utilisateur
     * @param {String} mdp Mot de passe
     */
    constructor(idScreen, username, mdp) {
        this.screen = document.getElementById(idScreen);
        this.screen.style.border = 'none';
        this.username = username;
        this.#motDePasse = mdp;

        // Initialisation des applications fictives
        let explorerTree = {
            "Documents": {
                "Nouveau dossier": {
                    "test.md": null
                },
                "lien utiles.txt": null
            }
        };
        this.#explorer = new FileExplorer(explorerTree, this);
        this.#browser = new WindowApp('Navigateur internet', this, new DesktopIconApp('assets/browser.png', 'Navigateur'));
        this.#terminal = new WindowApp('Terminal de commande', this, new DesktopIconApp('assets/terminal.png', 'Terminal'));

        // Gestionnaire d'événement lié à l'ouverture du login
        this.#openLogInHandler = this.#openLogIn.bind(this);
    }

    start() {
        // Fond d'écran
        this.screen.style.backgroundImage = 'url("assets/wallpaper_lock.jpg")';

        // Afficher la date et l'heure
        this.addToScreen(this.#createDateTimeContainer());

        // Activer l'interaction
        this.screen.addEventListener('click', this.#openLogInHandler);
    }

    #createDateTimeContainer() {
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
        FunctionAsset.applyStyle(time, { fontSize: '50px' });

        time.innerText = this.#getTime();
        setInterval(() => {
            time.innerText = this.#getTime();
        }, 60 * 1000);

        // La date
        const theDate = document.createElement('span');
        FunctionAsset.applyStyle(theDate, { fontSize: '25px' });
        theDate.innerText = this.#getDate();
        dateTimeCont.appendChild(theDate);
        return dateTimeCont;
    }

    async #openLogIn() {
        // Supprime l'écouteur d'événements pour éviter les clics multiples
        this.screen.removeEventListener('click', this.#openLogInHandler);

        // Supprimer la date et l'heure
        const dateTimeCont = this.screen.querySelector('div');
        if (dateTimeCont) {
            dateTimeCont.style.transition = 'all 0.5s';
            dateTimeCont.style.top = '-40%';
            await FunctionAsset.sleep(0.5);
            dateTimeCont.remove();
        }

        // Floue dans le background
        this.screen.style.transition = 'all 0.5s';
        this.screen.style.backgroundBlendMode = 'luminosity';

        // Afficher l'écran de login
        this.addToScreen(this.#createLoginContainer());
    }

    #createLoginContainer() {
        const cont = document.createElement('div');
        cont.id = 'windowsLogIn';
        FunctionAsset.applyStyle(cont, {
            position: 'relative',
            top: '10%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        });

        const img_pop = document.createElement('img');
        img_pop.src = 'assets/citeMetierLogo.png';
        cont.appendChild(img_pop);

        const p_username = document.createElement('p');
        p_username.innerText = this.username;
        cont.appendChild(p_username);

        const inpt_pswd = document.createElement('input');
        inpt_pswd.setAttribute('type', 'password');
        inpt_pswd.name = 'passwordLogIn';
        inpt_pswd.id = 'passwordLogIn';
        inpt_pswd.placeholder = 'Mot de passe';
        cont.appendChild(inpt_pswd);
        inpt_pswd.focus();

        // Voir le keypress lorsqu'il doit entrer le mot de passe
        const keyPressHandler = async (event) => {
            if (event.key !== "Enter") return;
            if (inpt_pswd.value !== this.#motDePasse) return;
            document.removeEventListener('keypress', keyPressHandler);
            cont.style.display = 'none';
            await FunctionAsset.sleep(0.65);
            this.open();
        };
        document.addEventListener('keypress', keyPressHandler);
        inpt_pswd.focus();
        return cont;
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

        const d = new Date();
        const jour = jours[d.getDay()];
        const date = d.getDate();
        const moisNom = mois[d.getMonth()];
        return `${jour} ${date} ${moisNom}`.toLowerCase();
    }

    #getTime() {
        const now = new Date();
        return now.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    addToScreen(elem) {
        this.screen.appendChild(elem);
    }

    clearScreen() {
        this.screen.innerHTML = '';
    }

    open() {
        // Fond d'écran
        this.screen.style.backgroundBlendMode = 'normal';
        this.screen.style.backgroundImage = 'url("assets/wallpaper_open.jpg")';
        this.clearScreen();
        this.openDesktop();
    }

    addAppClickListener(app, openFunction) {
        app.addEventListener('click', () => {
            app.removeEventListener('click', openFunction);
            openFunction.call(this);
        });
    }

    openDesktop() {
        let desktop_app_positions = [
            [this.#explorer.desktopIconApp.element, null, null, null, null, null, null, null, null],
            [this.#terminal.desktopIconApp.element, null, null, null, null, null, null, null, null],
            [this.#browser.desktopIconApp.element, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null]
        ];

        const ICON_SIZE = Math.floor(this.screen.clientWidth / desktop_app_positions[0].length);

        const table = document.createElement('table');
        table.id = 'desktop';
        for (let row = 0; row < desktop_app_positions.length; row++) {
            const tr = document.createElement('tr');

            for (let col = 0; col < desktop_app_positions[row].length; col++) {
                const colElem = desktop_app_positions[row][col];
                const td = document.createElement('td');
                FunctionAsset.applyStyle(td, {
                    boxSizing: 'border-box',
                    width: `${ICON_SIZE}px`,
                    height: `${ICON_SIZE}px`,
                    margin: '0',
                    padding: '0',
                });
                if (colElem) {
                    td.appendChild(colElem);
                }
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        this.addToScreen(table);
    }
}
