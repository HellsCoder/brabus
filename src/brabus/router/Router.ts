import IRoute from "./IRoute";

export default class Router {

    private currentPath : string;
    private pushRoutes : Array<IRoute> = [];

    private errorCallback : Function;


    constructor() {
        this.currentPath = window.location.pathname.substr(1);
        this.setClickHandler();
        window.addEventListener("popstate", (e) => {
            let url = new URL(window.location.href);
            console.info(e);
            this.go(url.pathname);
        });
    }

    /**
     * Set handler to click for <a href="/..."> 
     */
    public setClickHandler() : void {
        document.querySelectorAll("a").forEach((e) => {
            if(!e.hasAttribute("href")){
                return;
            }
            let url = e.getAttribute("href");
            if(url.substr(0,1) !== "/" && url.substr(0, 1) !== "#"){
                return;
            }
            e.addEventListener("click", (event : Event) => {
                event.preventDefault();
                if(url.substr(0,1) === "#"){
                    let scrollElement = <HTMLElement>document.querySelector(url);
                    if(!scrollElement){
                        return;
                    }
                    let to = scrollElement.offsetTop;
                    document.body.scrollTop = to;
                }else{
                    this.go(url);
                }
            });
        });
    }

    /**
     * Function {errorCallback} will be called by router when user navigate to wrong address
     * @param errorCallback Error callback
     */
    public setErrorHandler(errorCallback : Function) : void {
        this.errorCallback = errorCallback;
    }

    /**
     * Navigate to link
     * @param href Href to go
     */
    public go(href : string) : void {
        if(navigator.userAgent.toLowerCase().indexOf("gecko") != -1){
            window.history.pushState("", "", href); 
            window.history.replaceState("", "", href); 
        }else{
            window.location.hash = href;
        }
        this.currentPath = href.substr(1);
        this.callRoute();
    }

    /**
     * Add router handler
     * @param route Route to add watcher
     */
    public pushRoute(route : IRoute) : void {
        this.pushRoutes.push(route);
    }

    /**
     * Execute callback by current url or path
     * @returns {boolean} True is callback called
     */
    public callRoute() : boolean {
        for(let i = 0; i < this.pushRoutes.length; i++){
            let route = this.pushRoutes[i];
            if(route.route.substr(1) === this.currentPath){
                route.callback();
                return true;
            }
        }
        if(this.errorCallback){
            /*
                Callback if route not found
            */
            this.errorCallback();
        }
        return false;
    }

}
