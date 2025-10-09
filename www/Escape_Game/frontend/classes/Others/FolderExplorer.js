export class FolderExplorer {
	name;
	children;
	
	constructor(name, children = []) {
		this.name = name;
		this.children = children;
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
