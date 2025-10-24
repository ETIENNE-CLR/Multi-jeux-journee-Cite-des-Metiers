import { ChmodConstructor } from "./ChModConstructor.js";

export class Directory {
	name;
	children;
	chmod;
	
	constructor(name, children = [], chmod = ChmodConstructor(true, true, false)) {
		this.name = name;
		this.children = children;
		this.chmod = chmod;
	}

	// Ajouter un enfant (dossier ou fichier)
	addChild(child) {
		this.children.push(child);
	}

	// Récupérer tous les fichiers et dossiers enfants
	getChildren() {
		return this.children;
	}
}
