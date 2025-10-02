export class DragDrop {
    static draggedElement = null;

    static dragstartHandler(event) {
        DragDrop.draggedElement = event.target;
        event.dataTransfer.setData("text", event.target.id);
    }

    static dragoverHandler(event) {
        event.preventDefault();
    }

    static dropHandler(event) {
        event.preventDefault();
        const data = event.dataTransfer.getData("text");
        const cell = event.target.closest("td");
        if (cell) {
            cell.appendChild(document.getElementById(data)); // même erreur ici
        }
        DragDrop.draggedElement = null;
    }
}
