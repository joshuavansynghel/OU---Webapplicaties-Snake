import * as settings from "./settings.js";
import {Element} from "./element.js";

/**
  @constructor Snake
  @param {array} segments een array met aaneengesloten slangsegmenten
                   Het laatste element van segments wordt de kop van de slang
  @param {string} direction richting van de slang 
*/ 
function Snake(segments) {
    this.segments = segments;
    this.direction = settings.UP;
}

/**
  @function getDirection() -> string
  @desc Get de huidige richting van de slang
  @return {string} direction richting van de slang
*/
Snake.prototype.getDirection = function() {
    return this.direction;
}

/**
  @function setDirection(direction) -> void
  @desc Set een nieuwe richting aan de slang
  @param {string} direction nieuwe richting van de slang 
*/
Snake.prototype.setDirection = function(direction) {
    this.direction = direction;
}

/**
  @function createStartSnake() -> Snake
  @desc Slang creëren, bestaande uit  twee segmenten, 
        in het midden van het veld
  @return {Object} snake een slang met gegeven kleur en coordinaten
*/
export function createStartSnake() {
    //bereken de wijdte en hoogte van canvas op basis van de
    //variabelen en constanten in settings
    let width = settings.xMax + settings.R;
    let height = settings.yMax + settings.R;

    var segments   = [createSegment(width/2, height/2), 
                      createHead(width/2, height/2 - 2 * settings.R)];
    return new Snake(segments);
    } 
    
/**
  @function createSegment(x,y) -> Element
  @desc Slangsegment creeren op een bepaalde plaats
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaart middelpunt
  @return: {Element} met straal R en color SNAKE
*/
function createSegment(x, y) {
    return new Element(settings.R, x, y, settings.SNAKE);
}

/**
  @function createHead(x,y) -> Element
  @desc Head slang creeren op een bepaalde plaats
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaart middelpunt
  @return: {Element} met straal R en color HEAD
*/
export function createHead(x, y) {
    return new Element(settings.R, x, y, settings.HEAD);
}
