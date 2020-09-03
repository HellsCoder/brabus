#  Brabus
Library for create SPA

## Установка
Чтобы установить Brabus воспользуйтесь командами
```
git clone https://github.com/HellsCoder/brabus.git
npm i
```
## Методы
Базовый функционал
```js
  import Brabus from './brabus/Brabus';

  /*
      Инициализируем библиотеку, необходимо указать корневой элемент
  */
  let brabus = new Brabus(document.getElementById("root"));

  /*
      Это подписка на переход(роут). Когда пользователь перейдет на
      /route выполнится функция
  */
  brabus.onRoute("/route", () => {
      console.info("Пользователь перешел на /route");
  });

  /*
      Можно установить обработчик ошибок, функция в нем будет
      выолняться когда пользователь перейдет на несушествующую ссылку(роут)
  */
  brabus.setErrorHandler(() => {
      console.info("Пользователь перешел на несуществующую ссылку");
  });

  /*
      После инициализации бибилиотеки ее необходимо запустить. В параметрах
      можно указать переменные которые будут использоваться в шаблонах при запуске (о шаблонах подробнее ниже)
  */
  brabus.run({
      testVariable: true
  });

```
Получение рабочих объектов
```js
  /*
      Получаем отрисовщик(для работы с графикой на странице)
  */
  brabus.getRender(); 

  /*
      Получаем обработчик сети
  */
  brabus.getNetwork("https://example.com", {
      param: brabus
  }).finish((data) => {
      console.info("Запрос выполнился, вот результат", data);
  });

  /*
      Получаем обработчик работы с DOM
  */
  brabus.getQuery();
```

## Методы объектов
### Render
```js
  /*
      Получаем отрисовщик(для работы с графикой на странице)
  */

  let render : Render = brabus.getRender();

  /*
      Отрисует контент шаблона на странице, в шаблоне можно использовать переменные
  */
  render.drawFile("/fileToDraw.html", {
      someVar: "123"
  }).finish(() => {
      console.info("Отрисовка завершена");
  });

  /*
      Отрисует компонент componentUrl с переменными variables внутри element
  */
  render.drawComponent({
      componentUrl: "/component.html",
      variables: {
          var: "var1"
      },
      element: document.querySelector(".тут_отрендерится_компонент")
  });

```
### BrabusQuery
```js
  /*
      Методы для работы с DOM, получаем элемент. Для работы рекомендуется использовать
      именно этот класс, потому что он перерегистрирует события в случае перерисовки
      шаблона
  */
  let element = brabus.getQuery().select(".same-element");

  element.content(content); //получить или установить контент
  element.value(value) //получить или установить значение вполе ввода
```

## Шаблоны
### Условия
```html
    <!--Это элемент условия, контент внутри него выведется только если var будет true-->
    <b-if var="testVariable">testVariable = true</b-if>

    <!--Так же поддерживается обратная инверсия-->
    <b-if var="!testVariable">testVariable = false</b-if>
    
    <!--Так же поддерживется многоярусность-->
    <b-if var="testVariableOne">
        <b-if var="testVariableTwo">
            testVariableOne = true,
            testVariableTwo = true
        </b-if>
    </b-if>
```
### Циклы
```html
    <!--Это элемент циклов, при рендере в variables нужно указать массив
      brabus.run({
          cars: [
              {name: 'BMW', color: 'white'},
              {name: 'Mercedes', color: 'black'}
          ]
      });
      Этот код распакуется и код в цикле выполнится столько раз, сколько элементов в массиве
    -->
    <b-for var="cars">
        <div class="car">
            <div class="car-name">
                {{name}}
            </div>
            <div class="car-color">
                {{color}}
            </div>
        </div>
    </b-for>
```

### Шаблоны
```html
    <!--Это элемент шаблона, перед шаблонами всегда ставьте знак ~, 
        это поможет шаблонизатору донести до компилятора неизменный адрес шаблона -->
    <b-tpl var="~/адрес/до/шаблона.html"></b-tpl>

    <!--Пример применения-->
    <div class="header">
        <b-tpl var="~/header.html"></b-tpl>
    </div>
    <div class="content">

    </div>
    <div class="footer">
        <b-tpl var="~/footer.html"></b-tpl>
    </div>
```

## Пример использования

index.ts
```js
  /*
    Инициализируем библиотеку, необходимо указать корневой элемент
*/
let brabus = new Brabus(document.getElementById("root"));

/*
    Обрабатываем переход на ссылку /cars
*/
brabus.onRoute('/cars', () => {
    /*
        Рисуем файл с шаблоном машин
    */
    brabus.getRender().drawFile("/cars.html", {
        cars: [
            {name: 'BMW', color: 'black'},
            {name: 'Mercedes', color: 'white'}
        ]
    });
});

/*
    Запускаем библиотеку и устанавливаем переменную для показа ссылки в true
*/
brabus.run({
    isUrlShow: true
});
```
index.html
```html
<html>
    <head>
        <meta charset="utf8">
        <title>Brabus</title>
    </head>
    <body>
        <div id="root">
            <!--Проверяем переменную и показываем ссылку только если переменная в true-->
            <b-if var="isUrlShow">
                <a href="/cars">Смотреть машины</a>
            </b-if>
        </div>
        <script src="dist/brabus.app.js"></script>
    </body>
</html>
```
cars.html
```html
<!--Выводим все машины в цикле-->

<b-for var="cars">
    <div class="car">
        <div class="carname">
            {{name}}
        </div>
        <div class="carcolor">
            {{color}}
        </div>
    </div>
</b-for>
```
