import BObject from '../BObject';

export default class ObjectTemplate extends BObject {

    public getObject(): string {
        return "b-tpl";
    }

    public render(): void {
        this.getRenderParams().getRender().drawFile(this.getRenderParams().compiledAttribute,this.getRenderParams().element).finish(() => {
            this.unpack();
        });
    }
}
