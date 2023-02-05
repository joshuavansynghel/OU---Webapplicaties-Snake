/** @module snake */

import * as settings from "./settings.js";
import {Element} from "./element.js";

/**
  @constructor Snake
  @param {array} segments - Een array met aaneengesloten slangsegmenten
                 Het laatste element van segments wordt de kop van de slang
*/ 
function Snake(segments) {
  this.segments = segments;
  this.direction = settings.UP;
}

/**
  @function getDirection
  @desc   Geef de huidige richting van de slang
  @return {string} De huidige  richting van de slang
*/
Snake.prototype.getDirection = function() {
  return this.direction;
}

/**
  @function setDirection
  @desc  Ken een nieuwe richting toe aan de slang
  @param {string} direction - De nieuwe richting van de slang 
*/
Snake.prototype.setDirection = function(direction) {
  this.direction = direction;
}

/**
  @function createStartSnake
  @desc   Creëren van een slang met 2 segmenten in het midden
          van het speelveld
  @return {Object} Slang met gegeven kleur en positie
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
  @function createSegment
  @desc    Slangsegment creëren op een gegeven positie
  @param   {number} x - Het x-coordinaat middelpunt
  @param   {number} y - Het y-coordinaat middelpunt
  @return: {Object} Element met straal R en color SNAKE
*/
function createSegment(x, y) {
  return new Element(settings.R, x, y, settings.SNAKE);
}

/**
  @function createHead(x,y) -> Element
  @desc    Slangenhoofd creëren op een gegeven positie
  @param   {number} x - Het x-coordinaat middelpunt
  @param   {number} y - Het y-coordinaart middelpunt
  @return: {Object} Element met straal R en color HEAD
*/
export function createHead(x, y) {
  return new Element(settings.R, x, y, settings.HEAD);
}