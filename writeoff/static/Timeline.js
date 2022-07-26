import Column from "./Column.js";

export default class Timeline {
    constructor(root) {
        this.root = root;
        Timeline.columns().forEach(column => {
            const columnView = new Column(column.id, column.title);

            this.root.appendChild(columnView.elements.root)
        });
    }

    static columns() {
        return [
            {
                id: 1,
                title: "Beginning"
            },
            {
                id: 2,
                title: "Middle"
            },
            {
                id: 3,
                title: "End"
            }     
        ];
    }
}