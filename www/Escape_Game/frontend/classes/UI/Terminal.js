import { ChmodConstructor, chmodToString, parseChmod } from "../Others/ChModConstructor.js";
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
            'cd', 'mkdir', 'pwd', 'ls', 'll',
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
        user.innerText = `${this.#computer.username.replace(' ', '_')}@EscapeGameNumeric`;
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
            let params = paramsStr.split(' ').filter(Boolean);

            // Chemin relatif absolue
            let dest = paramsStr ?? ''
            let preparedPwdArguments_relatifPwd = (dest[0] === '/') ? dest : (this.Pwd + '/' + dest)

            // Tab
            if (e.key === 'Tab') {
                const excludedCommands = ['pwd', 'echo', 'whoami'];
                if (params.length > 1 || excludedCommands.includes(commandName)) return;

                let paramsWithoutLastParams = paramsStr.split('/');
                let lastParam = paramsWithoutLastParams.pop();

                // Récupération du bon chemin
                let path = (paramsStr[0] !== '/')
                    ? this.Pwd  // pour chemin relatif
                    : '';       // pour chemin absolu
                path += paramsWithoutLastParams.join('/');
                path = (path === '') ? '/' : path;

                // Récupération du contenu
                let tmpPwd = this.#normalizePwd(path);
                let actualContent = this.#getSortedContent(tmpPwd);
                const searchResults = actualContent.filter(item => {
                    let isCorrectType = true;
                    isCorrectType = (commandName === 'cd' || commandName === 'touch' || commandName === 'ls' || commandName === 'll') ? item instanceof Directory : isCorrectType;
                    const correctPerms = (item instanceof File && parseChmod(item.chmod).read) || (item instanceof Directory && parseChmod(item.chmod).execute);
                    return item.name.startsWith(lastParam) && isCorrectType && correctPerms;
                });

                // Resultats de la recherche
                if (searchResults.length < 1) {
                    // Il n'y en a pas
                    return;
                }
                if (searchResults.length === 1) {
                    // Il a trouvé
                    nbTabClicked = 0;
                    let el = searchResults[0];
                    input.innerText += el.name.substring(lastParam.length) + (el instanceof Directory ? '/' : '');
                }
                if (searchResults.length > 1) {
                    // Il en a trouvé plusieurs
                    nbTabClicked++;
                }

                // Affichage des resultats en fonction du nombre de tab cliqué
                if (nbTabClicked > 1) {
                    const returnLine = document.createElement('div');
                    returnLine.classList.add('line', 'return');
                    returnLine.innerHTML = '';
                    searchResults.forEach(el => {
                        returnLine.innerHTML += `<span class="enum">${el.name}${el instanceof Directory ? '/' : ''}\t</span>`;
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
                returnText = `<span class="error">${commandName}: command not found</span>`;
            } else {
                // Commande valide
                function g(value) {
                    if (value instanceof Directory) {
                        return value.children
                    } else {
                        return value;
                    }
                }
                switch (commandName) {
                    case 'cd':
                        if (params.length < 1) {
                            this.#pwd = '/';
                            break;
                        }

                        if (params.length > 1) {
                            returnText = `<span class="error">${commandName}: too many arguments</span>`;
                            break;
                        }

                        // Récupérer l'emplacement
                        let norPwd = this.#normalizePwd(preparedPwdArguments_relatifPwd);
                        if (!this.#getSortedContent(norPwd)) {
                            returnText = `<span class="error">${paramsStr}: directory not found</span>`;
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
                                this.#pwd += dirname + '/';
                            } else {
                                returnText += `<span class="line return error">cd: ${innerDir.name}/: Permission denied</span>`;
                            }
                        });
                        break;

                    case 'pwd':
                        returnText = this.Pwd;
                        if (params.length > 0) {
                            returnText = `<span class="error">${commandName}: too many arguments</span>`;
                            break;
                        }
                        break;

                    case 'whoami':
                        if (params.length > 0) {
                            returnText = `<span class="error">${commandName}: too many arguments</span>`;
                            break;
                        }
                        returnText = this.#computer.username.replace(' ', '_');
                        break;

                    case 'mkdir':
                    case 'touch':
                        let wantDir = commandName === 'mkdir';
                        if (params.length < 1) {
                            returnText = `<span class="error">${commandName}: missing operand</span>`;
                            break;
                        }

                        // Parcourir tous les paramètres
                        for (const fullPath of params) {
                            const pathParts = fullPath.split('/').filter(Boolean);
                            const dirName = pathParts.pop();
                            let currentDir = this.Tree;

                            // si le chemin est absolu
                            const isAbsolute = fullPath.startsWith('/');
                            const basePath = isAbsolute ? [] : this.Pwd.split('/').filter(Boolean);
                            const allParts = [...basePath, ...pathParts];

                            // navigation dans l’arborescence
                            for (const part of allParts) {
                                const found = g(currentDir).find(c => c.name === part && c instanceof Directory);
                                if (!found) {
                                    returnText += `<span class="error">${commandName}: cannot create ${wantDir ? 'directory' : 'file'} '${fullPath}': No such file or directory</span>\n`;
                                    currentDir = null;
                                    break;
                                }
                                currentDir = found;
                            }
                            if (!currentDir) continue;

                            // test de création
                            const isRacine = (this.Pwd === '/')
                            const parentDir = currentDir;
                            const parentWritable = isRacine ? true : parseChmod(parentDir.chmod).write;
                            if (!parentWritable) {
                                returnText += `<span class="error">${commandName}: cannot create ${wantDir ? 'directory' : 'file'} '${fullPath}': Permission denied</span>\n`;
                                continue;
                            }
                            if (g(parentDir).find(c => c.name === dirName)) {
                                returnText += `<span class="error">${commandName}: cannot create ${wantDir ? 'directory' : 'file'} '${fullPath}': File already exists</span>\n`;
                                continue;
                            }

                            // création effective
                            const parentChmodParsed = (isRacine) ? null : parseChmod(parentDir.chmod);
                            const chmod = (isRacine) ? ChmodConstructor(true, true, wantDir) : ChmodConstructor(parentChmodParsed.read, parentChmodParsed.write, wantDir);
                            const emplacement = g(parentDir);
                            emplacement.push(wantDir
                                ? new Directory(dirName, [], chmod)
                                : new File(dirName, this.#computer, '', chmod)
                            );
                            returnText += `${fullPath} created\n`;
                        };

                        // S'il n'y a pas eu d'erreur, on dit rien
                        returnText = (!returnText.includes('error')) ? '' : returnText;
                        break;

                    case 'ls':
                    case 'll':
                        let isLs = commandName === 'ls';
                        if (params.length > 1) {
                            returnText = `<span class="error">${commandName}: too many arguments</span>`;
                            break;
                        }

                        let pwd = this.#normalizePwd(preparedPwdArguments_relatifPwd)
                        let content = this.#getSortedContent(pwd).filter(e => (isLs) ? parseChmod(e.chmod).read : true);
                        returnText = (isLs) ? '' : `<p class="line">total ${content.length}</p>`;

                        for (const el of content) {
                            const isFolder = el instanceof Directory;
                            const txt = el.name + (isFolder ? '/' : '');
                            const perms = (isFolder ? 'd' : '-') + chmodToString(el.chmod) + ' '.repeat(2);

                            if (!isLs) returnText += '<p class="line">' + perms;
                            returnText += isFolder
                                ? `<span class="enum folder">${txt}\t</span>`
                                : `${txt}\t`;
                            if (!isLs) returnText += '</p>';
                        }

                        if (!isLs) {
                            commandReturn.style.flexDirection = 'column'
                        }
                        break;

                    case 'cat':
                    // case 'rm':
                        if (params.length < 1) {
                            returnText = `<span class="error">${commandName}: need an argument</span>`;
                            break;
                        }
                        let children = this.#computer.getContentFromPath(this.#normalizePwd(preparedPwdArguments_relatifPwd));
                        let parent = this.#computer.getContentFromPath(this.#normalizePwd(preparedPwdArguments_relatifPwd + '../'));
                        console.log(parent);

                        if (Array.isArray(children)) {
                            children = children.filter(e => parseChmod(e.chmod).read);
                        }
                        params.forEach(p => {
                            let pFormatted = p.split('/').filter(Boolean).pop();
                            let file = !Array.isArray(children)
                                ? children
                                : (children.find(c => c.name === pFormatted) ?? g(parent).find(c => c.name === pFormatted));

                            if (!file) {
                                returnText += `<span class="error">${commandName}: ${p}: No such file or directory</span>`;
                            } else if (!(file instanceof File)) {
                                returnText += `<span class="error">${commandName}: ${p}: Is not a file</span>`;
                            } else if (!parseChmod(file.chmod).read) {
                                returnText += `<span class="error">${commandName}: ${p}: Permission denied</span>`;
                            } else {
                                returnText += file.content
                            }
                            returnText += `\n`;
                        });
                        break;

                    case 'rm2':

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
            updateInputEventFocusManager();
        });

        await FunctionAsset.sleep(0.001); // Temps d'attente pour laisser head s'afficher (depuis la POV du user -> aucun temps d'attente)
        input.style.minWidth = `${line.clientWidth - head.clientWidth - 3}px`;
        updateInputEventFocusManager();
        area.scrollTo({
            top: area.scrollHeight
        });
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
        if (!this.Pwd) throw new Error("Le PWD n'est pas valide !");

        // Si le nouveau chemin est absolu, on part de la racine
        let baseParts = nouveauPwd.startsWith('/')
            ? []
            : this.Pwd.split('/').filter(Boolean);

        // Découpe et nettoie le chemin
        let newParts = nouveauPwd.split('/').filter(Boolean);

        // Combine les deux
        let finalParts = [...baseParts];
        for (const part of newParts) {
            if (part === '.' || part === '') continue;
            if (part === '..') {
                finalParts.pop();
            } else {
                finalParts.push(part);
            }
        }

        // Reconstruit le chemin final
        let result = '/' + finalParts.join('/');
        if (!result.endsWith('/')) result += '/';
        if (result === '//') result = '/';
        return result;
    }


    #getSortedContent(pwd = this.Pwd) {
        let content = this.#computer.getContentFromPath(pwd);
        if (!content) {
            return false;
        }
        return this.#computer.sortPath(content);
    }

    open() {
        super._openBase();
        if (this.innerFrame.querySelector('div').innerHTML.trim() === '') { this.#initNewCommandLine() }
    }
}