import { ChmodConstructor, parseChmod } from "../Others/ChModConstructor.js";
import { Directory } from "../Others/Directory.js";
import { File } from "../Others/File.js";
import { DesktopIconApp } from "../Others/IconApp.js";
import { FunctionAsset } from "../Tools/FunctionAsset.js";
import { WindowApp } from "./WindowApp.js";

export class Terminal extends WindowApp {
    #pwd; // Chemin actuel
    #commandName; // Les commandes valides
    #computer; // Instance de l'ordinateur

    get Pwd() { return this.#pwd }
    get ValideCommand() { return this.#commandName }
    get Tree() { return this.#computer.Tree }

    constructor(computerElement) {
        super('Terminal de commande', computerElement, new DesktopIconApp('assets/terminal.png', 'Terminal'))
        this.#computer = computerElement;
        this.#pwd = '/';

        // Commandes valides
        this.#commandName = [
            'cd', 'mkdir', 'pwd', 'ls',
            'rm', 'cp', 'mv', 'cat',
            'touch', 'echo', 'whoami'
        ];

        // Couleur de fond
        this.innerFrame.style.backgroundColor = 'rgb(12 12 12)';

        // Textarea
        const area = document.createElement('div');
        area.id = 'area_cmd';
        area.contentEditable = 'false';
        area.style.height = this.innerFrame.style.minHeight
        this.innerFrame.appendChild(area);
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

        function currentInput() {
            return getCMD().querySelector('.line:last-child .input');
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
                    placeCaretAtEnd(allInput[i]);
                } else {
                    // Le plus vieux
                    allInput[i].removeEventListener('focusout', focusFnct);
                    allInput[i].blur();
                }
            }
        }

        // Insertion dans la ligne
        const area = getCMD();
        // area.addEventListener('beforeinput', (e) => {
        //     if (e.inputType === 'deleteContentBackward') {
        //         const inp = currentInput();
        //         if (inp && isCaretAtStart(inp)) {
        //             e.preventDefault();
        //         }
        //     }
        // });
        area.addEventListener('keydown', (e) => {
            // Empêcher que le user puisse modifier les autres commandes plus vieilles
            const inp = currentInput();
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

        // Création de la ligne
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

        let nbTabClicked = 0;
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

            // Chemin realtif absolue
            let dest = paramsStr ?? ''
            let preparedPwdArguments_relatifPwd = (dest[0] === '/') ? dest : (this.Pwd + dest)

            // Tab
            if (e.key === 'Tab') {
                if (params.length > 1) { return }
                if (['mkdir', 'pwd', 'touch', 'echo', 'whoami'].includes(commandName)) { return }
                let paramsWithoutLastParams = paramsStr.split('/');
                let lastParam = paramsWithoutLastParams.pop();
                let tmpPwd = this.#normalizePwd(this.Pwd + paramsWithoutLastParams.join('/')); // ici la fonction de normalisation prend en charge le ../ du paramètre mais il faut gérer si le paramètre c'est directement à partir de /
                let actualContent = this.#getSortedContent(tmpPwd);
                let rightDirs = actualContent.filter(e => e.name.startsWith(lastParam) && ((commandName === 'cat' && e instanceof File) || (commandName !== 'cat' && e instanceof Directory)));

                // Resultats de la recherche
                if (rightDirs.length < 1) {
                    // Il n'y en a pas
                    return;
                }
                if (rightDirs.length === 1) {
                    // Il a trouvé
                    nbTabClicked = 0;
                    let el = rightDirs[0];
                    input.innerText += el.name.substring(lastParam.length) + (el instanceof Directory ? '/' : '');
                }
                if (rightDirs.length > 1) {
                    // Il en a trouvé plusieurs
                    nbTabClicked++;
                }

                // Affichage des resultats en fonction du nombre de tab cliqué
                if (nbTabClicked > 1) {
                    const returnLine = document.createElement('div');
                    returnLine.classList.add('line', 'return');
                    returnLine.innerHTML = '';
                    rightDirs.forEach(dir => {
                        returnLine.innerHTML += `<span class="enum">${dir.name}/\t</span>`;
                    });
                    area.appendChild(returnLine);
                    this.#initNewCommandLine();
                    currentInput(area).innerText = command;
                }
                updateInputEventFocusManager();
                return;
            }

            // Enter - Execution de la commande
            // Création du resultat
            let returnText = '';
            const commandReturn = document.createElement('div');
            commandReturn.classList.add('line', 'return');

            // valid command name
            if (command === '') {
                this.#initNewCommandLine()
                return
            } else if (!this.isCommandOperatorValid(commandName)) {
                commandReturn.classList.add('error');
                returnText = `${commandName}: command not found`;
            } else {
                // Commande valide
                switch (commandName) {
                    case 'cd':
                        if (params.length > 1) {
                            commandReturn.classList.add('error');
                            returnText = `${commandName}: too many arguments`;
                            break;
                        }

                        // Récupérer l'emplacement
                        let norPwd = this.#normalizePwd(preparedPwdArguments_relatifPwd);
                        if (!this.#getSortedContent(norPwd)) {
                            commandReturn.classList.add('error');
                            returnText = `${paramsStr}: directory not found`;
                            break;
                        }

                        // Voir les permissions
                        this.#pwd = '/';
                        let iHaveThePerms = true;
                        let pwdSplitted = norPwd.split('/');
                        let innerDir = this.#getSortedContent();
                        pwdSplitted.forEach(dirname => {
                            if (!iHaveThePerms) { return }
                            if (dirname === '') { return }
                            innerDir = g(innerDir).find(c => c instanceof Directory && c.name === dirname);
                            if (parseChmod(innerDir.chmod).execute) {
                                this.#pwd += dirname;
                            } else {
                                returnText += `<span class="line return error">cd: ${innerDir.name}/: Permission denied</span>`;
                            }
                        });
                        break;

                    case 'pwd':
                        returnText = this.Pwd;
                        break;

                    case 'whoami':
                        returnText = this.computerElement.username.replace(' ', '_');
                        break;

                    case 'mkdir':
                        function g(value) {
                            if (value instanceof Directory) {
                                return value.children
                            } else {
                                return value;
                            }
                        }
                        let actualDir = this.Tree;
                        const pwdArray = this.Pwd.split('/').filter(Boolean);

                        // navigation dans l'arborescence
                        for (const e of pwdArray) {
                            const found = g(actualDir).find(c => c.name === e && c instanceof Directory);
                            if (!found) throw new Error(`Dossier "${e}" introuvable.`);
                            actualDir = found;
                        }

                        // création des nouveaux dossiers
                        for (const dirName of params) {
                            if (this.Pwd !== '/' && !parseChmod(actualDir.chmod).write) {
                                returnText += `<span class="error">mkdir: cannot create directory '${dirName}': Permission denied</span>\n`;
                                break;
                            }
                            if (g(actualDir).find(c => c.name === dirName)) {
                                returnText += `<span class="error">mkdir: cannot create directory '${dirName}': File exists</span>\n`;
                                break;
                            }

                            // Création
                            if (this.Pwd === '/') {
                                actualDir.push(new Directory(dirName, [], ChmodConstructor(true, true, true)));
                            } else {
                                actualDir.children.push(new Directory(dirName, [], ChmodConstructor(true, true, true)));
                            }
                            returnText += `${dirName} created\n`;

                        };
                        if (!returnText.includes('error')) {
                            returnText = '';
                        }
                        break;

                    case 'ls':
                        if (params.length > 1) {
                            commandReturn.classList.add('error');
                            returnText = `${commandName}: too many arguments`;
                            break;
                        }
                        returnText = this.#ls(this.#normalizePwd(preparedPwdArguments_relatifPwd));
                        break;

                    case 'cat':
                        if (params.length < 1) {
                            commandReturn.classList.add('error');
                            returnText = `${commandName}: need an argument`;
                            break;
                        }
                        let children = this.#getSortedContent();
                        params.forEach(p => {
                            let file = children.find(c => c.name === p);
                            if (!file) {
                                returnText += `${commandName}: ${p}: No such file or directory`;
                            } else if (!parseChmod(file.chmod).read) {
                                returnText += `${commandName}: ${p}: Permission denied`;
                            } else {
                                returnText += file.content
                            }
                            returnText += `\n`;
                        });
                        break;

                    default:
                        throw new Error(`${commandName} considérée comme correcte n'a pas été implémenté !`);
                }
            }

            // Update tree
            if (!this.#computer.checkUpdateTreePermissions()) {
                throw new Error("Il y a eu une erreur de permission !");
            }

            // Affichage return
            commandReturn.innerHTML = returnText;
            area.appendChild(commandReturn);
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

    /**
     * Méthode pour normaliser le Pwd
     * @param {String} nouveauPwd Nouveau PWD (chemin absolue qu'on va venir coller un chemin relatif juste après l'absolu)
     * @returns {String} Le PWD absolue qui marche
     */
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
        if (!finalPwdStr.endsWith('/')) {
            finalPwdStr += '/';
        }
        return finalPwdStr;
    }

    #getSortedContent(pwd = this.Pwd) {
        let content = this.#computer.getContentFromPath(pwd);
        if (!content) {
            return false;
        }
        return this.#computer.sortPath(content);
    }

    #ls(pwd) {
        let returnText = '';
        let content = this.#getSortedContent(pwd);
        for (let i = 0; i < content.length; i++) {
            const el = content[i];
            if (!parseChmod(el.chmod).read) continue;
            let isFolder = (el instanceof Directory)
            let txt = el.name + (isFolder ? '/' : '');
            returnText += (isFolder) ? `<span class="enum folder">${txt}\t</span>` : `${txt}\t`;
        }
        return returnText;
    }

    open() {
        super._openBase();
        if (this.innerFrame.querySelector('div').innerHTML.trim() === '') { this.#initNewCommandLine() }
    }
}