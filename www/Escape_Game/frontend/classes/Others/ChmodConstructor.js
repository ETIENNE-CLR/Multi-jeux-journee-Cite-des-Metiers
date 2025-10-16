const READ_VALUE = 4;
const WRITE_VALUE = 2;
const EXECUTE_VALUE = 1;

export function ChmodConstructor(read = false, write = false, execute = false) {
    let chmod = 0;
    if (read) chmod += READ_VALUE;
    if (write) chmod += WRITE_VALUE;
    if (execute) chmod += EXECUTE_VALUE;
    return chmod;
}

export function parseChmod(chmod) {
    return {
        read: (chmod & READ_VALUE) === READ_VALUE,
        write: (chmod & WRITE_VALUE) === WRITE_VALUE,
        execute: (chmod & EXECUTE_VALUE) === EXECUTE_VALUE,
    };
}

export function chmodToString(chmod) {
    const { read, write, execute } = parseChmod(chmod);
    return `${read ? 'r' : '-'}${write ? 'w' : '-'}${execute ? 'x' : '-'}`;
}
