import Render, { RenderParams } from './Render';

export default abstract class BObject {

    private params : RenderParams;

    /**
     * Set render params
     */
    public setRenderParams(params : RenderParams){
        this.params = params;
    }

    public getRenderParams() : RenderParams {
        return this.params;
    }

    /**
     * Get tag
     */
    public abstract getObject() : string;

    /**
     * Main function
     */
    public abstract render() : void;

    /**
     * Unpack html content
     */
    public unpack() {
        let parent = this.params.element.parentElement;
        parent.innerHTML = parent.innerHTML.replace(this.params.element.outerHTML, this.params.element.innerHTML);
        
        /*
            Redraw elements
        */
        this.params.getRender().draw(this.params.globalVariables);
    }
    
    /**
     * Remove html content
     */
    public remove() {
        let parent = this.params.element.parentElement;

        this.params.element.remove();

        this.params.getRender().draw(this.params.globalVariables);
    }
};