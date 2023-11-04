import { Elements } from "src/API/utils/data";
import { IDeck, IDeckCard } from "src/API/utils/types";
import { v4 } from "uuid";

export class Deck implements IDeck {
    id: string;
    name: string;
    elements: Elements[];
    main: IDeckCard[];
    sideboard: IDeckCard[];

    constructor(name: string) {
        this.id = v4()
        this.name = name
        this.elements = []
        this.main = []
        this.sideboard = []
    }
}