import Brabus from './brabus/Brabus';

let brabus = new Brabus(document.getElementById("root"));

brabus.onRoute("/test", () => {
    console.info("Пользователь перешел на /test");
});

brabus.setErrorHandler(() => {
    console.info("Пользователь перешел на несуществующую ссылку");
});

brabus.run({
    testVariable: true
});