import { DesktopIconApp } from "../Others/IconApp.js";
import { FunctionAsset } from "../Tools/FunctionAsset.js";
import { WindowApp } from "./WindowApp.js";

export class Terminal extends WindowApp {
    #pwd;
    get Pwd() { return this.#pwd }

    constructor(pwd, computerElement) {
        super('Terminal de commande', computerElement, new DesktopIconApp('assets/terminal.png', 'Terminal'))
        this.#pwd = pwd;

        // Couleur de fond
        Object.assign(this.innerFrame.style, {
            backgroundColor: 'rgb(12 12 12)'
        });

        // Textarea
        const area = document.createElement('div');
        area.id = 'area_cmd';
        area.contentEditable = "false";
        Object.assign(area.style, {
            width: '-webkit-fill-available',
            height: this.innerFrame.style.minHeight,
            resize: 'none',
            backgroundColor: 'transparent'
        });
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

        // Insertion dans la ligne
        const area = document.getElementById('area_cmd');
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
        uiPWD.innerText = '~';
        head.appendChild(uiPWD);
        head.appendChild(document.createTextNode('$\u00A0'));

        // champ pour faire la commande
        const input = document.createElement('span');
        input.className = 'input';
        input.contentEditable = 'true';
        input.spellcheck = false;
        line.appendChild(input);
        placeCaretAtEnd(input);
        input.addEventListener('focusout', () => {
            if (this.innerFrame.clientWidth !== 0) { input.focus() }
        });

        await FunctionAsset.sleep(0.001); // Temps d'attente pour laisser head s'afficher (depuis la POV du user -> aucun temps d'attente)
        console.log(line.clientWidth, head, head.clientWidth);
        input.style.width = `${line.clientWidth - head.clientWidth - 3}px`;
    }
}