import { MemoryGame } from "./classes/MemoryGame.js";

// Au chargement de la page...
document.addEventListener('DOMContentLoaded', async function () {
	// Initialisation des cartes
	let game = new MemoryGame(await fetchCardContent());
	game.start();
});

async function fetchCardContent() {
	try {
		const response = await fetch('frontend/boutDeCode.json');
		if (!response.ok) {
			throw new Error("Erreur lors de la récupération des données");
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
	}
}
