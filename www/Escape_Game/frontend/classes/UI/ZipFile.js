import { MOT_DE_PASSE_ZIP } from "../EscapeGameConst.js";
import { IconApp } from "../Others/IconApp.js";
import { WindowApp } from "./WindowApp.js";

export class ZipFile extends WindowApp {
    constructor(name, computerElement) {
        super(name, computerElement, new IconApp('assets/zip-file.png', 'zip'))

        // Création du contenu de la fenêtre
        const container = document.createElement('div');
        this.innerFrame.appendChild(container);
        Object.assign(container.style, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // backgroundColor: 'red',
            height: '35vh',
            gap: '1%'
        });

        const inpt_mdp = document.createElement('input');
        inpt_mdp.type = 'text';
        container.appendChild(inpt_mdp);
        inpt_mdp.addEventListener('input', () => {
            if (inpt_mdp.style.color !== 'black') {
                inpt_mdp.style.color = 'black';
            }
        });
        
        const btn_valid = document.createElement('button');
        btn_valid.textContent = 'Valider';
        container.appendChild(btn_valid);
        
        btn_valid.addEventListener('click', () => {
            let mdp = inpt_mdp.value.trim();
            let mdpCorrect = (mdp === MOT_DE_PASSE_ZIP);
            // alert('Mot de passe ' + (mdpCorrect ? 'correct' : 'incorrect') + ' !');
            if (!mdpCorrect) {
                inpt_mdp.style.color = 'red';
                return;
            }

            // Mdp correct
            inpt_mdp.remove();
            btn_valid.remove();

            const msgSuccess = document.createElement('p');
            msgSuccess.textContent = `Le fichier a été extrait dans 'Documents/ContenuZip'`;
            container.appendChild(msgSuccess);
            computerElement.zipExtract();
        });
    }
}