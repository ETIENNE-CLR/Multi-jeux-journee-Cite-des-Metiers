import { FunctionAsset } from "../Tools/FunctionAsset.js";

/**
 * Classe WindowApp
 * Cette classe représente une fenêtre d'application sur un bureau virtuel.
 */
export class WindowApp {
	title;
	desktopIconApp;
	#computerElement; // J'ai recement rendu ce champ privé, jsp si ça va faire des erreurs...
	innerFrame;
	_element;
	#indexOpenedWindow;

	set Title(value) {
		this._element.querySelector('span').innerText = value;
	}

	/**
	 * Constructeur de la classe WindowApp.
	 * Permet de créer une fenêtre avec différents paramètres selon les besoins.
	 * @param {string} title - Le titre de la fenêtre.
	 * @param {Computer} computerElement - L'ordinateur associée
	 * @param {DesktopIconApp} [iconApp] - (Optionnel) Une icône associée à la fenêtre.
	 */
	constructor(title, computerElement, iconApp = null) {
		this.title = title;
		this.#computerElement = computerElement;
		this.desktopIconApp = iconApp;
		this.#indexOpenedWindow = null;
		this.innerFrame = document.createElement('div');
		FunctionAsset.applyStyle(this.innerFrame, {
			backgroundColor: 'white',
			minHeight: '400px'
			// backgroundColor: '#efefef' // Teinte gris très blanc
		});

		// Créer la fenêtre
		this._element = document.createElement('div');
		FunctionAsset.applyStyle(this._element, {
			width: '-webkit-fill-available',
			display: 'flex',
			flexDirection: 'column'
		});

		// Ajouter les bordures + le contenu
		this.#initWindowBorder();
		this._element.appendChild(this.innerFrame);
		this.#activeOpenApp();
	}

	/**
	 * Méthode privée pour initialiser la bordure de la fenêtre.
	 * Crée un élément DOM principal
	 */
	#initWindowBorder() {
		// Container de base
		const border = document.createElement('div');
		this._element.appendChild(border);
		FunctionAsset.applyStyle(border, {
			display: 'flex',
			alignItems: 'center',
			backgroundColor: 'white',
			padding: '0.2%',
			width: '-webkit-fill-available',
			justifyContent: 'space-between',
			flexDirection: 'row',
			borderBottom: '1px solid lightgrey'
		});

		// Container pour le texte
		const pTitle = document.createElement('span');
		pTitle.innerText = this.title;
		pTitle.style.padding = '0 1%';
		border.appendChild(pTitle);

		// Container des boutons
		const btn_window_options = document.createElement('div');
		btn_window_options.className = 'd-flex gap-2';
		FunctionAsset.applyStyle(btn_window_options, {
			display: 'flex',
			width: 'fit-content',
			justifyContent: 'flex-end',
		});
		border.appendChild(btn_window_options);

		const btn_dash = document.createElement('i');
		btn_dash.className = 'bi bi-dash';
		FunctionAsset.applyStyle(btn_dash, { margin: '0 5px', cursor: 'pointer' });
		btn_window_options.appendChild(btn_dash);

		const btn_copy = document.createElement('i');
		btn_copy.className = 'bi bi-copy disabled';
		FunctionAsset.applyStyle(btn_copy, { margin: '0 5px', cursor: 'pointer' });
		btn_window_options.appendChild(btn_copy);

		const btn_delete = document.createElement('i');
		btn_delete.className = 'bi bi-x-lg';
		FunctionAsset.applyStyle(btn_delete, { margin: '0 5px', cursor: 'pointer' });
		btn_window_options.appendChild(btn_delete);

		// Pour fermer l'application
		btn_dash.addEventListener('click', () => {
			this.close();
		});
		btn_delete.addEventListener('click', () => {
			this.close();
		});
	}

	#activeOpenApp() {
		this.desktopIconApp.element.addEventListener('click', () => {
			this.open();
		});
	}

	open() {
		this._openBase();
	}

	close() {
		this._closeBase();
	}

	_openBase() {
		if (this.#indexOpenedWindow == null) {
			this.#indexOpenedWindow = this.#computerElement.openedWindows.length;
			this.#computerElement.openedWindows[this.#indexOpenedWindow] = this;
		}	

		// ui
		this.#computerElement.clearScreen();
		this.#computerElement.screen.appendChild(this._element);
	}

	_closeBase() {
		this._element.remove();
		this.#computerElement.openedWindows.splice(this.#indexOpenedWindow, 1);
		this.#indexOpenedWindow = null;

		this.#computerElement.openDesktop();
		if (this.#computerElement.openedWindows.length > 0) {
			this.#computerElement.openedWindows[this.#computerElement.openedWindows.length - 1].open();
		}
	}
}
