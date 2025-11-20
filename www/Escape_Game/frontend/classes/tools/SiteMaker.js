import { Browser } from "../UI/Browser.js";
import { FunctionAsset } from "./FunctionAsset.js";

export class SiteMaker {
	static home() {
		const body = document.createElement('div');
		body.innerHTML = `
        <div class="container mt-5">
            <h1 class="text-center">IntraNet – Accueil</h1>
            <p class="mt-3 text-center">
                Bienvenue sur l’IntraNet local. Utilisez la barre d’adresse
                pour parcourir les différents sites disponibles.
            </p>

            <div class="alert alert-info mt-4">
                Astuce : si vous laissez la barre de recherche vide et validez, 
                vous verrez tous les sites installés sur la machine.
            </div>

            <p class="text-center mt-3">
                Bon courage, utilisateur.
            </p>
        </div>
		`;
		return body;
	}

	static forum() {
		const body = document.createElement('div');
		body.innerHTML = `
        <div class="container mt-4">
            <h1>Underground Forum</h1>

            <p class="text-muted">Un vieux forum rétro retrouvé dans le système…</p>

            <div class="card mt-3">
                <div class="card-body">
                    <h5 class="card-title">User: CorruptedFile42</h5>
                    <p class="card-text">
                        J’ai un fichier qui devrait afficher une image… mais il ne montre rien.
                        Quelqu’un sait pourquoi ?
                    </p>
                </div>
            </div>

            <div class="card mt-3">
                <div class="card-body">
                    <h5 class="card-title">Réponse: TerminalGeek</h5>
                    <p class="card-text">
                        Si l’image s'affiche pas, elle est sûrement “corrompue”.<br>
                        En vrai, c’est peut-être juste une <strong>mauvaise extension</strong>.<br>
						<b>Dans le terminal,</b> tu peux renommer un fichier avec la commande <code>mv</code> :<br>
						<code>mv fichierDeBase fichierRenomme</code>
                    </p>
                </div>
            </div>

			<div class="card mt-3">
                <div class="card-body">
                    <h5 class="card-title">Réponse: TerminalGeek</h5>
                    <p class="card-text">
                        Si tu as besoin de plus d'aide pour utiliser un terminal va sur "tout-sur-le-terminal.com". C'est un bon site pour t'expliquer les bases !
                    </p>
                </div>
            </div><br>
        </div>
		`;
		return body;
	}

	static help() {
		const body = document.createElement('div');
		body.innerHTML = `
        <div class="container mt-4">
            <h1>Centre d'Aide</h1>
            <p class="text-muted">Quelques conseils pour vous aider à progresser.</p>

            <div class="card mt-3">
                <div class="card-body">
                    <h5 class="card-title">Binaire</h5>
                    <p class="card-text">
						Le code binaire est une encryption de caratères. Le binaire est une suite de <code>0</code> et de <code>1</code>.
						On peut facilement utiliser un convertisseur pour le décoder.
                    </p>
                </div>
            </div>
        </div>
		`;
		return body;
	}

	static allAboutTerminal() {
		const body = document.createElement('div');
		body.innerHTML = `
        <div class="container mt-4">
			<h1>Tout sur le Terminal</h1>
			<p class="text-muted">Un guide rapide pour comprendre les bases du terminal.</p>

			<div class="card mt-3">
				<div class="card-body">
					<h5 class="card-title">📁 Se déplacer</h5>
					<p class="card-text">
						<code>cd dossier</code> – entrer dans un dossier<br>
						<code>cd ..</code> – revenir en arrière<br>
						<code>pwd</code> – afficher votre position actuelle
					</p>
				</div>
			</div>

			<div class="card mt-3">
				<div class="card-body">
					<h5 class="card-title">📚 Voir les fichiers</h5>
					<p class="card-text">
						<code>ls</code> – liste les fichiers<br>
						<code>ll</code> – liste détaillée
					</p>
				</div>
			</div>

			<div class="card mt-3">
				<div class="card-body">
					<h5 class="card-title">🛠 Manipuler fichiers et dossiers</h5>
					<p class="card-text">
						<code>mkdir nom</code> – créer un dossier<br>
						<code>touch nom</code> – créer un fichier vide<br>
						<code>rm fichier</code> – supprimer un fichier<br>
						<code>mv a b</code> – renommer / déplacer un fichier
					</p>
				</div>
			</div>

			<div class="card mt-3">
				<div class="card-body">
					<h5 class="card-title">📄 Lire</h5>
					<p class="card-text">
						<code>cat fichier</code> – afficher le contenu<br>
					</p>
				</div>
			</div>

			<div class="card mt-3">
				<div class="card-body">
					<h5 class="card-title">🔒 Permissions (optionnel)</h5>
					<p class="card-text">
						<code>chmod</code> – changer les droits d’un fichier<br>
						<code>4</code> vaut pour la valeur de lecture<br>
						<code>2</code> vaut pour la valeur d'écriture<br>
						<code>1</code> vaut pour la valeur d'execution<br>
						<br>
						<hr>
						<br>

						Exemple :
						<code>chmod 6</code> : permissions de lecture et d'écriture<br>
						<code>chmod 3</code> : permissions d'écriture et d'execution<br>
						<code>chmod 5</code> : permissions de lecture et d'execution<br>
					</p>
				</div>
			</div>

			<div class="card mt-3">
				<div class="card-body">
					<h5 class="card-title">👤 Utilisateur & historique</h5>
					<p class="card-text">
						<code>whoami</code> – afficher l’utilisateur actuel<br>
						<code>history</code> – afficher les dernières commandes
					</p>
				</div>
			</div>

			<p class="mt-4 text-muted text-center">
				Ces commandes suffisent pour explorer, lire, renommer ou manipuler les fichiers du système.<br>
				À vous de trouver comment en tirer parti…
			</p>
		</div>
		`;
		return body;
	}

	/**
	 * Méthode qui permet de rechercher les sites disponibles en fonction d'une recherche (recherche en dure)
	 * @param {String} search La recherche du site
	 * @param {Browser} browser Le browser qui recherche la page
	 * @returns {HTMLElement} Contenu du body de la fenetre
	 */
	static research(search, browser) {
		let results = [];

		// Récupérer les correspondances
		browser.URLs.forEach(website => {
			console.log(website.url, search);			
			if (website.url.includes(search)) {
				results.push(website);
			}
		});

		// Afficher les resultats - Résultat de la recherche
		const body = document.createElement('div');
		body.className = "col-10 ms-4";
		results.forEach(resultat => {
			const container = document.createElement('div');
			container.className = "item-site-browser mb-5"
			body.appendChild(container);

			// Partie du haut
			const aside = document.createElement('div');
			aside.className = "mb-1";
			FunctionAsset.applyStyle(aside, {
				display: 'flex',
				flexDirection: 'row'
			});
			container.appendChild(aside);

			const logo = document.createElement('img');
			logo.src = 'assets/citeMetierLogo.png';
			logo.alt = 'logo';
			FunctionAsset.applyStyle(logo, {
				width: '8%',
				borderRadius: '9999px',
				transform: 'scale(0.65)'
			});
			aside.appendChild(logo);

			const containerText = document.createElement('div');
			FunctionAsset.applyStyle(containerText, {
				display: 'flex',
				flexDirection: 'column'
			});
			aside.appendChild(containerText);

			const text1 = document.createElement('span');
			FunctionAsset.applyStyle(text1, {
				fontSize: '18px'
			});
			text1.innerText = resultat.name;
			containerText.appendChild(text1);

			const text2 = document.createElement('span');
			text2.className = "text-muted";
			FunctionAsset.applyStyle(text2, {
				fontSize: '13px'
			});
			text2.innerText = resultat.url;
			containerText.appendChild(text2);


			// Partie du bas
			const content = document.createElement('div');
			content.className = "ps-1";
			container.appendChild(content);

			const btn_link = document.createElement('button');
			btn_link.type = "button";
			btn_link.className = "btn btn-link m-0 p-0";
			btn_link.innerText = `Site de ${resultat.name}`;
			content.appendChild(btn_link);
			btn_link.addEventListener('click', () => {
				browser.goTo(resultat.url); // Aller à la page
			});

			const p_desc = document.createElement('p');
			p_desc.className = "text-muted";
			p_desc.innerText = "Une description du site ? Flemme, c'est un pseudo navigateur pour la cité des métiers.";
			content.appendChild(p_desc);
		});
		return body;
	}
}