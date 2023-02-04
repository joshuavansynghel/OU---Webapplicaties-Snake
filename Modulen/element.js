/**
  @constructor Element
  @param {number} radius - De straal
  @param {number} x - Het x-coordinaat middelpunt
  @param {number} y - Het y-coordinaat middelpunt
  @param {string} color - De kleur van het element
*/ 
export function Element(radius, x, y, color) {
  this.radius = radius;
  this.x = x;
  this.y = y;
  this.color = color;
}

/**
  @function collidesWithOneOf
  @desc   Geeft aan of dit element botst met een ander element uit de array
  @param  {array} elements - Een array van elementen
  @return {boolean} false indien dit element niet botst met 1 van
                    de andere elementen in de array
                    true indien wel
*/
Element.prototype.collidesWithOneOf = function(elements) {
  var xcoordinaat = this.x;
  var ycoordinaat = this.y;
  return elements.some(function(el) {
    return xcoordinaat == el.x && ycoordinaat == el.y;
  });
}
