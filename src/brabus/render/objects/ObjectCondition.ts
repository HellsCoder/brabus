import BObject from '../BObject';

export default class ObjectCondition extends BObject {


    public getObject(): string {
        return "b-if";
    }

    public render(): void {
        let attr = this.getRenderParams().compiledAttribute;
        if(!attr){
            return this.remove();
        }
        return this.unpack();
    }
   

    
}