import { ChmodConstructor } from "./Others/ChmodConstructor.js";
import { File } from "./Others/File.js";
import { Directory } from "./Others/Directory.js";
import { Website } from "./Others/Website.js";
import { DragDrop } from "./tools/DragDrop.js";
import { FunctionAsset } from "./Tools/FunctionAsset.js";
import { SiteMaker } from "./Tools/SiteMaker.js";
import { Browser } from "./UI/Browser.js";
import { Explorer } from "./UI/Explorer.js";
import { Terminal } from "./UI/Terminal.js";
import { Binary } from "./UI/Binary.js";
import { ZipFile } from "./UI/ZipFile.js";
import { MOT_DE_PASSE_ZIP, TXT_OBJECTIFS } from "./EscapeGameConst.js";

export class Computer {
	#iconPosition;
	username;
	screen;
	#motDePasse;
	#openLogInHandler;
	openedWindows;
	#tree;

	#zipfile;
	#file;

	// applications
	#explorer;
	#browser;
	#terminal;
	#binary;

	get Tree() { return this.#tree }

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
		this.openedWindows = [];

		// Initialisation des applications fictives
		this.#tree = [
			new File('image.png', this, 'bravo', ChmodConstructor(true, false, false)),
			new Directory(`Documents`, [
				new File(`mdp_chiffre`, this, Binary.convertTxtToBin(`Le mot de passe pour le zip : ${MOT_DE_PASSE_ZIP}`), ChmodConstructor(true, false, false))
			])
		];
		this.#terminal = new Terminal(this);
		this.#explorer = new Explorer(this);
		this.#binary = new Binary(this);
		this.#zipfile = new ZipFile('dossier zip', this);
		this.#file = new File(`Objectif de l'escape game`, this, TXT_OBJECTIFS, ChmodConstructor(true, false, false), 'Objectif');

		this.#browser = new Browser(this, [
			new Website("Home", "home.com", SiteMaker.home()),
			new Website("News", "news.com", SiteMaker.news()),
			new Website("Mon forum", "forum.com", SiteMaker.forum()),
			new Website("Ma compagnie", "ma-compagnie.com", SiteMaker.company()),
			new Website("Not found", "not-found", SiteMaker.notFound()),
		]);

		this.#iconPosition = [
			[this.#explorer.desktopIconApp.element, null, null, null, null, this.#file.desktopIconApp.element, this.#zipfile.desktopIconApp.element, null, null],
			[this.#terminal.desktopIconApp.element, null, null, null, null, null, null, null, null],
			[this.#browser.desktopIconApp.element, null, null, null, null, null, null, null, null],
			[this.#binary.desktopIconApp.element, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null]
		];
		this.#file.desktopIconApp.element.querySelector('img').style.backgroundColor = '#fff';

		// Gestionnaire d'événement lié à l'ouverture du login
		this.#openLogInHandler = this.#openLogIn.bind(this);
	}

	zipExtract() {
		// Ajouter le fichier extrait dans Documents
		const dir = this.getContentFromPath('/Documents');
		if (!dir) { throw new Error("Le dossier n'existe pas !") }

		dir.push(new Directory('ContenuZip', [
			new File('image_bizarre.png', this, 'Bravo vous avez réussi !', ChmodConstructor(true, false, false))
		]));
	}

	start() {
		// Fond d'écran
		this.screen.style.backgroundImage = 'url("assets/wallpaper_lock.jpg")';

		// Afficher la date et l'heure
		this.#addToScreen(this.#createDateTimeContainer());

		// Activer l'interaction
		this.screen.addEventListener('click', this.#openLogInHandler);
	}

	#createDateTimeContainer() {
		const dateTimeCont = document.createElement('div');
		this.#addToScreen(dateTimeCont);
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
		this.#addToScreen(this.#createLoginContainer());
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

	#addToScreen(elem) {
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

	#addAppClickListener(app, openFunction) {
		app.addEventListener('click', () => {
			app.removeEventListener('click', openFunction);
			openFunction.call(this);
		});
	}

	openDesktop() {
		const ICON_SIZE = Math.floor(this.screen.clientWidth / this.#iconPosition[0].length);

		const table = document.createElement('table');
		table.id = 'desktop';
		for (let row = 0; row < this.#iconPosition.length; row++) {
			const tr = document.createElement('tr');

			for (let col = 0; col < this.#iconPosition[row].length; col++) {
				const colElem = this.#iconPosition[row][col];
				const cell = document.createElement('td');
				FunctionAsset.applyStyle(cell, {
					boxSizing: 'border-box',
					width: `${ICON_SIZE}px`,
					height: `${ICON_SIZE}px`,
					margin: '0',
					padding: '0',
				});
				if (colElem) {
					// Ajouter le drag sur les applications bureau
					colElem.id = "desktop-icon-" + Math.random().toString(36).substr(2, 9);
					colElem.draggable = true;
					colElem.addEventListener('dragstart', DragDrop.dragstartHandler);
					cell.appendChild(colElem);
				}
				tr.appendChild(cell);
				// Ajout du drop sur les autres emplacements
				cell.addEventListener('dragover', (e) => {
					DragDrop.dragstartHandler(e);
					// saveIconPosition();
				});
				cell.addEventListener('drop', DragDrop.dropHandler);
			}
			table.appendChild(tr);
		}
		this.#addToScreen(table);
	}

	/**
	 * Fonction pour récupérer tous les dossiers et tous les fichiers
	 * qui sont présents dans le chemin
	 * @returns {Array} Tableau contenant des dossiers et/ou des fichiers
	 */
	getContentFromPath(path) {
		if (path === "/") {
			return this.#tree;
		}

		// Chercher dans les enfants
		let actualPathArray = path.split('/').filter(Boolean);
		let currentContent = this.#tree;
		let content = null;

		for (let segment of actualPathArray) {
			// Chercher le dossier ou fichier correspondant au segment
			content = currentContent.find(child => child.name === segment);

			// On regarde ses enfants
			if (content instanceof Directory) {
				currentContent = content.getChildren();
				content = currentContent;
			} else if (content instanceof File) {
				// C'est un fichier
				break;
			} else {
				// Chemin invalide
				content = null;
				break;
			}
		}
		return content;
	}

	sortPath(content) {
		let directories = content
			.filter(e => e instanceof Directory)
			.sort((a, b) => a.name.localeCompare(b.name));

		let files = content
			.filter(e => e instanceof File)
			.sort((a, b) => a.name.localeCompare(b.name));

		return [...directories, ...files];
	}
}
