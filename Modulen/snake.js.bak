import * as settings from "./settings.js";
import {Element} from "./element.js";

/**
  @constructor Snake
  @param {[Element] segments een array met aaneengesloten slangsegmenten
                   Het laatste element van segments wordt de kop van de slang 
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
  @param {string} direction nieuwe richten van de slang 
*/
Snake.prototype.setDirection = function(direction) {
    this.direction = direction;
}

/**
  @function createStartSnake() -> Snake
  @desc Slang creëren, bestaande uit  twee segmenten, 
        in het midden van het veld
  @return: slang volgens specificaties
*/
export function createStartSnake() {
    let width = settings.xMax + settings.R;
    let height = settings.yMax + settings.R;

    console.log("width:" + width + " and height: " + height);

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
