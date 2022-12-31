const R        = 10,          // straal van een element
      STEP     = 2*R,         // stapgrootte
                              // er moet gelden: WIDTH = HEIGHT
      LEFT     = "left",      // bewegingsrichtingen 
      RIGHT    = "right",
      UP       = "up",
      DOWN     = "down",

      NUMFOODS = 15,          // aantal voedselelementen 

      XMIN     = R,           // minimale x waarde
      YMIN     = R,           // minimale y waarde
      
      SLEEPTIME = 500,        // aantal milliseconde voor de timer

      SNAKE   = "DarkRed",    // kleur van een slangsegment
      FOOD    = "Olive",      // kleur van voedsel
      HEAD    = "DarkOrange"; // kleur van de kop van de slang
    
var snake,
    foods = [],               // voedsel voor de slang
    width,                    // breedte van het tekenveld
    height,                   // hoogte van het tekenveld
    xMax = width - R,         // maximale waarde van x = width - R
    ymax = height - R,        // maximale waarde van y = height - R
    direction = UP;

 /**
$(document).ready(function () {
    $("#startSnake").click(init);
    $("#stopSnake").click(stop);
});
*/

/**
  @function init() -> void
  @desc Haal eventueel bestaand voedsel en een bestaande slang weg, cre\"eer een slang, genereer voedsel, en teken alles
*/
function init() {
    getDimensionsCanvas();
    //snake moet eerst worden aangemaakt vóór food omdat deze op fixed positie komt te staan
    createStartSnake();
    createFood();
    draw();
}

function getDimensionsCanvas() {
    width = $("#mySnakeCanvas").width();
    height = $("#mySnakeCanvas").height();
}

/**
  @function move(direction) -> void
  @desc Beweeg slang in aangegeven richting
        tenzij slang uit canvas zou verdwijnen 
  @param   {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
*/
function move(direction) {
    if (snake.canMove(direction)) {
        snake.doMove(direction);
        draw();
    }
    else {
        console.log("snake cannot move " + direction);
    }
}

/**
  @function draw() -> void
  @desc Teken de slang en het voedsel
*/
function draw() {
    //var canvas = $("#mySnakeCanvas").clearCanvas();
    var canvas = $("#mySnakeCanvas");
    drawElements(snake.segments, canvas);
    drawElements(foods, canvas);
}

/***************************************************************************
 **                 Constructors                                          **
 ***************************************************************************/
/**
   @constructor Snake
   @param {[Element] segments een array met aaneengesloten slangsegmenten
                   Het laatste element van segments wordt de kop van de slang 
*/ 
function Snake(segments) {
    this.segments = segments;
}

/**
   @constructor Element
   @param radius straal
   @param {number} x x-coordinaat middelpunt
   @param {number} y y-coordinaat middelpunt
   @param {string} color kleur van het element
*/ 
function Element(radius, x, y, color) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.color = color;
}


//volgens aanwijzing 7.6 is dit de beste manier om methode toe te voegen.
//toevoegen documentatie nog nodig
Element.prototype.collidesWithOneOf = function(elements) {
    var xcoordinaat = this.x;
    var ycoordinaat = this.y;
    return elements.some(function(el) {
        return xcoordinaat == el.x && ycoordinaat == el.y;
    });
}

/**
//volgens aanwijzing 7.6 is dit de beste manier om methode toe te voegen.
//toevoegen documentatie nog nodig
Element.prototype.collidesWithOneOf = function(elements) {
    var xcoordinaat = this.x;
    var ycoordinaat = this.y;
    return elements.forEach(function(el) {
        console.log("xcoordinaat: " + xcoordinaat + " el.x: " + el.x);
        if (xcoordinaat == el.x && ycoordinaat == el.y) {
            return true;
        }
        return false;
    });
}
*/
/***************************************************************************
 **                 Hulpfuncties                                          **
 ***************************************************************************/
 
/**
  @function createStartSnake() -> Snake
  @desc Slang creëren, bestaande uit  twee segmenten, 
        in het midden van het veld
  @return: slang volgens specificaties
*/
function createStartSnake() {
    var segments   = [createSegment(R + width/2, R + height/2), 
                      createHead(R + width/2, height/2 - R)];
    snake = new Snake(segments);  
}

/**
  @function createSegment(x,y) -> Element
  @desc Slangsegment creeren op een bepaalde plaats
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaart middelpunt
  @return: {Element} met straal R en color SNAKE
*/
function createSegment(x, y) {
    return new Element(R, x, y, SNAKE);
}

/**
  @function createHead(x,y) -> Element
  @desc Head slang creeren op een bepaalde plaats
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaart middelpunt
  @return: {Element} met straal R en color HEAD
*/
function createHead(x, y) {
    return new Element(R, x, y, HEAD);
}

/**
  @function createFood(x,y) -> Element
  @desc Voedselelement creeren op een bepaalde plaats
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaart middelpunt
  @return: {Element} met straal R en color FOOD
*/
function createFood(x, y) {
    return new Element(R, x, y, FOOD);
}

/**
  @function drawElements(elements, canvas) -> void
  @desc Elementen tekenen
  @param [Element] array van elementen
  @param {dom object} canvas het tekenveld
 */
function drawElements(elements, canvas) {
    elements.forEach(function (element) {
        drawElement(element, canvas);
    });
}

/**
  @function drawElement(element, canvas) -> void
  @desc Een element tekenen 
  @param {Element} element een Element object
  @param  {dom object} canvas het tekenveld
*/
 function drawElement(element, canvas) {
    canvas.drawArc({
        draggable : false,
        fillStyle : element.color,
        x : element.x,
        y : element.y,
        radius : element.radius
    });
}

/**
  @function getRandomInt(min: number, max: number) -> number
  @desc Creeren van random geheel getal in het interval [min, max] 
  @param {number} min een geheel getal als onderste grenswaarde
  @param {number} max een geheel getal als bovenste grenswaarde (max > min)
  @return {number} een random geheel getal x waarvoor geldt: min <= x <= max
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
  @return {boolean} true of false waarde
*/
function isPosInteger(x) {
    return x >= 0 && Number.isInteger(x);
}

/**
  @function createFoods() -> array met food
  @desc [Element] array van random verdeelde voedselpartikelen
  @return [Element] array met food
*/
function createFoods() {   
   var  i = 0,    
        food;
   //we gebruiken een while omdat we, om een arraymethode te gebruiken, eerst een nieuw array zouden moeten creëren (met NUMFOODS elementen)
   //food.collidesWithOneOf(snake.segments) MAKEN!!!!
   while (i < NUMFOODS ) {
     food = createFood(XMIN + getRandomInt(0, xMax), YMIN + getRandomInt(0, yMax));
     if (!food.collidesWithOneOf(snake.segments) && !food.collidesWithOneOf(foods) ) {
       foods.push(food);
       i++
     }
   }  
}

