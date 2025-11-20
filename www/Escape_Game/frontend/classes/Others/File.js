import { ImageExtension } from "../Computer.js";
import { FunctionAsset } from "../Tools/FunctionAsset.js";
import { WindowApp } from "../UI/WindowApp.js";
import { ChmodConstructor, parseChmod } from "./ChmodConstructor.js";
import { IconApp } from "./IconApp.js";

export class File extends WindowApp {
	name;
	content;
	chmod;

	set Title(value) {
		let perm = parseChmod(this.chmod).write ? 'Edition' : 'Lecture';
		this.title = `${perm} - ${value}`;
		this._element.querySelector('span').innerText = this.title;
	}

	set Name(value) {
		this.name = value;
		this.Title = value;
		this.desktopIconApp.Title = value;
		this.WindowApp
	}

	constructor(name, computerElement, content = "", chmod = ChmodConstructor(true, true, false), littleName = null) {
		super(`Edition - ${name}`, computerElement, new IconApp('assets/file.png', (!littleName ? name : littleName)));
		this.name = name;
		this.content = content;
		this.chmod = chmod;
		this.Title = name;
	}

	displayView() {
		if (ImageExtension.some(e => this.name.toLowerCase().endsWith(e))) {
			let img = this.innerFrame.querySelector('img');
			if (!img) {
				this.innerFrame.innerHTML = '';
				img = document.createElement('img');
				this.innerFrame.appendChild(img);
				FunctionAsset.applyStyle(img, {
					width: '100%',
					height: '38vh',
					backgroundColor: 'rgb(34, 34, 34)',
					display: 'block'
				});
				this.innerFrame.style.height = 'auto';
			}

		} else {
			let textArea = this.innerFrame.querySelector('textarea');
			if (!textArea) {
				this.innerFrame.innerHTML = '';
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

			let isdemanded = false;
			textArea.addEventListener('change', () => {
				if (!parseChmod(this.chmod).write) {
					if (!isdemanded) {
						isdemanded = true;
						alert("Vous n'avez pas la permission d'écrire dans ce fichier.");
						isdemanded = false;
					}
					textArea.value = this.content;
					return;
				}
				this.content = textArea.value;
			});
		}
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
