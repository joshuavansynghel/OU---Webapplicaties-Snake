/**
  @constructor Element
  @param radius straal
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaat middelpunt
  @param {string} color kleur van het element
*/ 
export function Element(radius, x, y, color) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.color = color;
}

/**
  @function collidesWithOneOf(elements) -> boolean
  @desc Geef aan dit element bots met een andere array van elementen
  @param [Element] elements een array van elementen
  @return {boolean} false indien dit element niet botst met 1 van
                    de andere elementen in de array
                    true indien wel
*/
Element.prototype.collidesWithOneOf = function(elements) {
    console.log("elements: " + JSON.stringify(elements))
    var xcoordinaat = this.x;
    var ycoordinaat = this.y;
    return elements.some(function(el) {
        return xcoordinaat == el.x && ycoordinaat == el.y;
    });
}