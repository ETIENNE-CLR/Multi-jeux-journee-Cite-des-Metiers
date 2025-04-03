export class Tools {
	static async fetch(url) {
		try {
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`Erreur HTTP : ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error("Erreur lors de la récupération des données :", error.message);
			throw new Error("Erreur lors de la récupération des données");
		}
	}

	/**
	 * Génère un entier aléatoire entre min et max (inclus).
	 * @param {number} min - La valeur minimale (incluse).
	 * @param {number} max - La valeur maximale (incluse).
	 * @returns {number} Un entier aléatoire entre min et max.
	 */
	static getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static getRandomValueFromList(list) {
		return list[this.getRandomInt(0, list.length - 1)];
	}

	static shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	static generateUniqueId() {
		return 'piece-' + Math.random().toString(36).substr(2, 9);
	}
}