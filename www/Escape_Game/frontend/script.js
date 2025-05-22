import { Computer } from "./classes/Computer.js";

// Au chargement de la page...
document.addEventListener('DOMContentLoaded', function () {
	// Init de l'ordi
	let myOrdi = new Computer('screen', 'ESCAPE GAME', 'jsp');
	myOrdi.start();
}, false);
