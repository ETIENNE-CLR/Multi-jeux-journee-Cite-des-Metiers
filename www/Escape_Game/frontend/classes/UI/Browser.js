import { DesktopIconApp } from "../Others/IconApp.js";
import { FunctionAsset } from "../Tools/FunctionAsset.js";
import { SiteMaker } from "../Tools/SiteMaker.js";
import { WindowApp } from "../UI/WindowApp.js";

export class Browser extends WindowApp {
	#urls;
	currentUrl;
	#history;
	#inpt_url;

	get URLs() { return this.#urls }

	constructor(computerElement, urls = []) {
		super('Navigateur internet', computerElement, new DesktopIconApp('assets/browser.png', 'Navigateur'))
		this.#urls = urls;
		this.currentUrl = "";
		this.#history = [];

		// UI de base
		const header = document.createElement('div');
		header.id = 'header-browser';
		FunctionAsset.applyStyle(header, {
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'nowrap',
			justifyContent: 'space-evenly',
			alignItems: 'center',
			borderBottom: '2px solid grey',
			padding: '0.5% 0',
			marginBottom: '1%'
		});
		this.innerFrame.appendChild(header);

		// Bouton de retour
		[
			"left",
			// "right",
			"repeat"
		].forEach(name => {
			const btn = document.createElement('button');
			FunctionAsset.applyStyle(btn, {
				border: 'none'
			});
			btn.innerHTML = `<i class="bi bi-arrow-${name}"></i>`;
			btn.addEventListener('click', () => {
				const getNb = (theClass) => {
					switch (theClass) {
						case "left":
							return 2;
						case "repeat":
							return 1;
					}
				}
				this.goTo(this.#history[this.#history.length - getNb(name)], false);
			});
			header.appendChild(btn);
		});
		this.updateViewButtons();

		// Afficher l'URL
		this.#inpt_url = document.createElement('input');
		this.#inpt_url.placeholder = "Effectuer une recherche";
		this.#inpt_url.setAttribute('type', 'text');
		FunctionAsset.applyStyle(this.#inpt_url, {
			border: 'none',
			backgroundColor: 'lightgrey',
			padding: '0.3% 1.5%',
			borderRadius: '12px',
			fontSize: '14px',
			width: '77%'
		});
		header.appendChild(this.#inpt_url);
		this.#inpt_url.addEventListener('change', () => {
			this.goTo(this.#inpt_url.value);
		});
	}

	/**
	 * Méthode qui permet de désactiver les boutons à gauche de la barre URL
	 * En fonction de cas
	 */
	updateViewButtons() {
		let icons = this.innerFrame.querySelectorAll('#header-browser .bi');
		if (icons) {

			icons.forEach(icon => {
				let btn = icon.parentElement;
				if (btn) {
					btn.disabled = (this.#history.length < 1 || this.#history > 0);
				}
			});
		}
	}

	/**
	 * Méthode qui permet d'aller vers une autre page
	 * @param {String} search Vers où on va aller sur le navigateur
	 * @param {Boolean} updateHistory Si on doit mettre à jour l'historique
	 */
	goTo(search, updateHistory = true) {
		search = search.trim().toLowerCase()
		this.#inpt_url.value = search;

		// Récupérer le corps
		let corps = this.innerFrame.querySelector('#corps-browser');
		if (!corps) {
			corps = document.createElement('div');
			corps.id = "corps-browser";
			FunctionAsset.applyStyle(corps, {
				padding: '0 0.5%'
			});
			this.innerFrame.appendChild(corps);
		}

		// Page d'accueil
		if (search == undefined) {
			corps.appendChild(SiteMaker.research(search, this));
			return;
		}

		// Effectuer la recherche - l'utilisateur a entré une URL valide
		let websiteFound = this.#urls.find(x => x.url == search);

		// Afficher le resultat
		corps.innerHTML = '';
		if (websiteFound) {
			// C'est un site
			corps.appendChild(websiteFound.body);
			this.Title = `Navigateur internet - ${websiteFound.name}`;

			if (this.currentUrl != websiteFound.url) {
				this.currentUrl = websiteFound.url;
			}
		} else {
			// C'est une recherche
			corps.appendChild(SiteMaker.research(search, this));
			this.Title = `Navigateur internet - recherche ${search}`;

			if (this.currentUrl != search) {
				this.currentUrl = search;
			}
		}

		// enregistrer dans l'historique
		if (updateHistory) {
			this.#history.push(this.currentUrl);
		}
		this.updateViewButtons();
	}

	open() {
		this._openBase();
		this.goTo("home.com", false);
	}
}