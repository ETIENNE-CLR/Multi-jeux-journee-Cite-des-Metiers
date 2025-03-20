import { MemoryCard, sleep } from "./MemoryCard.js";

export class MemoryGame {
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
		this.cards.forEach(async carte => {
			carte.activate();
			await carte.turnCard('hide');
		});

		await waitWhile(() => this.cards.filter(e => e.DisplayMode == 'show').length < 2);
		let visibledCard = this.cards.filter(e => e.DisplayMode == 'show');
		console.log(visibledCard);		

		// Désactiver les cartes au clic
		this.cards.forEach(carte => {
			carte.desactivate();
		});
		Object.assign(document.body.style, {
			transition: 'background-color 0.2s'
		})
		let originalBg = document.body.style.backgroundColor;
		let time = 1.25;
		
		await sleep(time);
		if (this.#isPair(visibledCard)) {
			// Ce sont des paires
			document.body.style.backgroundColor = 'limegreen';
			this.#hideCard(visibledCard);
			visibledCard.forEach(c => {
				this.cards = this.cards.filter(card => card !== c);
			});
		} else {
			// Ce ne sont pas des paires
			document.body.style.backgroundColor = '#F44336';
			visibledCard.forEach(c => {
				c.turnCard('hide');
			});
		}
		await sleep(time);
		document.body.style.backgroundColor = originalBg;

		// Relancer la "partie"
		this.start();
	}

	#isPair(visibledCard){
		return visibledCard[0].Type == visibledCard[1].Type;
	}

	#hideCard(arrayCard){
		arrayCard.forEach(c => {
			c.retrieve();
		});
	}
}

async function waitWhile(conditionFunction, interval = 100) {
	while (conditionFunction()) {
		await new Promise(resolve => setTimeout(resolve, interval));
	}
}
