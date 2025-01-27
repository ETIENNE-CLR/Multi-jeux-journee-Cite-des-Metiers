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
            let formattedPath = this.actualPath.substring(1, this.actualPath.length);
            if (formattedPath.includes('/')) {
                let array = formattedPath.split('/');
                array.slice(array.length - 3, 2);
            }
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

        // Formatter le path
        function formattedPath(arrayStringPath) {
            let formatted = [];
            arrayStringPath.forEach(pathElement => {
                if (pathElement != ''){
                    formatted.push(pathElement);
                }
            });
            return formatted;
        }

        // Récupérer le tableau selon le path actuel
        let tableKey = '';
        let pathCopy = `${this.ActualPath}`;
        do {
            pathCopy += 'directories/';
            let pathArray = pathCopy.split('/');
            pathArray = formattedPath(pathArray);
            tableKey = pathArray.reverse()[0];

            while (pathArray.length - 1 > 0) {
                pathArray.pop();
            }
            pathCopy = pathArray.join('/');
        } while (pathCopy.includes('/'));


        // Créer les dossiers
        const divFileContainer = document.createElement('div');
        divFileContainer.id = 'divFileContainer';
        divFileContainer.style.padding = '2% 1.5%';
        container.appendChild(divFileContainer);
        Array.from(this.tree[tableKey]).forEach(dir => {
            let icon = new DesktopIconApp('assets/folder.png', dir.name);
            FunctionAsset.applyStyle(icon.element.querySelector('span'), {
                color: 'black',
                textShadow: 'none'
            });

            const iconCon = document.createElement('div');
            iconCon.style.width = '10%';
            iconCon.appendChild(icon.element);
            divFileContainer.appendChild(iconCon);
            icon.element.addEventListener('click', () => {
                this.ActualPath += `${dir.name}/`;
            });
        });



        // Réafficher la vue
        this.#mainBody.innerHTML = '';
        this.#mainBody.appendChild(container);
    }
}