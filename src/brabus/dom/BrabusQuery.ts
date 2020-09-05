import Router from '../router/Router';
import Render from '../render/Render';

export enum Direction {
    TOP,
    BOTTOM
}

export default class BrabusQuery {

    private element : HTMLElement;
    private router : Router;
    private render : Render;

    constructor(element : HTMLElement, router : Router, render : Render) {
       this.element = element;
       this.router = router;
       this.render = render;
    }

    public select(selector : string) {
        let element = this.element.querySelector(selector);
        if(!element){
            return null
        }
        return { 
            element: element,

            /**
             * Set or get value in input
             */
            value: (value? : string) : string => {
                if(value){
                    (<HTMLInputElement>element).value = value;
                    return value;
                }
                return (<HTMLInputElement>element).value;
            },

            /**
             * Set or get content by element with reset flushed handlers
             */
            content: (htmlContent? : string) : string => {
                if(!htmlContent){
                    return element.innerHTML;
                }
                element.innerHTML = htmlContent;
                /*
                    При добавлении какого-либо html заново включаем обработчик ссылок
                */
                this.router.setClickHandler();
            },

            /**
             * Push content top
             */
             push: (content : string, direction : Direction) : void => {
                if(direction === Direction.TOP){
                    element.innerHTML = content + element.innerHTML;
                }else{
                    element.innerHTML += content;
                }

                this.render.draw();
                this.router.setClickHandler();
             }
        }
    }

}
