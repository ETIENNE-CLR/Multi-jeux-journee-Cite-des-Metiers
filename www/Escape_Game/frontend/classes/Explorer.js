class FileExplorer extends WindowApp {
    tree;
    actualPath;
    #mainBody;

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
        aside.className = 'col-3 p-2';
        aside.innerHTML = '<p>Aside</p>';
        this.innerFrame.appendChild(aside);
        FunctionAsset.applyStyle(aside, {
            borderRight: '1px solid lightgrey'
        });

        // Côté droit
        this.#mainBody = document.createElement('div');
        this.#mainBody.className = 'col-9 p-2';
        this.innerFrame.appendChild(this.#mainBody);
    }

    open() {
        this._openBase();
        this.viewPath(this.actualPath);
    }

    viewPath() {
        const container = document.createElement('div');

        // Afficher le chemin absolue
        const divPath = document.createElement('div');
        divPath.innerText = this.actualPath;
        container.appendChild(divPath);
        FunctionAsset.applyStyle(divPath, {
        });

        Array.from(this.tree).forEach(file => {
        });

        // Réafficher la vue
        this.#mainBody.innerHTML = '';
        this.#mainBody.appendChild(container);
    }
}