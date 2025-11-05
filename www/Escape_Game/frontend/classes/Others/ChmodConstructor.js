// Définition des valeurs numériques associées aux permissions
// Ces valeurs correspondent aux bits utilisés pour les permissions en style Unix
const READ_VALUE = 4;    // Lecture
const WRITE_VALUE = 2;   // Écriture
const EXECUTE_VALUE = 1; // Exécution

/**
 * Construit un nombre représentant les permissions à partir de valeurs booléennes
 * @param {boolean} read - Permission de lecture
 * @param {boolean} write - Permission d'écriture
 * @param {boolean} execute - Permission d'exécution
 * @returns {number} - La valeur numérique du chmod
 */
export function ChmodConstructor(read, write, execute) {
    let chmod = 0;
    if (read) chmod += READ_VALUE;
    if (write) chmod += WRITE_VALUE;
    if (execute) chmod += EXECUTE_VALUE;
    return chmod;
}

/**
 * Analyse un nombre chmod et renvoie un objet avec les permissions
 * @param {number} chmod - La valeur numérique du chmod à analyser
 * @returns {{read: boolean, write: boolean, execute: boolean}} - Objet décrivant les permissions
 * @throws {Error} - Si la valeur de chmod est invalide (non numérique ou hors plage)
 */
export function parseChmod(chmod) {
    if (isNaN(chmod) || chmod < 0 || chmod > ChmodConstructor(true, true, true)) {
        throw new Error("Le chmod passé en paramètre n'est pas valide !");
    }

    return {
        read: (chmod & READ_VALUE) === READ_VALUE,
        write: (chmod & WRITE_VALUE) === WRITE_VALUE,
        execute: (chmod & EXECUTE_VALUE) === EXECUTE_VALUE,
    };
}

/**
 * Convertit un nombre chmod en chaîne de caractères au format Unix (ex: "rwx", "rw-")
 * @param {number} chmod - La valeur numérique du chmod
 * @returns {string} - Chaîne de caractères représentant les permissions
 */
export function chmodToString(chmod) {
    const { read, write, execute } = parseChmod(chmod);
    return `${read ? 'r' : '-'}${write ? 'w' : '-'}${execute ? 'x' : '-'}`;
}
