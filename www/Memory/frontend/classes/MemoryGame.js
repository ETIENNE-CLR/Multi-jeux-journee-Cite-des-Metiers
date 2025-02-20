class MemoryGame {
	cards;
	nbCardDisplayed;
	
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
}