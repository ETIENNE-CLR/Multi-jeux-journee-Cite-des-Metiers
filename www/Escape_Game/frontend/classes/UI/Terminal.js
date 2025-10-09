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
        area.contentEditable = true;
        Object.assign(area.style, {
            width: '-webkit-fill-available',
            height: this.innerFrame.style.minHeight,
            resize: 'none',
            backgroundColor: 'transparent'
        });
        this.innerFrame.appendChild(area);
    }
    
    open(){
        this._openBase();
        this.#initNewCommandLine();
    }

    #initNewCommandLine() {
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

        const area = document.getElementById('area_cmd');

        const line = document.createElement('div');
        line.className = 'line';

        const head = document.createElement('span');
        head.className = 'head';
        head.contentEditable = 'false';
        head.textContent = `${this.computerElement.username.replace(' ', '_')}@EscapeGameNumeric:~$ `; // note l’espace
        line.appendChild(head);

        // 1ere partie
        const user = document.createElement('span');
        user.classList.add('user');
        user.innerText = `${this.computerElement.username.replace(' ', '_')}@EscapeGameNumeric`;
        head.appendChild(user);

        // Mid
        head.appendChild(document.createTextNode(':'));

        // 2e partie
        const uiPWD = document.createElement('span');
        uiPWD.classList.add('pwd');
        uiPWD.innerText = '~';
        head.appendChild(uiPWD);

        // End
        head.appendChild(document.createTextNode('$\u00A0'));
    }
}