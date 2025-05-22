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
    const objectifChoisi = Tools.getRandomValueFromList(jsonData.objectifs);
    const objectif = document.getElementById('objectif');
    Object.assign(objectif.style, objectifChoisi);

    // Validation du code
    let correct = new EtiennesAlert(`Vous avez réussi !`);
    let lose = new EtiennesAlert(`Le style ne correspond pas tout à fait !`);
    const btnValid = document.getElementById('validate');
    btnValid.addEventListener('click', () => {
        let allCorrect = true;

        // Verif color
        let color = drawingText.style.color
        color = (color == '') ? 'black' : color;
        allCorrect = (color == objectifChoisi.color);

        // Verif bg-color
        if (allCorrect) {
            let bgColor = drawingText.style.backgroundColor
            bgColor = (bgColor == '') ? 'transparent' : bgColor;
            allCorrect = (bgColor == objectifChoisi.backgroundColor);

            // Verif fontSize
            if (allCorrect) {
                let fontSize = drawingText.style.fontSize;
                fontSize = (fontSize == '') ? '15px' : fontSize;
                allCorrect = TestPlusOuMoins(fontSize, objectifChoisi.fontSize)

                // Verif fontFamily
                if (allCorrect) {
                    let fontFamily = drawingText.style.fontFamily;
                    fontFamily = (fontFamily == '') ? 'Arial, sans-serif' : fontFamily;
                    allCorrect = (fontFamily == objectifChoisi.fontFamily);

                    // Verif textAlign
                    if (allCorrect) {
                        let textAlign = drawingText.style.textAlign;
                        textAlign = (textAlign == '') ? 'left' : textAlign;
                        allCorrect = (textAlign == objectifChoisi.textAlign);

                        // Verif fontWeight
                        if (allCorrect) {
                            let fontWeight = drawingText.style.fontWeight;
                            fontWeight = (fontWeight == '') ? '0' : fontWeight;
                            allCorrect = (fontWeight == objectifChoisi.fontWeight);

                            // Verif padding
                            if (allCorrect) {
                                let padding = drawingText.style.padding;
                                padding = (padding == '') ? '0px' : padding;
                                allCorrect = TestPlusOuMoins(padding, objectifChoisi.padding)

                                // Verif border
                                if (allCorrect) {
                                    let border = drawingText.style.border;
                                    border = (border == '') ? '0px solid black' : border;
                                    allCorrect = TestBorderPlusOuMoins(border, objectifChoisi.border)

                                    // Verif borderRadius
                                    if (allCorrect) {
                                        let borderRadius = drawingText.style.borderRadius;
                                        borderRadius = (borderRadius == '') ? '0px' : borderRadius;
                                        allCorrect = TestPlusOuMoins(borderRadius, objectifChoisi.borderRadius)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Display
        if (allCorrect) {
            correct.show();
        } else {
            lose.show();
        }
    });
});

function TestBorderPlusOuMoins(actual, target, scale = 1) {
    // Init
    let splittedActual = actual.split(' ');
    let splittedTarget = target.split(' ');
    let follow = 0;
    let testSuccess = false;

    // Epaisseur
    testSuccess = TestPlusOuMoins(splittedActual[follow], splittedTarget[follow], scale);
    follow++;

    // Style
    if (testSuccess) {
        testSuccess = (splittedActual[follow] == splittedTarget[follow]);
        follow++;

        // Couleur
        if (testSuccess) {
            testSuccess = (splittedActual[follow] == splittedTarget[follow]);
        }
    }
    return testSuccess;
}

function TestPlusOuMoins(actualMid, target, scale = 1) {
    let unit = ExtractUnitFromMesure(actualMid);
    let number = ExtractNumberFromMesure(actualMid);

    for (let i = (number - scale); i <= (number + scale); i++) {
        let composedMesure = `${i}${unit}`;
        if (composedMesure == target) {
            return true;
        }
    }
    return false;
}

function ExtractNumberFromMesure(mesure) {
    function estChiffre(caractere) {
        return /^[0-9]$/.test(caractere);
    }

    let splitted = mesure.split('');
    let strNumber = '';
    for (let i = 0; i < splitted.length; i++) {
        const char = splitted[i];
        if (estChiffre(char)) {
            strNumber += char;
        } else {
            break;
        }
    }
    return Number(strNumber);
}

function ExtractUnitFromMesure(mesure) {
    function estLettre(caractere) {
        return /^[a-zA-Z]$/.test(caractere);
    }

    let splitted = mesure.split('');
    let unit = '';
    for (let i = splitted.length - 1; i > 0; i--) {
        const char = splitted[i];
        if (estLettre(char)) {
            unit += char;
        } else {
            break;
        }
    }
    return unit.split('').reverse().join('');
}