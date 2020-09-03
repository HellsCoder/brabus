import BObject from './BObject';
import ObjectCondition from './objects/ObjectCondition';
import ObjectCycle from './objects/ObjectCycle';
import Net from './../net/Net';
import ObjectTemplate from './objects/ObjectTemplate';
import Router from './../router/Router';

export interface RenderParams {
    element : HTMLElement | Element;
    compiledAttribute: any;
    globalVariables: {};
    getRender(): Render;
};

export interface Component {
    componentUrl: string;
    variables: {};
    element? : HTMLElement | Element;
}

export interface Cache {
    fileUrl: string;
    content: string;
};

export default class Render {

    private element : HTMLElement;
    private cache : Array<Cache> = [];
    private router : Router;
    private objects : Array<BObject> = [
        new ObjectTemplate(),
        new ObjectCondition(),
        new ObjectCycle()
    ];


    constructor(element : HTMLElement, router : Router) {
        this.element = element;
        this.router = router;
    }

    /**
     * First draw scene
     * @param variables variables to draw
     */
    public draw(variables : {}) : void {
        this.compileScene(variables, this.element);
    }

    /**
     * Draw component in selector
     * @param component component to draw
     */
    public drawComponent(component : Component){
        let fxCall : Function;

        const raxRender = (content : string, toElement : Element) : void => {
            let contentDraw = this.getBlockByContent(content, "template");
            let css = this.getBlockByContent(content, "style");
            toElement.innerHTML = contentDraw;
            /*
                Расчет стилей
            */
            let styleElement : HTMLElement = document.createElement("style");
            let styleList : CSSRuleList = this.getCssRulesByText(css);
            for(let i = 0; i < styleList.length; i++){
                let style = (<any>styleList[i]);
                let selectorText = style.selectorText;
                let element : HTMLElement = toElement.querySelector(selectorText);
                
                let emulatedClass = "b-" + Math.random().toString(36).substring(3);
                element.classList.add(emulatedClass);
                styleElement.innerHTML += `.${emulatedClass}{${style.style.cssText}}`;
            }
            document.body.appendChild(styleElement);
            /*
                Отрисовка всего остального
            */
            this.draw(component.variables);
        };

        if(!component.element){
            component.element = this.element;
        }
        this.cache.forEach((e) => {
            if(e.fileUrl === component.componentUrl){
                raxRender(e.content, component.element);
                return fxCall();
            }
        });
        
        Net.process(component.componentUrl, (data : any) => {
            this.cache.push({
                fileUrl: component.componentUrl,
                content: data
            });
            raxRender(data, component.element);
            return fxCall();
        });

        return {
            finish: (fx : Function) => {
                fxCall = fx;
            }
        }
    }

    /**
     * Draw file in element
     * @param fileUrl url to file draw
     * @param element element to drawing
     */
    public drawFile(fileUrl : string, variables: {}, element? : HTMLElement | Element) {
        let fxCall : Function;
        if(!element){
            element = this.element;
        }
        this.cache.forEach((e) => {
            if(e.fileUrl === fileUrl){
                element.innerHTML = e.content;
                this.draw(variables);
                fxCall();
            }
        });
        Net.process(fileUrl, (data : any) => {
            element.innerHTML = data;
            this.cache.push({
                fileUrl: fileUrl,
                content: data
            });
            this.draw(variables);
            fxCall();
        });

        return {
            finish: (fx : Function) => {
                fxCall = fx;
            }
        }
    }

    /**
     * Get root element
     */
    public getMainDrawElement() : HTMLElement {
        return this.element;
    }

    /**
     * Compilation scene, do not use, please use draw
     * @param variables variables to render
     * @param drawElement element to render
     */
    public compileScene(variables : {}, drawElement : HTMLElement) : void {
        let _this : Render = this;
        for(let i = 0; i < this.objects.length; i++){
            let object = this.objects[i];
            let elementsTag = drawElement.getElementsByTagName(object.getObject());
            for(let e = 0; e < elementsTag.length; e++){
                let element = elementsTag[e];
                if(this.checkIsUnpackedParents(element)){
                    /*
                        Если сверху есть нераспакованный элемент, ждем пока он распакуется и только потом распаковываем этот
                    */
                    continue;
                }
                if(!element.hasAttribute("var")){
                    element.remove();
                    continue;
                }
                let compiledAttr = this.compileAttribute(variables, element.getAttribute("var"));
                object.setRenderParams({
                    element: element,
                    compiledAttribute: compiledAttr,
                    globalVariables: variables,
                    getRender: () => {
                        return _this;
                    }
                });
                object.render();
            }
        }
        /*
            Заново регистрируем обработку кликов по ссылкам, так как html разметка перерисовалась и события сбросились
        */
        this.router.setClickHandler();
    }

    /**
     * Replace all vars by {{var.path}} in template
     * @param content string of content
     * @param variables any values for replace
     */
    public replaceAllVars(content : string, variables : any) : string {
        let getPaths = (tr : any) => {
            let paths = [];
          
            function findPath(branch, str) {
              Object.keys(branch).forEach(function (key) {
                if (branch[key] instanceof Array || branch[key] instanceof Object){
                    findPath(branch[key], str ? str + "." + key : key);
                }else{
                    paths.push({
                        path: '{{' + (str ? str + "." + key : key) + '}}',
                        value: branch[key]
                    });
                }
              });    
            }
          
            findPath(tr, "");
            return paths;
        }

        let allPaths = getPaths(variables);
        for(let key in allPaths){
            let path = allPaths[key];
            content = content.split(path.path).join(path.value);
        }


        return content;
    }

    /**
     * Check if element have unpacked parents for skip
     * @param element by element search
     */
    private checkIsUnpackedParents(element : Element | HTMLElement) : boolean {
        while(element.parentElement !== null){
            for(let i = 0; i < this.objects.length; i++){
                if(this.objects[i].getObject() === element.parentElement.tagName.toLocaleLowerCase()){
                    return true;
                }
            }
            element = element.parentElement;
        }
        return false;
    }

    /**
     * Parse css to rules
     * @param css css in text content
     */
    private getCssRulesByText(css : string) : CSSRuleList {
        let cleanDocument = document.implementation.createHTMLDocument("");
        let styleElement = document.createElement("style");

        styleElement.textContent = css;

        cleanDocument.body.appendChild(styleElement);

        return styleElement.sheet.cssRules;
    }

    /**
     * 
     * @param content html content
     * @param selector selector to get block
     */
    private getBlockByContent(content : string, selector : string){
        /*
            Создаем невидимый рабочий элемент
        */
        let utils;
        if(!document.getElementById("utils")){
            utils = document.createElement("div");
            utils.id = "utils";
            utils.style.display = 'none';
            utils.innerHTML = content;
        }else{
            utils = document.getElementById("utils");
            utils.innerHTML = content;
        }

        /*
            Достаем блок из элемента
        */
        if(!utils.querySelector(selector)){
            return '';
        }
        let buffer = utils.querySelector(selector).innerHTML;
        utils.innerHTML = '';
        return buffer;
    }

    /**
     * Attribute compiler
     * @param variables all available variables
     * @param attr attribute to compile
     */
    private compileAttribute(variables : {}, attr : string) {

        let inversion = false;
        if(attr.substr(0, 1) === "!"){
            attr = attr.substr(1);
            inversion = true;
        }

        if(attr.substr(0, 1) === "~"){
            return attr.substr(1);
        }

        if(attr == "false"){
            return inversion ? true : false;
        }

        if(attr == "true"){
            return inversion ? false : true;
        }

        if(!variables[attr] && variables[attr] != false){
            return false;
        }

        if(variables[attr] == true || variables[attr] == false){
            return inversion ? !variables[attr] : variables[attr];
        }
        
        if(variables[attr] === "false"){
            return inversion ? true : false;
        }

        if(variables[attr] === "true"){
            return inversion ? false : true;
        }


        return variables[attr];
    }

}