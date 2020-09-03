import Router from '../router/Router';

export default class BrabusQuery {

    private element : HTMLElement;
    private router : Router;

    constructor(element : HTMLElement, router : Router) {
       this.element = element;
       this.router = router;
    }

    public select(selector : string) : any {
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
            }
        }
    }

}