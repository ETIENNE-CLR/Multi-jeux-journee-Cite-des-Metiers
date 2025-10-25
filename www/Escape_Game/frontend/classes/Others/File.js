import { FunctionAsset } from "../Tools/FunctionAsset.js";
import { WindowApp } from "../UI/WindowApp.js";
import { ChmodConstructor, parseChmod } from "./ChmodConstructor.js";
import { DesktopIconApp } from "./IconApp.js";

export class File extends WindowApp {
	name;
	content;
	chmod;

	constructor(name, computerElement, content = "", chmod = ChmodConstructor(true, true, false)) {
		super(`Edition - ${name}`, computerElement, new DesktopIconApp('assets/file.png', name));
		this.name = name;
		this.content =content;
		this.chmod = chmod;
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
		textArea.value = this.content;
		textArea.addEventListener('change', () => {
			if (!parseChmod(this.chmod).write) {
				alert("Vous n'avez pas la permission d'écrire dans ce fichier.");
				textArea.value = this.content;
				return;
			}
			this.content = textArea.value;
		});
	}

	open() {
		if (!parseChmod(this.chmod).read) {
			alert("Vous n'avez pas la permission de lire ce fichier.");
			return;
		}
		this._openBase();
		this.displayView();
	}
}
