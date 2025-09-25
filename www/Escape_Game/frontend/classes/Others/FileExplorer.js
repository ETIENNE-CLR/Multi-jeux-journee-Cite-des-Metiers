import { FunctionAsset } from "../Tools/FunctionAsset.js";
import { WindowApp } from "../UI/WindowApp.js";
import { DesktopIconApp } from "./IconApp.js";

export class FileExplorer extends WindowApp {
	name;
	content;

	constructor(name, computerElement, content = "") {
		super(`Edition - ${name}`, computerElement, new DesktopIconApp('assets/file.png', name));
		this.name = name;
		this.setContent(content);
	}

	// Lire le contenu du fichier
	getContent() {
		return this.content;
	}

	// Modifier le contenu du fichier
	setContent(newContent) {
		this.content = newContent;
	}

	displayView() {
		let textArea = this.innerFrame.querySelector('textarea');
		if (!textArea) {
			textArea = document.createElement('textarea');
			FunctionAsset.applyStyle(textArea, {
				resize: 'none',
				width: '100%',
				padding: '0.5% 1%',
				height: 'inherit',
				border: 'none'
			});
			textArea.classList.add('editor');
			this.innerFrame.appendChild(textArea);
			this.innerFrame.style.height = '400px';
		}
		textArea.value = this.getContent();
		textArea.addEventListener('change', () => {
			let content = textArea.value;
			this.setContent(content);
		});
	}

	open() {
		this._openBase();
		this.displayView();
	}
}
