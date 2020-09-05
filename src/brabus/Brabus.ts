import Router from "./router/Router";
import IRoute from "./router/IRoute";
import Render from "./render/Render";
import Net from './net/Net';
import BrabusQuery from './dom/BrabusQuery';

export default class Brabus {

    private element : HTMLElement;
    private router : Router;
    private render : Render;
    private brabusQuery : BrabusQuery; 

    constructor(element : HTMLElement){
        this.element = element;
        this.router = new Router();
        this.render = new Render(this.element, this.router);
        this.brabusQuery = new BrabusQuery(this.element, this.router, this.render);
    }

    /**
     * Run library, setup router, set drawer
     */
    public run(renderVariables? : {}) : void {
        this.router.callRoute();
        this.render.draw(renderVariables);
    }

    /**
     * 
     * @param href Url of navigate
     * @param callback This callback called when user navigate by url
     */
    public onRoute(href : string, callback : Function) : void {
        let route : IRoute = {
            route: href,
            callback: callback
        };
        this.router.pushRoute(route);
    }

    /**
     * Handle errors. Example: 404 
     * @param errorHandler Function to handle errors
     */
    public setErrorHandler(errorHandler : Function) : void {
        this.router.setErrorHandler(errorHandler);
    }

    /**
     * Get renderer to paint with page
     */
    public getRender() : Render {
        return this.render;
    }

    /**
     * Send request by url
     * @param url url to get request
     */
    public getNetwork(url : string, data? : {}) : any {
        if(data){
            let params = new URLSearchParams(data);
            url += '?' + params;
        }
        let callback : Function;
        Net.process(url, (data : any) => {
            if(callback){
                callback(data);
            }
        });
        return {
            finish: (fx : Function) => {
                callback = fx;
            }
        }
    }

    /**
     * Return BrabusQuery for work with dom content
     */
    public getQuery() : BrabusQuery {
        return this.brabusQuery;
    }
}
