import * as settings from "./settings.js";

/**
  @constructor Snake
  @param {[Element] segments een array met aaneengesloten slangsegmenten
                   Het laatste element van segments wordt de kop van de slang 
*/ 
export function Snake(segments) {
    this.segments = segments;
    this.direction = settings.UP;
}

/**

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