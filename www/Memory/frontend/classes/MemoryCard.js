class MemoryCard {
	#element;
	#language;
	#type;
	#content;
	
	get Element() { return this.#element }
	get Language() { return this.#language }
	get Type() { return this.#type }
	get Content() { return this.#content }
	
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
		this.displayCard();
	}
	
	displayCard(){
		this.#element.innerHTML = '';
		this.#element.classList.add('displayed');
		const lbl_language = document.createElement('h1');
		lbl_language.className = 'h2';
		lbl_language.innerText = this.Language;
		this.#element.appendChild(lbl_language);

		const p_code = document.createElement('p');
		p_code.innerText = this.Content;
		Object.assign(p_code.style, {
			fontSize: `${Math.max(10, 25 - p_code.innerText.length / 2)}px`
		});
		this.#element.appendChild(p_code);
	}
}