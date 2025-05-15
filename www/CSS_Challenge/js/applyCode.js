import { EtiennesAlert } from "./EtiennesAlert.js";
import { Tools } from "./Tools.js";

document.addEventListener('DOMContentLoaded', async () => {
    // Initialisation
    const prefix_cssElementInput = '_input';
    const prefix_cssElementDataList = '_datalist';
    const drawingText = document.getElementById('drawing');
    const jsonData = await Tools.fetch('possibilities.json');

    // Afficher les lignes de code à gauche
    let idsInputs = [];
    let rows = document.querySelectorAll('.cssRow');
    for (let incr = 0; incr < rows.length; incr++) {
        const row = rows[incr];
        row.innerHTML = `<span class="rowNumber">${incr + 1}</span>${row.innerHTML}`;
        let forContent = row.querySelector('label').getAttribute('for');
        idsInputs.push(forContent.substring(0, forContent.length - (prefix_cssElementInput.length)));
    }

    // Insérer selects dynamique ⚡
    Object.keys(jsonData.select).forEach(k => {
        const select = document.getElementById(`${k}${prefix_cssElementInput}`);
        select.innerHTML = '';

        // Les options
        jsonData.select[k].forEach(textOption => {
            const option = document.createElement('option');
            option.innerText = textOption;
            select.appendChild(option);
        });
    });

    // Insérer datalist dynamique ⚡
    Object.keys(jsonData.datalist).forEach(k => {
        const datalist = document.getElementById(`${k}${prefix_cssElementDataList}`);
        datalist.innerHTML = '';

        // Options
        jsonData.datalist[k].forEach(textDataset => {
            const option = document.createElement('option');
            option.innerText = textDataset;
            datalist.appendChild(option);
        });
    });

    // Implémenter les écouteurs d'evenement
    idsInputs.forEach(id => {
        const e = document.getElementById(`${id}${prefix_cssElementInput}`);
        e.addEventListener('input', () => {
            drawingText.style[id] = e.value;
        });

        // linker avec le datalist
        let datalist = document.getElementById(`${id}${prefix_cssElementDataList}`);
        if (datalist) {
            e.setAttribute('list', datalist.id);
        }
    });

    // Définition des styles à appliquer à l'objectif
    const objectif = document.getElementById('objectif');
    Object.assign(objectif.style, Tools.getRandomValueFromList(jsonData.objectifs));

    // Validation du code
    const btnValid = document.getElementById('validate');
    btnValid.addEventListener('click', () => {
        let styleCorrect = true;

        // Verif color
        // Verif bg-color
        // Verif fontSize
        // Verif fontFamily
        // Verif textAlign
        // Verif fontweight
        // Verif padding
        // Verif border
        // Verif borderradius

        // Display
        if (styleCorrect) {
            let a = new EtiennesAlert(`Vous avez réussi !`);
            a.show();
        }
    });
});