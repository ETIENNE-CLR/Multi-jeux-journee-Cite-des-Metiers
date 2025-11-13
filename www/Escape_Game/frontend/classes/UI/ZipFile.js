import { IconApp } from "../Others/IconApp.js";
import { WindowApp } from "./WindowApp.js";

export class ZipFile extends WindowApp {
    constructor(name, computerElement) {
        super(name, computerElement, new IconApp('assets/zip-file.png', 'zip'))
    }
}