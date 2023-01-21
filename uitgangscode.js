const R        = 10,          // straal van een element
      STEP     = 2*R,         // stapgrootte
                              // er moet gelden: WIDTH = HEIGHT
      LEFT     = "left",      // bewegingsrichtingen 
      RIGHT    = "right",
      UP       = "up",
      DOWN     = "down",


      NUMFOODS = 30,          // aantal voedselelementen 

      XMIN     = R,           // minimale x waarde
      YMIN     = R,           // minimale y waarde
      
      SLEEPTIME = 200,        // aantal milliseconde voor de timer

      SNAKE   = "DarkRed",    // kleur van een slangsegment
      FOOD    = "Olive",      // kleur van voedsel
      HEAD    = "DarkOrange"; // kleur van de kop van de slang
    
var snake,
    foods = [],               // voedsel voor de slang
    width,                    // breedte van het tekenveld
    height,                   // hoogte van het tekenveld
    snaketimer,               // (Laurens) timer van de snake
    spelGestart = false,

    
    xMax,
    yMax

    //xMax = 450,
    //yMax = 450,
    //xMax = width - R,         // maximale waarde van x = width - R
    //ymax = height - R,        // maximale waarde van y = height - R

    direction = UP,
    lastPressedKey = UP;

$(document).keydown(function (e) {
    switch (e.code) {
    case "ArrowLeft":
       lastPressedKey = LEFT;
       break;
    case "ArrowUp":
       lastPressedKey = UP;
       break;
    case "ArrowRight":
       lastPressedKey = RIGHT;
       break;
    case "ArrowDown":
       lastPressedKey = DOWN;
       break;
    }
});

$(document).ready(function () {
    prepareCanvas();
    $("#startSnake").click(init);
    $("#stopSnake").click(stop);
});


function prepareCanvas() {
    getDimensionsCanvas();
    //indien hoogte of breedte niet deelbaar is door 2 R dient het canvas
    //nieuwe afmetingen te krijgen om de elementen mooi af te kunnen beelden
    if (width % (2 * R) != 0 ||
        height % (2 * R) != 0) {

        var newSize = Math.floor(width / (2 * R)) * 2 * R;
        console.log("newSize: " + newSize);

        //pas nieuwe afmetingen toe op canvas en sla deze afmetingen op in variabelen
        $("#mySnakeCanvas").width(newSize);
        $("#mySnakeCanvas").height(newSize);
        getDimensionsCanvas();
    }
    //toekennen van max coordinaat element kan hebben
    xMax = width - R;
    yMax = height - R;
    //console.log("xMax: " + xMax + " en yMax:" + yMax);
}

/**
  @function getDimensionsCanvas() -> void
  @desc haal de hoogte en wijdte van het canvas op via het DOM-object
*/
function getDimensionsCanvas() {
    width = $("#mySnakeCanvas").innerWidth();
    height = $("#mySnakeCanvas").innerHeight();
}

//(Laurens) stopfunctie
function stop() { 
  resetGame();
} 

 //(Laurens) resetfunctie
function resetGame() { 
  $("#mySnakeCanvas").clearCanvas(); 
  clearInterval(snaketimer);
  foods = [];
  setSpelGestart(false);
  direction = UP;   
  switchDirection = UP;
} 

/**
  @function init() -> void
  @desc Haal eventueel bestaand voedsel en een bestaande slang weg, 
        cre\"eer een slang, genereer voedsel, en teken alles
*/
function init() {
    if(spelGestart == false) { 
        setSpelGestart(true);
        // wordt al aangeroepen in prepareCanvas 
        getDimensionsCanvas();
        createStartSnake();
        createFoods();
        draw();
        snaketimer = setInterval(function() {
            move();}, SLEEPTIME);
    } 
}


function setSpelGestart(gestart) {
    spelGestart = gestart;
} 

/**
  @function move(direction) -> void
  @desc Beweeg slang in aangegeven richting
        tenzij slang uit canvas zou verdwijnen 
  @param   {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
*/
function move() {
    //canMove en doMove moeten worden geschreven als methode van de klasse snake
    //if (snake.canMove(direction)) {
    //snake.doMove(direction);
    
    determineDirection();
    newHead = calculateHead();
    if(!newHead.collidesWithOneOf(snake.segments)) {
       foodCollision = newHead.collidesWithOneOf(foods);
       updateSnakeCoordinaten(newHead, foodCollision);
       draw();
    } else {
       verloren();
    }
}


/**
  @function draw() -> void
  @desc Teken de slang en het voedsel
*/
function draw() {
    var canvas = $("#mySnakeCanvas").clearCanvas();
    drawElements(snake.segments, canvas);
    drawElements(foods, canvas);
}


function determineDirection() {
    if (!oppositeDirectionSnake()) { 
        direction = switchDirection;
    }
} 

function oppositeDirectionSnake() {
    return (direction == UP && lastPressedKey == DOWN) ||
            (direction == DOWN && lastPressedKey == UP) ||
            (direction == LEFT && lastPressedKey == RIGHT) ||
            (direction == RIGHT && lastPressedKey == LEFT);
}

function calculateHead() { 
    let snakeHead = snake.segments[0];
    let newHead;
    if(direction == UP) {
        let y = snake.segments[0].y - (2*R);
        if(y < 10) {y = 450;}
        newHead = createHead(snake.segments[0].x, y);
    }
    else if(direction == DOWN) {
        newHead = createHead(snake.segments[0].x, (snake.segments[0].y + (2*R)) % 460);
    }
    else if(direction == LEFT) {
        let x = snake.segments[0].x - (2*R);
        if(x < 10) {x = 450;}
        newHead = createHead(x, snake.segments[0].y);
    }
    else if(direction == RIGHT) {
        newHead = createHead((snake.segments[0].x + (2*R)) % 460, snake.segments[0].y);
    } else {newHead = snakeHead;}
    return newHead;
    
} 

function updateSnakeCoordinaten(newHead, foodCollision) {
    snake.segments[0].color = SNAKE;
    snake.segments.unshift(newHead);
    if(!foodCollision) {
        snake.segments.pop();
    } else {
        removeFood(newHead.x, newHead.y);
    }
}


function removeFood(x,y) {
    //ga alle elementen af in de array foods 
    for(var i = 0; i < foods.length; i++){
        //verwijder voedsel dat op de meegegeven coordinaten staat
        if (foods[i].x == x && foods[i].y == y) { 
            foods.splice(i, 1); 
        } 
    } 
} 

function verloren() {
    resetGame();
    drawVerloren();
}

function drawVerloren() {
    $("#mySnakeCanvas").drawImage({
    source: 'sad_snake.jpg',
    x: 210, y: 240,
    scale : 0.5
    });
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

Element.prototype.collidesWithOneOf = function(elements) {
    var xcoordinaat = this.x;
    var ycoordinaat = this.y;
    return elements.some(function(el) {
        return xcoordinaat == el.x && ycoordinaat == el.y;
    });
}


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
    var segments   = [createHead(10 - R + width/2, height/2 - R - 10),
                    createSegment(10 - R + width/2, R + height/2 - 10) ];
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
    console.log("segmentx: " + x + " and segmenty:" + y);
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
  @function createFoods() -> array met food
  @desc [Element] array van random verdeelde voedselpartikelen
  @return [Element] array met food
*/
function createFoods() {   
   var  i = 0,    
        food;
   while (i < NUMFOODS ) {
     food = createFood(XMIN + getRandomMultipleOfRadius(0, xMax), YMIN + getRandomMultipleOfRadius(0, yMax));
     if (!food.collidesWithOneOf(snake.segments) && !food.collidesWithOneOf(foods)) {
       foods.push(food);
       console.log("foodx: " + food.x + " and foody: " + food.y);
       i++
     }
   }  
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
    res = getRandomInt(min, Math.floor(max / (2 * R))) * 2 * R;
    return res;
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