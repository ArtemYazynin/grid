
/**
 * Базовая абстракция строки грида
 */
export class Row {
    constructor(public id: number, public systemname: string, public friendlyname: string,
        public dataType: string | undefined = undefined) {

    }
}
