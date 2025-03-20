export class MemoryCard {
	#element;
	#language;
	#type;
	#content;
	#displayMode;

	get Element() { return this.#element }
	get Language() { return this.#language }
	get Type() { return this.#type }
	get Content() { return this.#content }
	get DisplayMode() { return this.#displayMode }

	constructor(language, type, content) {
		this.#language = language;
		this.#type = type;
		this.#content = '';
		content.forEach(ligne => {
			this.#content += ligne + '\r';
		});

		// Création de la carte
		this.#element = document.createElement('div');
		this.#element.className = 'memoryCard';
		Object.assign(this.#element.style, {
			transform: 'rotateY(180deg)',
			transition: 'all 0.5s'
		});
	}

	#displayCard() {
		this.#element.innerHTML = '';
		this.#element.classList.add('displayed');
		const lbl_language = document.createElement('h1');
		lbl_language.className = 'h2';
		lbl_language.innerText = this.Language;
		this.#element.appendChild(lbl_language);

		const p_code = document.createElement('p');
		p_code.innerText = this.Content;
		Object.assign(p_code.style, {
			fontSize: `${Math.max(15, 25 - p_code.innerText.length / 2)}px`
		});
		this.#element.appendChild(p_code);
	}

	async #turnCard(mode) {
		if (this.#displayMode == mode) { return }
		this.#displayMode = mode;
		let timer = 0.1;

		switch (this.#displayMode) {
			case 'show':
				this.#element.style.transform = 'rotateY(360deg)'
				await sleep(timer)
				this.#displayCard();
				break;

			case 'hide':
				this.#element.style.transform = 'rotateY(180deg)'
				await sleep(timer)
				this.#element.innerHTML = '';
				break;

			default:
				throw new Error("Ce mode d'affichage n'existe pas :", this.#displayMode);
		}
	}

	#handle = () => {
		this.#turnCard('show');
	};

	activate() {
		this.#element.addEventListener('click', this.#handle);
	}
	desactivate() {
		this.#element.removeEventListener('click', this.#handle);
	}
	async retrieve() {
		let anim = 1.5;
		this.#element.style.animation = `retrieve ${anim}s ease-in forwards`;
		await sleep(anim);
		this.#element.remove();
	}
}

function sleep(secondes) {
	return new Promise(resolve => setTimeout(resolve, secondes * 1000));
}
