import { ChmodConstructor, chmodToString, parseChmod } from "../Others/ChmodConstructor.js";
import { Directory } from "../Others/Directory.js";
import { File } from "../Others/File.js";
import { DesktopIconApp } from "../Others/IconApp.js";
import { FunctionAsset } from "../Tools/FunctionAsset.js";
import { WindowApp } from "./WindowApp.js";

export class Terminal extends WindowApp {
    #pwd; // Chemin actuel
    #commandName; // Les commandes valides
    #computer; // Instance de l'ordinateur
    #history;

    get Pwd() { return this.#pwd }
    get ValideCommand() { return this.#commandName }
    get Tree() { return this.#computer.Tree }
    get History() { return this.#history }

    constructor(computerElement) {
        super('Terminal de commande', computerElement, new DesktopIconApp('assets/terminal.png', 'Terminal'))
        this.#computer = computerElement;
        this.#pwd = '/';

        // Commandes valides
        this.#commandName = [
            'cd', 'mkdir', 'pwd', 'ls', 'll',
            'rm', 'cp', 'mv', 'cat', 'chmod',
            'touch', 'echo', 'whoami', 'history'
        ];
        this.#history = [];

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
        let indexHistory = -1;
        input.addEventListener('keydown', (e) => {
            const VALID_KEYS = {
                tab: 'Tab',
                enter: 'Enter',
                arrowUp: 'ArrowUp',
                arrowDown: 'ArrowDown'
            };
            if (!Object.values(VALID_KEYS).includes(e.key)) return;
            e.preventDefault();

            // Découpage de la commande - NE PREND PAS EN COMPTE SUDO POUR L'INSTANT
            const preparedSpecialChar = '§';
            const command = input.innerText.trim()
            const preparedCommand = command.replace(' ', preparedSpecialChar);

            const commandArray = preparedCommand.split(preparedSpecialChar);
            const commandName = commandArray[0] ?? '';

            const commandSecondPartStr = commandArray[1] ?? '';
            const commandSecondPart = commandSecondPartStr.split(' ').filter(Boolean)
            const params = commandSecondPart.filter(p => !(p[0].startsWith('-')) && isNaN(p));
            const args = commandSecondPart.filter(p => p[0].startsWith('-'));
            const paramsStr = params.join(' ') ?? '';

            // Chemin relatif absolue
            const dest = paramsStr ?? ''
            const preparedPwdArguments_relatifPwd = (dest[0] === '/') ? dest : (this.Pwd + '/' + dest)

            // Tab
            if (e.key === VALID_KEYS.tab) {
                const excludedCommands = ['pwd', 'echo', 'whoami'];
                if (excludedCommands.includes(commandName)) return;

                let paramsWithoutLastParams = params[params.length - 1].split('/');
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

            // Historique
            if (e.key === VALID_KEYS.arrowUp || e.key === VALID_KEYS.arrowDown) {
                if (this.#history.length === 0) return;

                if (e.key === VALID_KEYS.arrowUp) {
                    if (indexHistory < this.#history.length - 1) indexHistory++;
                } else {
                    if (indexHistory > -1) indexHistory--;
                }

                const commandToFill = (indexHistory === -1)
                    ? ''
                    : this.#history[indexHistory];

                input.innerText = commandToFill;
                return;
            }

            // Enter - Execution de la commande
            // Création du resultat
            let returnText = '';
            const commandReturn = document.createElement('div');
            commandReturn.classList.add('line', 'return');

            let endCommandLineReturn = () => {
                commandReturn.innerHTML = returnText;
                getCMD().appendChild(commandReturn);
                this.#initNewCommandLine();
                updateInputEventFocusManager();
                return;
            }

            // valid command name
            if (command === '') {
                endCommandLineReturn();
                return
            } else if (!this.isCommandOperatorValid(commandName)) {
                returnText = `<span class="error">${commandName}: command not found</span>`;
            } else {
                // Commande valide
                let getParentElementFromTree = (pwd, strict = true) => {
                    let currentDir = this.Tree;
                    const pathParts = pwd.split('/').filter(Boolean);
                    pathParts.pop();

                    // si le chemin est absolu
                    const isAbsolute = pwd.startsWith('/');
                    const basePath = isAbsolute ? [] : this.Pwd.split('/').filter(Boolean);
                    const allParts = [...basePath, ...pathParts];

                    // Navigation dans l'arborescence pour la syncronisation
                    for (const part of allParts) {
                        const found = g(currentDir).find(c => c.name === part && c instanceof Directory);
                        if (!found) {
                            if (strict) throw new Error("Le chemin est invalide pour la navigation dans l'arborescence !");
                            else return false;
                        } else currentDir = found;
                    }
                    return currentDir;
                }

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

                    case 'history':
                        if (params.length > 0) {
                            returnText = `<span class="error">${commandName}: too many arguments</span>`;
                            break;
                        }
                        returnText = '';
                        this.#history.reverse().forEach(c => {
                            returnText += c + '\n';
                        });
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
                            let currentDir = getParentElementFromTree(fullPath);

                            // tests
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
                        if (returnText.includes('error')) {
                            commandReturn.style.display = 'block';
                        } else {
                            returnText = '';
                        }
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
                    case 'rm':
                        let wantRm = (commandName === 'rm');
                        if (params.length < 1) {
                            returnText = `<span class="error">${commandName}: need an argument</span>`;
                            break;
                        }
                        params.forEach(p => {
                            let pathToFile = this.Pwd + p;
                            let children = this.#computer.getContentFromPath(this.#normalizePwd(pathToFile));
                            let parent = this.#computer.getContentFromPath(this.#normalizePwd(this.#normalizePwd(pathToFile) + '../'));

                            if (Array.isArray(children)) {
                                children = children.filter(e => parseChmod(e.chmod).read);
                            }

                            let pFormatted = p.split('/').filter(Boolean).pop();
                            let file = !Array.isArray(children)
                                ? children
                                : (children.find(c => c.name === pFormatted) ?? g(parent).find(c => c.name === pFormatted));

                            if (!file) {
                                returnText += `<span class="line error">${commandName}: ${p}: No such file or directory</span>`;
                            } else if (!wantRm && !(file instanceof File)) {
                                returnText += `<span class="line error">${commandName}: ${p}: Is not a file</span>`;
                            } else if ((!wantRm && !parseChmod(file.chmod).read) || (wantRm && !parseChmod(file.chmod).write)) {
                                returnText += `<span class="line error">${commandName}: ${p}: Permission denied</span>`;
                            } else {
                                // Tous les tests sont passés
                                if (wantRm) {
                                    // Init
                                    let currentDir = getParentElementFromTree(this.#normalizePwd(preparedPwdArguments_relatifPwd));

                                    // Suppression de l'élement
                                    let el = g(currentDir).find(e => {
                                        const typeCondition = (args.includes('-d')) ? e instanceof Directory : e instanceof File;
                                        return e.name === pFormatted && typeCondition;
                                    });
                                    const children = g(currentDir);
                                    const index = children.indexOf(el);
                                    if (index !== -1) {
                                        children.splice(index, 1);
                                    }
                                } else {
                                    returnText += file.content
                                }
                            }
                            returnText += `\n`;
                            commandReturn.style.flexDirection = 'column'
                        });
                        break;

                    case 'chmod':
                        if (commandSecondPart.length < 2) {
                            returnText = `<span class="error">${commandName}: missing operand</span>`;
                            break;
                        }

                        let newChmod = commandSecondPart[0];
                        if (isNaN(newChmod)) {
                            returnText = `<span class="error">${commandName}: invalid mode: '${newChmod}'</span>`;
                            break;
                        }

                        // Parcourir les paramètres
                        params.forEach(p => {
                            if (p.endsWith('/')) p = p.slice(0, -1);
                            let pathToFile = this.Pwd + p;
                            let parent = this.#computer.getContentFromPath(this.#normalizePwd(this.#normalizePwd(pathToFile) + '../'));
                            let pFormatted = p.split('/').filter(Boolean).pop();

                            let file = g(parent).find(e => e.name === pFormatted);
                            if (!file) {
                                returnText += `<span class="error">${commandName}: ${p}: No such file or directory</span>`;
                            }
                            file.chmod = newChmod;
                        });
                        break;

                    case 'mv':
                    case 'cp':
                        if (params.length < 2) {
                            returnText = `<span class="error">${commandName}: missing operand</span>`;
                            break;
                        }
                        if (params.length > 2) {
                            returnText = `<span class="error">${commandName}: too many arguments</span>`;
                            break;
                        }

                        // Init
                        let currFile = params[0];
                        let destFile = params[1];
                        let isMv = (commandName === 'mv');

                        let currentDir = getParentElementFromTree(this.#normalizePwd(this.Pwd + currFile + '../'), false);
                        let destinaDir = getParentElementFromTree(this.#normalizePwd(this.Pwd + destFile + (destFile.endsWith('/') ? currFile : '../')), false);

                        if (!currentDir || !destinaDir) {
                            returnText = `<span class="error">${commandName}: cannot stat '${(!destinaDir) ? destFile : currFile}': No such file or directory</span>`;
                            break;
                        }

                        // Permissions
                        const testPermsSrc = (this.Pwd === '/') ? false : (!parseChmod(currentDir.chmod).read);
                        const testPermsDest = (this.Pwd === '/') ? false : (!parseChmod(destinaDir.chmod).write);

                        const testPermsDir = (!parseChmod(destinaDir.chmod).write || !parseChmod(destinaDir.chmod).execute)
                        const testPermsFile = (!isMv && originFile instanceof File && !parseChmod(originFile.chmod).read)
                        if (testPermsSrc || testPermsDest) {
                            returnText = `<span class="error">${commandName}: ${dstArg}: Permission denied</span>`;
                        }

                        // Recup fichier ou dossier
                        let copyFile = undefined;
                        let originFile = g(currentDir).find(c => c.name === currFile);
                        if (!originFile) {
                            returnText = `<span class="error">${commandName}: no such file or directory</span>`;
                            break;
                        }

                        // move
                        if (currentDir !== destinaDir || !isMv) {
                            g(destinaDir).push(originFile);
                            copyFile = g(destinaDir).find(e => e.name === originFile.name && (!isMv && e !== originFile));

                            if (isMv) {
                                // Suppression de l'autre fichier
                                const children = g(currentDir);
                                const index = children.indexOf(originFile);
                                if (index !== -1) {
                                    children.splice(index, 1);
                                }
                            }
                        }

                        // rename
                        let newName = destFile.split('/').pop();
                        if (newName.trim() !== '') {
                            ((isMv) ? originFile : copyFile).name = newName
                        }
                        break;

                    default:
                        throw new Error(`${commandName} considérée comme correcte n'a pas été implémenté !`);
                }

                // Ajoute la commande au tout début du tableau history
                this.#history.unshift(command);
                indexHistory = -1;
            }
            endCommandLineReturn();
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