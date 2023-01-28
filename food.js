import * as settings from "./settings.js";
import {Element} from "./element.js";

/**
  @function createFoods() -> array met food
  @desc [Element] array van random verdeelde voedselpartikelen
  @return [Element] array met food
*/
function createFoods(snake) {   
   var  i = 0,    
        food,
        foods;
   while (i < settings.NUMFOODS ) {
     food = createFood(settings.XMIN + getRandomMultipleOfRadius(0, xMax), 
                        settings.YMIN + getRandomMultipleOfRadius(0, yMax));
     if (!food.collidesWithOneOf(snake.segments) && !food.collidesWithOneOf(foods)) {
       foods.push(food);
       i++
     }
   }
   return foods;  
}

/**
  @function createFood(x,y) -> Element
  @desc Voedselelement creeren op een bepaalde plaats
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaart middelpunt
  @return: {Element} met straal R en color FOOD
*/
export function createFood(x, y) {
    return new Element(settings.R, x, y, settings.FOOD);
}

/**
  @function getRandomMultipeOfRadius(min: number, max: number) -> number
  @desc Creeren van random veelvoud van het dubbele van de radius in het interval [min, max]
  @param {number} min een geheel getal als onderste grenswaarde
  @param {number} max een geheel getal als bovenste grenswaarde (max > min)
  @return {number} een random geheel getal x waarvoor geldt: min <= x <= max && (x % (2*R)) = 0
*/
function getRandomMultipleOfRadius(min, max) {
    var res;

    //genereer willekeurig getal dat deelbaar is door 2*R
    //dit zorgt ervoor dat x en y zo gekozen worden dat ze mooi op canvas worden afgebeeld
    res = getRandomInt(min, Math.floor(max / (2 * settings.R))) * 2 * settings.R;
    return res;
}

/**
  @function getRandomInt(min: number, max: number) -> number
  @desc Creeren van random geheel getal in het interval [min, max] 
  @param {number} min een geheel getal als onderste grenswaarde
  @param {number} max een geheel getal als bovenste grenswaarde (max > min)
  @return {number} een random geheel getal x waarvoor geldt: min <= x <= max
  @throws {Error} Het moeten gehele getallen van 0 of groter zijn
  @throws {Error} Het eerste argument moet kleiner of gelijk aan het tweede argument zijn
*/
function getRandomInt(min, max) {
    var res;
    if (isPosInteger(min) && isPosInteger(max) && min <= max) {
        res = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    else if(!(isPosInteger(min) && isPosInteger(max))) {
        throw Error("Het moeten gehele getallen van 0 of groter zijn");
    }
    else {
        throw Error("Het eerste argument moet kleiner of gelijk aan het tweede argument zijn")
    }
    return res;
}

/**
  @function isPosInteger(x: number) -> boolean
  @desc Bepalen of het gaat om een positief geheel getal
  @param {number} een getal
  @return {boolean} false bij:
                       - geen getal
                       - kleiner dan 0;
                    anders true
*/
function isPosInteger(x) {
    return x >= 0 && Number.isInteger(x);
}