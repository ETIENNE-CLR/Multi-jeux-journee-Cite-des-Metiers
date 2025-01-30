class FileExplorer extends WindowApp {
    tree;
    actualPath;
    #mainBody;

    get ActualPath() { return this.actualPath }
    set ActualPath(value) {
        this.actualPath = value;
        this.viewPath();
    }

    constructor(tree, computerElement) {
        super('Explorateur de fichiers', computerElement, new DesktopIconApp('assets/folder.png', 'Fichiers'))
        this.tree = tree;
        this.actualPath = '/';

        // Créer l'explorateur de fichiers
        FunctionAsset.applyStyle(this.innerFrame, {
            display: 'flex'
        });

        // Côté gauche
        const aside = document.createElement('div');
        aside.className = 'col-2 p-2';
        aside.innerHTML = '<p></p>';
        this.innerFrame.appendChild(aside);
        FunctionAsset.applyStyle(aside, {
            borderRight: '1px solid lightgrey'
        });

        // Côté droit
        this.#mainBody = document.createElement('div');
        this.#mainBody.className = 'col-10 p-2 mainBody';
        this.innerFrame.appendChild(this.#mainBody);
    }

    open() {
        this._openBase();
        this.viewPath(this.ActualPath);
    }

    viewPath() {
        const container = document.createElement('div');
        const headerApp = document.createElement('div');
        headerApp.id = 'headerApp';
        headerApp.className = 'd-flex justify-content-between';
        container.appendChild(headerApp);

        // Btn retour en arrière
        const btn_back = document.createElement('div');
        btn_back.innerHTML = '<i class="bi bi-arrow-left"></i>';
        headerApp.appendChild(btn_back);
        FunctionAsset.applyStyle(btn_back, {
            padding: '0 1%',
            border: '1px solid grey'
        });
        btn_back.addEventListener('click', () => {
            let temp = stringPathToArray(this.actualPath);
            let newActualPath = '/';
            for (let pkj = 0; pkj < temp.length - 1; pkj++) {
                newActualPath += `${temp[pkj]}/`;
            }
            this.ActualPath = newActualPath;
        });

        // Afficher le chemin absolue
        const divPath = document.createElement('input');
        divPath.value = this.ActualPath;
        divPath.readOnly = true;
        headerApp.appendChild(divPath);
        divPath.className = 'col-11';
        FunctionAsset.applyStyle(divPath, {
            padding: '0% 1%',
            border: '1px solid grey'
        });

        // Créer le corps de la fenêtre
        const divFileContainer = document.createElement('div');
        divFileContainer.id = 'divFileContainer';
        container.appendChild(divFileContainer);
        FunctionAsset.applyStyle(divFileContainer, {
            padding: '2% 1.5%',
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row'
        });

        // Récupérer le contenu du dossier actuel
        function stringPathToArray(stringPath) {
            let formattedArray = [];
            stringPath.split('/').forEach(pathElement => {
                if (pathElement != '') {
                    formattedArray.push(pathElement);
                }
            });
            return formattedArray;
        }
        let allBeforeKeys = stringPathToArray(this.ActualPath);
        let jsonActualPath = this.tree;
        for (let joi = 0; joi < allBeforeKeys.length; joi++) {
            jsonActualPath = jsonActualPath[allBeforeKeys[joi]];
        }

        // Récupérer toutes les clés enfants actuelles
        let directorys = [];
        let files = [];

        // Génération des tableaux
        Object.entries(jsonActualPath).forEach(([key, value]) => {
            if (typeof value === "object") {
                // C'est un dossier
                directorys.push(key);
            } else {
                // C'est un fichier
                files.push(key);
            }
        });

        let iconContainerStyle = {
            width: '15%',
            margin: '0.25% 1%'
        };
        let iconTextStyle = {
            color: 'black',
            textShadow: 'none'
        };

        // Créer les dossiers enfants s'il y en a
        Array.from(directorys).forEach(dir => {
            // Création du conteneur de l'icone
            const iconCon = document.createElement('div');
            FunctionAsset.applyStyle(iconCon, iconContainerStyle);
            divFileContainer.appendChild(iconCon);

            // Création de l'icone
            let icon = new DesktopIconApp('assets/folder.png', dir);
            FunctionAsset.applyStyle(icon.element.querySelector('span'), iconTextStyle);
            iconCon.appendChild(icon.element);
            icon.element.addEventListener('click', () => {
                this.ActualPath += `${dir}/`;
            });
        });

        // Créer les fichiers enfants s'il y en a
        Array.from(files).forEach(file => {
            // Création du conteneur de l'icone
            const iconCon = document.createElement('div');
            FunctionAsset.applyStyle(iconCon, iconContainerStyle);
            divFileContainer.appendChild(iconCon);

            // Création de l'icone
            let icon = new DesktopIconApp('assets/file.png', file);
            FunctionAsset.applyStyle(icon.element.querySelector('span'), iconTextStyle);
            iconCon.appendChild(icon.element);
        });

        // Réafficher la vue
        this.#mainBody.innerHTML = '';
        this.#mainBody.appendChild(container);
    }
}