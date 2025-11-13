import { IconApp } from "../Others/IconApp.js";
import { FunctionAsset } from "../Tools/FunctionAsset.js";
import { WindowApp } from "./WindowApp.js";

export class Binary extends WindowApp {
    constructor(computerElement) {
        super('Convert10 - Convertisseur de code Binaire', computerElement, new IconApp('assets/binary.png', 'Convert10'))
        this.#initForm();
    }

    async #initForm() {
        this.innerFrame.classList.add('convert10');

        // Créer le conteneur
        const main = document.createElement('main');
        main.style.display = 'flex';
        main.style.height = '20em';
        this.innerFrame.appendChild(main);

        // Côté gauche
        const leftSide = document.createElement('div');
        leftSide.className = 'col-6 p-2';
        main.appendChild(leftSide);
        FunctionAsset.applyStyle(leftSide, {
            borderRight: '1px solid lightgrey'
        });

        // Côté droit
        const rightSide = document.createElement('div');
        rightSide.className = 'col-6 p-2';
        main.appendChild(rightSide);

        // Init
        const viewInfo = {
            titleType: 'h4',
            activClass: 'A convertir',
            binaire: {
                title: 'Code Binaire',
                area: 'binArea',
            },
            text: {
                title: 'Zone de texte',
                area: 'txtArea',
            }
        };

        let activClassId = () => {
            return viewInfo.activClass.toLowerCase().replaceAll(' ', '_')
        }

        const binArea = addSection(viewInfo.binaire, leftSide);
        const txtArea = addSection(viewInfo.text, rightSide);
        main.querySelectorAll(viewInfo.titleType)[0].click();

        function addSection(json, side) {
            // Titre de section
            const title = document.createElement(viewInfo.titleType);
            title.innerText = json.title;
            title.style.cursor = 'pointer';
            side.appendChild(title);

            // Zone de texte binaire
            const area = document.createElement('textarea');
            area.name = json.area;
            area.id = json.area;
            side.appendChild(area);

            // Event
            title.addEventListener('click', () => {
                // Supp tous
                main.querySelectorAll(viewInfo.titleType).forEach(t => {
                    let b = t.querySelector('span')
                    if (b) { b.remove() }
                });
                main.querySelectorAll('textarea').forEach(t => {
                    if (t.className.includes(activClassId())) { t.classList.remove(activClassId()) }
                    t.disabled = true;
                });

                // Ajout du badge
                const sb = document.createElement('span');
                sb.className = `badge text-bg-success`;
                sb.innerText = viewInfo.activClass;
                title.appendChild(sb);

                // Maj textarea
                area.classList.add(activClassId());
                area.disabled = false;
            });
            return area;
        }

        // Btn convertir
        await FunctionAsset.sleep(0.001);
        const btnConvert = document.createElement('button');
        btnConvert.innerText = 'Convertir';
        this.innerFrame.appendChild(btnConvert);

        // Fonction de convertion
        btnConvert.addEventListener('click', () => {
            const isBinEmpty = binArea.value.trim() === '';
            const isTxtEmpty = txtArea.value.trim() === '';

            // Détection du sens de conversion
            if (txtArea.className.includes(activClassId())) {
                binArea.value = Binary.convertTxtToBin(txtArea.value.trim());
            } else {
                txtArea.value = Binary.convertBinToTxt(binArea.value.trim());
            }
        });
    }

    static convertBinToTxt(bin) {
        // coupe par octets et convertit chaque 8 bits en caractère
        return bin
            .split(' ')
            .map(byte => String.fromCharCode(parseInt(byte, 2)))
            .join('');
    }

    static convertTxtToBin(txt) {
        // transforme chaque caractère en code binaire sur 8 bits
        return txt
            .split('')
            .map(c => c.charCodeAt(0).toString(2).padStart(8, '0'))
            .join(' ');
    }
}