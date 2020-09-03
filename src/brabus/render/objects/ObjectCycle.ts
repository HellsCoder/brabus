import BObject from '../BObject';

export default class ObjectCycle extends BObject {


    public getObject(): string {
        return "b-for";
    }

    public render(): void {
        let attr = this.getRenderParams().compiledAttribute;
        let content = this.getRenderParams().element.innerHTML;
        let insetContent = '';
        for(let i = 0; i < attr.length; i++){
            let cObject = attr[i];
            let replacedContent = this.getRenderParams().getRender().replaceAllVars(content, cObject);
            insetContent += replacedContent;
        }
        this.getRenderParams().element.innerHTML = insetContent;
        this.unpack();
    }
    
}