class MemoryGame {
	cards;

	constructor(jsonCards) {
		this.cards = [];
		const CARD_JSON = jsonCards;
		const languages = Object.keys(CARD_JSON);

		languages.forEach(language => {
			let types = Object.keys(CARD_JSON[language]);
			types.forEach(type => {
				let code = CARD_JSON[language][type];
				this.cards.push(new MemoryCard(language, type, code));
			});
		});
		this.cards.sort(() => Math.random() - 0.5);

		// Afficher les cartes
		let cont = document.body.querySelector('main');
		if (!cont) {
			throw new Error("Le main de la page n'a pas été défini !");
		}
		this.cards.forEach(carte => {
			cont.appendChild(carte.Element);
		});
	}

	async start() {
		// while (this.cards.length > 0) {
		// Jouer un tour
		// Activer les cartes au clic
		this.cards.forEach(carte => {
			carte.activate();
		});

		await waitWhile(() => this.cards.filter(e => e.DisplayMode == 'show').length < 2);
		let visibledCard = this.cards.filter(e => e.DisplayMode == 'show');
		console.log(visibledCard);
		

		// Désactiver les cartes au clic
		this.cards.forEach(carte => {
			carte.desactivate();
		});

		if (this.#isPair(visibledCard)) {
			// Ce sont des paires
		} else {
			// Ce ne sont pas des paires
		}
		

		// }
	}

	#isPair(visibledCard){

	}
}

async function waitWhile(conditionFunction, interval = 100) {
	while (conditionFunction()) {
		await new Promise(resolve => setTimeout(resolve, interval));
	}
}
