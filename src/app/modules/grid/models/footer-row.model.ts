import { BehaviorSubject } from 'rxjs';
export class FooterRow {
    $colspan: BehaviorSubject<number>;
    $value: BehaviorSubject<string>;
    constructor(public systemname: string, value: string = '', colspan = 1) {
        this.$colspan = new BehaviorSubject<number>(colspan);
        this.$value = new BehaviorSubject<string>(value);
    }
}
