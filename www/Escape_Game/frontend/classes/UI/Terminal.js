import { FolderExplorer } from "../Others/FolderExplorer.js";
import { DesktopIconApp } from "../Others/IconApp.js";
import { FunctionAsset } from "../Tools/FunctionAsset.js";
import { WindowApp } from "./WindowApp.js";

export class Terminal extends WindowApp {
    #pwd;
    #commandName;
    #explorer;

    get Pwd() { return this.#pwd }
    get ValideCommand() { return this.#commandName }

    constructor(pwd, explorer, computerElement) {
        super('Terminal de commande', computerElement, new DesktopIconApp('assets/terminal.png', 'Terminal'))
        this.#pwd = pwd;
        this.#explorer = explorer;

        // Commandes valides
        this.#commandName = [
            'cd', 'mkdir', 'pwd', 'ls',
            'rm', 'cp', 'mv', 'cat',
            'touch', 'echo', 'whoami'
        ];

        // Couleur de fond
        Object.assign(this.innerFrame.style, {
            backgroundColor: 'rgb(12 12 12)'
        });

        // Textarea
        const area = document.createElement('div');
        area.id = 'area_cmd';
        area.contentEditable = "false";
        area.style.height = this.innerFrame.style.minHeight
        this.innerFrame.appendChild(area);
    }

    open() {
        this._openBase();
        if (this.innerFrame.querySelector('div').innerHTML.trim() === '') { this.#initNewCommandLine() }
    }

    async #initNewCommandLine() {
        function placeCaretAtEnd(el) {
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(el);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }

        function isCaretAtStart(el) {
            const sel = window.getSelection();
            if (!sel.rangeCount) return false;
            const range = sel.getRangeAt(0);
            if (!el.contains(range.startContainer)) return false;
            const probe = range.cloneRange();
            probe.selectNodeContents(el);
            probe.setEnd(range.startContainer, range.startOffset);
            return probe.toString().length === 0;
        }

        function currentInput(area) {
            return area.querySelector('.line:last-child .input');
        }

        function getCMD() {
            return document.getElementById('area_cmd');
        }

        function updateInputEventFocusManager() {
            let allInput = getCMD().querySelectorAll('.input');
            for (let i = 0; i < allInput.length; i++) {
                if (i === (allInput.length - 1)) {
                    // Le plus récent
                    allInput[i].addEventListener('focusout', focusFnct);
                    allInput[i].focus();
                } else {
                    // Le plus vieux
                    allInput[i].removeEventListener('focusout', focusFnct);
                    allInput[i].blur();
                }
            }
        }

        // Insertion dans la ligne
        const area = getCMD();
        area.addEventListener('beforeinput', (e) => {
            if (e.inputType === 'deleteContentBackward') {
                const inp = currentInput(area);
                if (inp && isCaretAtStart(inp)) {
                    e.preventDefault(); // bloque le backspace sur le prompt
                }
            }
        });
        area.addEventListener('keydown', (e) => {
            const inp = currentInput(area);
            if (!inp) return;
            const sel = window.getSelection();
            if (!sel.rangeCount || !inp.contains(sel.anchorNode)) {
                // On recentre le focus dans l’input
                placeCaretAtEnd(inp);
                // Laisse passer les flèches, sinon bloque
                if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                    e.preventDefault();
                }
            }
        });

        const line = document.createElement('div');
        line.className = 'line';
        area.appendChild(line);

        const head = document.createElement('span');
        head.className = 'head';
        head.contentEditable = 'false';
        line.appendChild(head);

        // Head de la commande
        const user = document.createElement('span');
        user.classList.add('user');
        user.innerText = `${this.computerElement.username.replace(' ', '_')}@EscapeGameNumeric`;
        head.appendChild(user);

        head.appendChild(document.createTextNode(':'));

        const uiPWD = document.createElement('span');
        uiPWD.classList.add('pwd');
        uiPWD.innerText = this.Pwd;
        head.appendChild(uiPWD);
        head.appendChild(document.createTextNode('$\u00A0'));

        // champ pour faire la commande
        let focusFnct = () => { if (this.innerFrame.clientWidth !== 0) { input.focus() } }
        const input = document.createElement('span');
        input.className = 'input';
        input.contentEditable = 'true';
        input.spellcheck = false;
        line.appendChild(input);
        placeCaretAtEnd(input);
        input.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter' && e.key !== 'Tab') { return }
            e.preventDefault();

            // Découpage de la commande - NE PREND PAS EN COMPTE SUDO POUR L'INSTANT
            let preparedSpecialChar = '§';
            let command = input.innerText.trim()
            let preparedCommand = command.replace(' ', preparedSpecialChar);

            let commandArray = preparedCommand.split(preparedSpecialChar);
            let commandName = commandArray[0] ?? '';

            let paramsStr = commandArray[1] ?? '';
            let params = paramsStr.split(' ');

            // Tab
            if (e.key === 'Tab') {
                if (params === '') { return }
                if (['mkdir', 'pwd', 'touch', 'echo', 'whoami'].includes(commandName)) { return }
                //  verifier le ls dans les params
                let lastParam = params[params.length - 1];
                let rightDir = this.#getSortedContent(this.#normalizePwd(`${this.Pwd}`)).find(e => e instanceof FolderExplorer && e.name.startsWith(lastParam))
                if (rightDir !== null) {
                    input.innerText += rightDir.name.substring(params.length) + '/'
                }

                // Sortie
                return;
            }

            // Enter - Execution de la commande
            // Création du resultat
            let returnText = '';
            const cmd = getCMD();
            const commandReturn = document.createElement('div');
            commandReturn.classList.add('line', 'return');

            // Test 1 - valid command name
            if (command === '') {
                this.#initNewCommandLine()
                return
            } else if (!this.isCommandOperatorValid(commandName)) {
                commandReturn.classList.add('error');
                returnText = `${commandName}: command not found`;
            } else {
                // Commande valide
                let dest = paramsStr ?? ''
                let preparedPwdArguments = (dest[0] === '/') ? dest : (this.Pwd + dest)
                switch (commandName) {
                    case 'cd':
                        if (params.length > 1) {
                            commandReturn.classList.add('error');
                            returnText = `${commandName}: too many arguments`;
                            break;
                        }
                        this.#pwd = this.#normalizePwd(preparedPwdArguments);
                        break;

                    case 'pwd':
                        returnText = this.Pwd;
                        break;

                    case 'ls':
                        if (params.length > 1) {
                            commandReturn.classList.add('error');
                            returnText = `${commandName}: too many arguments`;
                            break;
                        }
                        returnText = this.#ls(this.#normalizePwd(preparedPwdArguments));
                        break;

                    default:
                        throw new Error(`${commandName} considérée comme correcte n'a pas été implémenté !`);
                }
            }

            // Affichage return
            commandReturn.innerHTML = returnText;
            cmd.appendChild(commandReturn);
            this.#initNewCommandLine();

            // Gestion des nouveaux input
            updateInputEventFocusManager();
        });

        await FunctionAsset.sleep(0.001); // Temps d'attente pour laisser head s'afficher (depuis la POV du user -> aucun temps d'attente)
        input.style.minWidth = `${line.clientWidth - head.clientWidth - 3}px`;
        updateInputEventFocusManager();
    }

    isCommandOperatorValid(str) {
        return this.#commandName.includes(str);
    }

    #normalizePwd(nouveauPwd) {
        if (!this.Pwd) { throw new Error("Le PWD n'est pas valide !") }
        let finalPwdStr = '';
        let formattedPwd = `${this.Pwd}`;

        // Nettoyage des / de début et de fin
        if (formattedPwd.startsWith('/')) formattedPwd = formattedPwd.substring(1);
        if (formattedPwd.endsWith('/')) formattedPwd = formattedPwd.slice(0, -1);
        let formattedPwdArray = formattedPwd ? formattedPwd.split('/') : [];

        // Nettoyage du nouveau chemin
        if (this.Pwd !== '/' && nouveauPwd.startsWith(this.Pwd)) {
            nouveauPwd = nouveauPwd.replace(this.Pwd, '');
        }
        nouveauPwd = nouveauPwd.replace(/\/+/g, '/').split('/');

        // Parcours
        for (const e of nouveauPwd) {
            if (!e || e === '.') continue;
            if (e === '..') formattedPwdArray.pop();
            else formattedPwdArray.push(e);
        }

        // Reconstruction
        finalPwdStr = '/' + formattedPwdArray.join('/');
        if (finalPwdStr.length > 1 && finalPwdStr.endsWith('/')) {
            finalPwdStr = finalPwdStr.slice(0, -1);
        }
        return finalPwdStr;
    }

    #getSortedContent(pwd = this.Pwd) {
        return this.#explorer.sortPath(this.#explorer.getContentFromPath(pwd))
    }

    #ls(pwd) {
        let returnText = '';
        let content = this.#getSortedContent(pwd);
        for (let i = 0; i < content.length; i++) {
            const el = content[i];
            let isFolder = (el instanceof FolderExplorer)
            let txt = el.name + (isFolder ? '/' : '');

            returnText += (isFolder) ? `<span class="folder">${txt}</span>` : txt;
            returnText += '\t';
        }
        return returnText;
    }
}