
/***************************************************************************
 **                MODULE SETTINGS                                       **
 ***************************************************************************/
 
const        R        = 10,            // straal van een element
             STEP     = 2*R,           // stapgrootte
                                       // er moet gelden: WIDTH = HEIGHT
             LEFT     = "left",        // bewegingsrichtingen 
             RIGHT    = "right",
             UP       = "up",
             DOWN     = "down",

             ACTIVE   = "active",      // statussen van het spel
             INACTIVE = "inactive",
             WON      = "won",
             LOST     = "lost",


             NUMFOODS = 5,            // aantal voedselelementen 

             XMIN     = R,             // minimale x waarde
             YMIN     = R,             // minimale y waarde
      
             SLEEPTIME = 200,          // aantal milliseconde voor de timer

             SNAKE   = "DarkRed",      // kleur van een slangsegment
             FOOD    = "Olive",        // kleur van voedsel
             HEAD    = "DarkOrange",   // kleur van de kop van de slang

             WAITFORNAMEWINNER = 1000; // timer om input winnaar te controleren

var          xMax,                     // maximale x positie die element mag hebben
             yMax;                     // maximale y positie die element mag hebben

/**
  @function setMaxCoordinates
  @desc  Toekennen van de maximale coordinaten die een
         x of y coordinaat mag hebben aan lokale variabelen
  @param {number} width - De wijdte van het canvas
  @param {number} height - De hoogte van het canvas
*/
function setMaxCoordinates(width, height) {
  xMax = width - R;
  yMax = height - R;
}

/***************************************************************************
 **                MODULE SETTINGS                                       **
 ***************************************************************************/
 


/***************************************************************************
 **                MODULE ELEMENT                                       **
 ***************************************************************************/
 
/**
  @constructor Element
  @param {number} radius - De straal
  @param {number} x - Het x-coordinaat middelpunt
  @param {number} y - Het y-coordinaat middelpunt
  @param {string} color - De kleur van het element
*/ 
function Element(radius, x, y, color) {
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

/***************************************************************************
 **                MODULE ELEMENT                                       **
 ***************************************************************************/
 
 
 
/***************************************************************************
 **                MODULE FOOD                                       **
 ***************************************************************************/

/**
  @function createFoods
  @desc   Creëert een array van foodelementen die niet botst met bestaande slang
  @param  {Object} snake - De slang van het spel
  @return {array} Een array van foodelementen
*/
function createFoods(snake) {   
  var  i = 0,    
       food,
       foods = [];
  while (i < NUMFOODS ) {
    food = createFood(XMIN + getRandomMultipleOfRadius(0, xMax), 
                      YMIN + getRandomMultipleOfRadius(0, yMax));
    if (!food.collidesWithOneOf(snake.segments) && !food.collidesWithOneOf(foods)) {
      foods.push(food);
      i++
    }
  }
  return foods;  
}


/**
  @function createFood
  @desc    Creëert een food element met gegeven coördinaten
  @param   {number} x - Het x-coordinaat middelpunt
  @param   {number} y - Het y-coordinaart middelpunt
  @return: {Element} Element met straal R en color FOOD
*/
function createFood(x, y) {
  return new Element(R, x, y, FOOD);
}


/**
  @function getRandomMultipeOfRadius
  @desc   Creëren van random veelvoud van het dubbele van de radius in het interval [min, max]
  @param  {number} min - Een geheel getal als onderste grenswaarde
  @param  {number} max - Een geheel getal als bovenste grenswaarde (max > min)
  @return {number} Random geheel getal x waarvoor geldt: 
                                   - min <= x <= max 
                                   - (x % (2*R)) = 0
*/
function getRandomMultipleOfRadius(min, max) {
  let res;

  //genereer willekeurig getal dat deelbaar is door 2*R
  //dit zorgt ervoor dat x en y zo gekozen worden dat ze mooi op canvas worden afgebeeld
  res = getRandomInt(min, Math.floor(max / (2 * R))) * 2 * R;
  return res;
}


/**
  @function getRandomInt
  @desc   Creëren van random geheel getal in het interval [min, max] 
  @param  {number} min - Een geheel getal als onderste grenswaarde
  @param  {number} max - Een geheel getal als bovenste grenswaarde (max > min)
  @return {number} Random geheel getal x waarvoor geldt: min <= x <= max
  @throws {Error} Het moeten gehele getallen van 0 of groter zijn
  @throws {Error} Het eerste argument moet kleiner of gelijk aan het tweede argument zijn
*/
function getRandomInt(min, max) {
  let res;
  
  //voorwaarde dat beide argumenten een positief geheel getal zijn en min <= max  
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
  @function isPosInteger
  @desc   Bepalen of het gaat om een positief geheel getal
  @param  {number} een getal
  @return {boolean} false bij:
                       - geen getal
                       - kleiner dan 0;
                    anders true
*/
function isPosInteger(x) {
  return x >= 0 && Number.isInteger(x);
}
 
/***************************************************************************
 **                MODULE FOOD                                         **
 ***************************************************************************/
 
 
 
 
 
/***************************************************************************
 **                MODULE SNAKE                                       **
 ***************************************************************************/
 
/**
  @constructor Snake
  @param {array} segments - Een array met aaneengesloten slangsegmenten
                 Het laatste element van segments wordt de kop van de slang
*/ 
function Snake(segments) {
  this.segments = segments;
  this.direction = UP;
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
function createStartSnake() {
  //bereken de wijdte en hoogte van canvas op basis van de
  //variabelen en constanten in settings
  let width = xMax + R;
  let height = yMax + R;

  var segments   = [createSegment(width/2, height/2), 
                    createHead(width/2, height/2 - 2 * R)];
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
  return new Element(R, x, y, SNAKE);
}

/**
  @function createHead(x,y) -> Element
  @desc    Slangenhoofd creëren op een gegeven positie
  @param   {number} x - Het x-coordinaat middelpunt
  @param   {number} y - Het y-coordinaart middelpunt
  @return: {Object} Element met straal R en color HEAD
*/
function createHead(x, y) {
  return new Element(R, x, y, HEAD);
}

 
/***************************************************************************
 **                MODULE SNAKE                                       **
 ***************************************************************************/



/***************************************************************************
 **                 MODULE SCORE                                       **
 ***************************************************************************/
 
var score = 0;          // de huidige score van het spel


/**
  @function setScore
  @desc Pas de score aan naar een gegeven waarde
  @param {string} newScore - De nieuwe waarde van de score
  */  
function setScore(newScore){
  score = newScore;
} 


/**
  @function getScore
  @desc Geef de huidige score van het spel
  @return {string} De huidige score van het spel
  */  
function getScore() { 
  return score; 
}


/**
  @function changeScore
  @desc Incrementeer de score met 10
  */  
function changeScore() { 
  score = score + 10;
} 


/**
  @function resetScore
  @desc Reset de score van het spel naar 0
  */    
function resetScore() { 
  score = 0;
} 

/***************************************************************************
 **                 MODULE SCORE                                       **
 ***************************************************************************/


/***************************************************************************
 **                 MODULE WINNAAR                                 **
 ***************************************************************************/
 
var nameWinner;        // de naam van de winnaar

 
/**
  @function getNameWinner
  @desc   Geef de naam van de winnaar
  @return {string} De naam van de winnaar
  */    
function getNameWinner() { 
  return nameWinner; 
} 


/**
  @function setNameWinner
  @desc  Verander de naam van de winnaar
  @param {string} name - De naam van de winnaar
  */    
function setNameWinner(name) { 
  nameWinner = name;
} 

/**
  @function resetNameWinner
  @desc Zet de naam van de winnaar naar undefined
  */  
function resetNameWinner() { 
  nameWinner = undefined;
} 

/***************************************************************************
 **                 MODULE WINNAAR                                        **
 ***************************************************************************/
 


/***************************************************************************
 **                MODUE SCOREBOARDENTRIES                                **
 ***************************************************************************/

var entriesScoreboard;              // het scorebord met de 3 highscores
  

/**
  @construcor EntryScore
  @desc  Creëer een entry voor het scoreboard
  @param {string} name - De naam van de winnaar
  @param {string} scored - De score van de winnaar 
 */
function EntryScore(name, scored) { 
  this.name = name;
  this.score = scored;
} 


/**
  @function getEntriesScoreBoard
  @desc Geef de huidige entries van het scorebord.
  @return {map} Een map met de entries van het scorebord 
  */
function getEntriesScoreBoard() { 
  return entriesScoreboard;
}


/**
  @function scoreIsNewHigh
  @desc   Bepaal of de behaalde score een nieuwe high score is (top 3)
  @return {string} Behaalde plaats van de score in het scorebord, 
                   bij geen high score is de returnwaarde "noHighscore"
  */  
function scoreIsNewHigh() { 
  let newPlace = "noHighscore"; 
  let scored = getScore();
  let intermediateScore = 0; 
  entriesScoreboard.forEach((entry, key) => { 
    let entryScore = entry.score; 
    if (+scored >= +entryScore && +entryScore >=  +intermediateScore){ 
      intermediateScore = entryScore;
      newPlace = key; 
    }
  }); 
  return newPlace;
} 


/**
  @function adjustentriesScoreboard
  @desc  Pas het scorebord aan met een nieuw behaalde high score
  @param {string} newPlace - De nieuwe plaats van de behaalde high score (placeOne, placeTwo, placeThree)
  @param {string} winner - De naam van de winnaar
  @param {number} scored - De score van de winnaar
 */ 
function adjustEntriesScoreboard(newPlace, winner, scored) { 
  let place = newPlace;
  let newScore = scored;
  let nameWinner = winner;
  let newEntry = new EntryScore(nameWinner, newScore); 
  let entryPlaceTwo;
  switch (place) {
    //bij nieuwe plaats 1 worden vorige plaats 1 en 2 doorgeschoven
    case "placeOne": 
      let entryPlaceOne = entriesScoreboard.get("placeOne");
      entryPlaceTwo = entriesScoreboard.get("placeTwo");
      entriesScoreboard.set("placeOne", newEntry);
      entriesScoreboard.set("placeTwo",entryPlaceOne);
      entriesScoreboard.set("placeThree",entryPlaceTwo);
      break;

    //bij nieuwe plaats 2 wordt vorige plaats 2 doorgeschoven
    case "placeTwo": 
      entryPlaceTwo = entriesScoreboard.get("placeTwo");
      entriesScoreboard.set("placeTwo",newEntry);
      entriesScoreboard.set("placeThree",entryPlaceTwo);
      break;

    //bij nieuwe plaats 3 wordt vorige plaats 3 vervangen
    case "placeThree": 
    entriesScoreboard.set("placeThree",newEntry);
    break;
  } 
}


/**
  @function addScoreBoardEntries
  @desc  Ken een nieuwe map toe aan de variabele entriesScoreboard voor de highscores, haal de entries
         voor deze highscores uit de local storage, en vul deze aan in deze map. Indien geen highscores bekend
         wordt een lege entry toegevoegd aan de map
  @param {map} entriesLocalStorage - De scoreboard entries uit de local storage van de webbrowser
 */
function addScoreBoardEntries(entriesLocalStorage){ 
  setKeysScoreboard();
  setEntriesScoreBoard(entriesLocalStorage);
  completeEntriesScoreboard();
} 


/**
  @function setKeysScoreboard
  @desc Initialiseer de variabele met de entries van het scorebord, door toekenning van 
        een Map()object met de vast keys: placeThree, placeTwo, placeOne 
  */
function setKeysScoreboard() { 
  entriesScoreboard = new Map();
  entriesScoreboard.set("placeThree", );
  entriesScoreboard.set("placeTwo", );
  entriesScoreboard.set("placeOne", );
} 


/**
  @function setEntriesScoreBoard
  @desc Vul de map aan met de entries uit de local storage
  @param {map} entriesLocalStorage - De scoreboard entries uit de local storage van de webbrowser
  */
function setEntriesScoreBoard(entriesLocalStorage) { 
  let entries = entriesLocalStorage;
  entries.forEach((entryScore, key) => { 
    entriesScoreboard.set(key, entryScore);
  }); 
} 
  

/**
  @function completeEntriesScoreboard
  @desc Als in de map entriesScoreboard één van de 3 keys geen EntrieScore als waarde heeft, 
        dan krijgt deze key als waarde een EntryScore object zonder naam en met score 0
  */  
function completeEntriesScoreboard() { 
  let places = ["placeOne", "placeTwo", "placeThree"];
  places.forEach(key => { 
    if(entriesScoreboard.get(key) === undefined) { 
      entriesScoreboard.set(key, new EntryScore("", 0));
    } 
  }); 
}  

/***************************************************************************
 **                MODULE SCOREBOARDENTRIES                               **
 ***************************************************************************/
 

 
/***************************************************************************
 **                MODULE SNAKEGAME                                       **
 ***************************************************************************/

var snake,                              // de slang
    foods = [],                         // voedsel voor de slang
    snaketimer,                         // timer van de snake
    gameStatus = INACTIVE;     // status van het spel

var place;


/**
  @function getSnakeSegments
  @desc   Geef de segmenten van de slang
  @return {array} Een array van segmenten
*/
function getSnakeSegments() {
  return snake.segments;
}


/**
  @function getFoods
  @desc   Geef de voedselelementen van het spel
  @return {array} Een array van voedselelementen
*/
function getFoods() {
  return foods;
}

/**
  @function getGameStatus
  @desc   Geef de status van het spel
  @return {string} De status van het spel
*/
function getGameStatus() {
  return gameStatus;
} 


/**
  @function setGameStatus
  @desc  Wijzig de status van het spel
  @param {string} gameStatus - De nieuwe status van het spel
*/
function setGameStatus(status) {
  gameStatus = status;
} 


/**
  @function resetSnakeGame
  @desc Verwijder alle voedselelementen en zet gamestatus op inactief
*/
function resetSnakeGame() { 
  foods = [];
  gameStatus = INACTIVE
}


/**
  @function initSnakeGame
  @desc Activeer het spel indien dit inactief was en maak
        de slang en het voedsel aan
*/
function initSnakeGame() {
  if(gameStatus = INACTIVE) { 
    gameStatus = ACTIVE;
    snake = createStartSnake();
    foods = createFoods(snake);
  }
}


/**
  @function moveSnakeAndResolveCollisions
  @desc  Beweeg slang in de richting die het laatst met de pijljes werd gedrukt, corrigeer
         indien deze uit het canvas zou verdwijnen en verwerk alle acties indien
         er een collision optreedt met zichzelf of foodelement
  @param {string} lastPressedArrowKey - De arrowkey die de gebruiker het laatst heeft ingedrukt
*/
function moveSnakeAndResolveCollisions(lastPressedArrowKey) {
  //bepaal de richting van de volgende kop van de slang en maak nieuw hoofd aan
  determineDirection(lastPressedArrowKey);
  let newHead = createNewHead();

  //herbereken positie nieuw head indien deze buiten het tekenveld zou vallen
  if (elementOutOfBounds(newHead)) {
    refitNewHeadToCanvas(newHead);
  }
  //klaar alle mogelijke collisions uit en update het spel
  resolveCollisionsAndUpdateGame(newHead);
}


/**
  @function resolveCollisionsAndUpdateGame
  @desc  Detecteer alle mogelijke collisions:
           - slang botst niet met zichzelf   -> beweeg slang en eet mogelijk foodelement
           - slang botst met laatste voedsel -> spel gewonnen
           - slang botst met zichzelf        -> spel verloren
  @param {Object} newHead - Het nieuwe hoofd van de slang
*/
function resolveCollisionsAndUpdateGame(newHead) {
  if (!newHead.collidesWithOneOf(snake.segments)) {
    //beweeg de slang indien die niet botst met zichzelf
    moveSnakeAndEatFood(newHead, newHead.collidesWithOneOf(foods));

    //het spel is gewonnen indien al het voedsel is opgegeten
    if (foods.length == 0) {
      determineResultGame();
    }
  // indien slang botst met zichzelf is spel verloren
  } else {
    determineResultGame();
  }
}


/**
  @function determineResultGame
  @desc Bepaal of eindscore een nieuwe highscore is waarbij de speler wint en
        zoniet verliest de gebruiker het spel
*/
function determineResultGame() { 
  place = scoreIsNewHigh();
  if(!place.includes("noHighscore")) { 
    setGameStatus(WON); 
  } else {setGameStatus(LOST);}
} 


/**
  @function determineDirection
  @desc  Wijzig de richting van de slang indien deze niet tegenovergesteld is met 
         de laatste drukte arrow key
  @param {string} lastPressedArrowKey - De arrowkey die de gebruiker het laatst heeft ingedrukt
*/
function determineDirection(lastPressedArrowKey) {
  if (!oppositeDirectionSnake(lastPressedArrowKey)) { 
    snake.setDirection(lastPressedArrowKey);
  }
} 


/**
  @function createNewHead
  @desc   Creëer een nieuw hoofd voor de slang op basis van de huidige richting
          van de slang
  @return {Object} Element met straal R en color HEAD
*/
function createNewHead() {
  let currentHead = snake.segments.at(-1);
  let newHead;

  //maak een nieuwe head aan op basis van laatst ingedrukte arrow key
  switch (snake.getDirection()) {
    case UP:
      newHead = createHead(currentHead.x, currentHead.y - (2 * R));
      break;
    case DOWN:
      newHead = createHead(currentHead.x, currentHead.y + (2 * R));
      break;
    case LEFT:
      newHead = createHead(currentHead.x - (2 * R), currentHead.y);
      break;
    case RIGHT:
      newHead = createHead(currentHead.x + (2 * R), currentHead.y);
      break;
  }
  return newHead; 
}


/**
  @function oppositeDirectionSnake
  @desc   Geef aan of de huidige richting van de slang tegenovergesteld is
          aan de laatste ingedrukte arrow key
  @param  {string} lastPressedArrowKey - De arrowkey die de gebruiker het laatst heeft ingedrukt
  @return {boolean} false indien de huidige richting van slang en laatst gedrukte
                          arrowkey tegenovergesteld zijn
                    anders true
*/
function oppositeDirectionSnake(lastPressedArrowKey) {
  return (snake.getDirection() == UP && lastPressedArrowKey == DOWN) ||
         (snake.getDirection() == DOWN && lastPressedArrowKey == UP) ||
         (snake.getDirection() == LEFT && lastPressedArrowKey == RIGHT) ||
         (snake.getDirection() == RIGHT && lastPressedArrowKey == LEFT);
}


/**
  @function elementOutOfBounds
  @desc   Geef aan of het element buiten het canvas valt
  @param  {Object} element - Het te toetsen element
  @return {boolean} true bij:
                       - element van buiten het canvas
                    anders false
*/
function elementOutOfBounds(element) {
  return element.x < XMIN || element.x > xMax ||
         element.y < YMIN || element.y > yMax;
}


/**
  @function refitNewHeadToCanvas
  @desc Pas de x of y coordinaat van het nieuwe hoofd aan
        zodat deze weer binnen het canvas valt
  @param {Object} element - Het te wijzigen element
*/
function refitNewHeadToCanvas(element) {
  switch (snake.getDirection()) {
    case UP:
      element.y = yMax;
      break;
    case DOWN:
      element.y = YMIN;
      break;
    case LEFT:
      element.x = xMax;
      break;
    case RIGHT:
      element.x = XMIN;
      break;
  }
}


/**
  @function moveSnakeAndEatFood
  @desc  Past coordinaten van de slang en reageer indien deze
         met voedsel botst
  @param {Object} newHead - Het nieuwe hoofd van de slang
  @param {boolean} foodCollision false bij botsing nieuwe head met voedsel
                                 anders true
*/
function moveSnakeAndEatFood(newHead, foodCollision) {
  snake.segments.at(-1).color = SNAKE;
  snake.segments.push(newHead);

  //indien geen botsing met voedsel wordt laatste element van de staart verwijderd
  if(!foodCollision) {
    snake.segments.shift();

    //indien botsing voedsel wordt voedsel verwijderd en score aangepast
  } else {
    removeFood(newHead.x, newHead.y);
    changeScore();
  }
}


/**
  @function removeFood
  @desc  Verwijder voedsel op een gegeven x en y coordinaat
  @param {number} x - Het x-coordinaat
  @param {number} y - Het y-coordinaat
*/
function removeFood(x, y) {
  //ga alle elementen af in de array foods 
  for(var i = 0; i < foods.length; i++){

    //verwijder voedsel dat op de meegegeven coordinaten staat
    if (foods[i].x == x && foods[i].y == y) { 
      foods.splice(i, 1); 
    } 
  } 
}
 
/***************************************************************************
 **                  MODULE SNAKEGAME                                      **
 ***************************************************************************/





/***************************************************************************
 **                  MODULE CANVASCONTROLLER                               **
 ***************************************************************************/

var width,                             // breedte van het tekenveld
    height,                            // hoogte van het tekenveld
    snaketimer,                        // timer die snakegame controleert
    lastPressedArrowKey = UP; // string van de laatst gedrukte arrow key


//eventlisteners voor het indrukken van de arrowkeys
$(document).keydown(function (e) {
  switch (e.code) {
    case "ArrowLeft":
      lastPressedArrowKey = LEFT;
      break;
    case "ArrowUp":
      lastPressedArrowKey = UP;
      break;
    case "ArrowRight":
      lastPressedArrowKey = RIGHT;
      break;
    case "ArrowDown":
      lastPressedArrowKey = DOWN;
      break;
  }
});


//uit te voeren acties wanneer de webpagina volledig is geladen
$(document).ready(function () {
  getDimensionsCanvas();
  setMaxCoordinates(width, height);
  $("#stopSnake").click(stop);
  $("#startSnake").click(start);
});


/**
  @function getDimensionsCanvas
  @desc Haal de hoogte en wijdte van het canvas op via het DOM-object
        en sla deze op in variabelen
*/
function getDimensionsCanvas() {
  width = $("#mySnakeCanvas").innerWidth();
  height = $("#mySnakeCanvas").innerHeight();
}


/**
  @function stop
  @desc Maak het canvas leeg, stop de timer en reset het spel
*/
function stop() {
  $("#mySnakeCanvas").clearCanvas();
  clearInterval(snaketimer);
  resetSnakeGame(); 
}


/**
  @function start
  @desc Start het spel, initialiseer het scorebord, teken het begin van het spel
        op het canavs en start de timer van het spel
*/
function start() {
  initSnakeGame();
  resetScoreAndAdjustScoreboard();
  draw();
  snaketimer = setInterval(function() {
    updateGameAndViewer();}, SLEEPTIME); 
}


/**
  @function updateGameAndViewer
  @desc Beweeg de slang volgens de timer en handel elke soort collision af,
        teken de nieuwe status van het spel, bepaal winst of verlies en
        pas de score aan
*/
function updateGameAndViewer() {
  moveSnakeAndResolveCollisions(lastPressedArrowKey);
  draw();
  determineResult();
  setScoreField();
}


/**
  @function determineResult
  @desc Bepaal de uitkomst van het spel bij winst of verlies en pas 
        de viewer hierop aan, doe niks indien geen winst of verlies
*/
function determineResult(){
  let status = getGameStatus();
  switch(status) {
    case WON:
      stop();
      drawGewonnen();
      gewonnen(place);
      lastPressedArrowKey = UP;
      break;
    case LOST:
      stop();
      drawVerloren();
      lastPressedArrowKey = UP;
      break;
  }
}


/**
  @function draw
  @desc Teken de slang en het voedsel op het canvas
*/
function draw() {
  var canvas = $("#mySnakeCanvas").clearCanvas();
  drawElements(getSnakeSegments(), canvas);
  drawElements(getFoods(), canvas);
}


/**
  @function drawElements
  @desc  Teken meerdere elementen op het canvas
  @param {array} elements - Een array van te tekenen elementen
  @param {object} canvas - Het tekenveld
 */
function drawElements(elements, canvas) {
  elements.forEach(function (element) {
    drawElement(element, canvas);
  });
}


/**
  @function drawElement
  @desc   Teken een element
  @param  {object} element - Het te tekenen element
  @param  {object} canvas - Het tekenveld
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
  @function drawVerloren
  @desc Teken een afbeelding op het canvas dat aangeeft dat gebruiker is verloren
*/
function drawVerloren() {
  $("#mySnakeCanvas").drawImage({
    source: 'img/sad_snake.jpg',
    x: 210, y: 240,
    scale : 0.5
  });
}


/**
  @function drawGewonnen
  @desc Teken een afbeelding op het canvas dat aangeeft dat gebruiker is gewonnen
*/
function drawGewonnen() {
  $("#mySnakeCanvas").drawImage({
    source: 'img/newHighScore.jpg',
    x: 230, y: 190,
    scale : 1
  });
}


/***************************************************************************
 **                   MODULE CANVASCONTROLLER                              **
 ***************************************************************************/




/***************************************************************************
 **                 MODULE SCOREBOARDCONTROLLER                            **
 ***************************************************************************/

var enterWinnerNameTimer;           // timer die de input van de naam van de winnaar controleert


/**
  @function setScoreField
  @desc Vul het scoreveld in met de score van het spel
*/
function setScoreField() {
  let scored = getScore();
  $(".scorefield4").text(scored);
} 


/**
  @function getScoreField
  @desc   Haal de huidig afgebeelde score op van het scoreveld
  @return {string} De score ingevuld in het scoreveld
*/
function getScoreField() { 
  return $(".scorefield4").text();
}


/**
  @function resetScoreAndAdjustScoreboard
  @desc Reset de score van het spel, de score op het scoreveld en de 
        naam van de winnaar, verwijder het inputveld uit de viewer en
        initialiseer het scorebord met de nieuwe highscores
*/
function resetScoreAndAdjustScoreboard() {$
  resetScore();
  resetScoreField();
  removeNameInputFields();
  resetNameWinner();
  clearInterval(enterWinnerNameTimer);
  initEntriesScoreBoard();
}


/**
  @function resetScoreField
  @desc Zet de waarde van het scoreveld naar 0
*/
function resetScoreField() { 
  $(".scorefield4").text(0);
}


/**
  @function  removeNameInputFields
  @desc Verwijder het label, het inputveld en de knop waar de winnaar
        zijn/haar naam kan invoeren
*/
function removeNameInputFields() { 
  let labelCollection = document.getElementsByTagName("label");
  let labe1One = labelCollection[10];
  let labe1Two = labelCollection[11];
  if(labe1One !== undefined && labe1Two !== undefined ) { 
    labe1One.remove();
    labe1Two.remove();
  } 
  let buttonCollection = document.getElementsByTagName("button");
  let button = buttonCollection[0];
  if(button !== undefined) { 
    button.remove();
  } 
  let nameFieldCollection = document.getElementsByTagName("INPUT");
  let nameField = nameFieldCollection[2];
  if(nameField !== undefined) { 
    nameField.remove();
  } 
}


/**
  @function  setEntriesScoreBoard
  @desc Voeg de in de local storage aanwezige entries (met plek, score en naam winnaar)toe 
        aan het scorebord en aan de applicatie
*/
function initEntriesScoreBoard() { 
  let entriesForScoreboard = getEntriesLocalStorage();
  addScoreBoardEntries(entriesForScoreboard); 
  assignScoreBoardToFields();
}


/**
  @function assignScoreBoardToFields
  @desc Zet de entries van het scorebord in het scorebord van de applicatie. 
*/  
function assignScoreBoardToFields() { 
  let entries = getEntriesScoreBoard();
  entries.forEach((entryScore, key) => { ; 
    switch (key) {
    case "placeOne": 
    $(".namefield1").text(entryScore.name);
    $(".scorefield1").text(entryScore.score);
    break;
    case "placeTwo": 
    $(".namefield2").text(entryScore.name);
    $(".scorefield2").text(entryScore.score);
    break;
    case "placeThree": 
    $(".namefield3").text(entryScore.name);
    $(".scorefield3").text(entryScore.score);
    break;
    } 
  }); 
} 


/**
  @function gewonnen
  @desc Maak een inputveld aan waar de winnaar zijn naam kan schrijven en 
        detecteer deze input aan de hand van een timer
  @param {string} place - De plaats van de nieuwe winnaar
*/
function gewonnen(place) {
  createNameInputFields();
  enterWinnerNameTimer = setInterval(function() {
    procesScoreOfWinner(place);}, WAITFORNAMEWINNER);
}


/**
  @function createNameInputFields
  @desc Creëer het inputveld, de button en de eventlistener zodat
        de winnaar zijn/haar naam kan invoeren. 
*/
function createNameInputFields() { 
    createWhiteSpaces();
    createEnterNameButton();
    createEnterNameField();
    createEventlisterer();
} 


/**
  @function createWhiteSpaces
  @desc Creëer een witte ruimte 
*/
function createWhiteSpaces() { 
  let labe1One = document.createElement("label");
  let labe1Two = document.createElement("label");
  $(".scoreboard").append(labe1One);
  $(".scoreboard").append(labe1Two);
} 


/**
  @function createEnterNameButton
  @desc Creëer button zodat de winnaar zijn/haar naam kan valideren
*/
function createEnterNameButton() { 
  let button = document.createElement("button");
  button.innerHTML = "Enter name";
  $(".scoreboard").append(button);  
} 


/**
  @function createEnterNameField
  @desc Creëer input veld zodat de winnaar zijn/haar naam kan invoeren
*/
function createEnterNameField() { 
  let nameField = document.createElement("INPUT");
  nameField.setAttribute("type", "text");
  $(".scoreboard").append(nameField);
} 


/**
  @function  createEventlisterer
  @desc Eventlistener voor de knop naast het inputveld die de naam van de 
        winnaar opslaat
*/
function createEventlisterer() { 
  let buttonCollection = document.getElementsByTagName("button");
  let nameFieldCollection = document.getElementsByTagName("INPUT");
  let button = buttonCollection[0];
  let nameField = nameFieldCollection[2]
  buttonCollection[0].addEventListener("click", function() {
    let nameWinner = nameFieldCollection[2].value.substring(0, 13);
    setNameWinner(nameWinner);
  });
} 


/**
  @function procesScoreOfWinner
  @desc  Bepaal de plaats, score en naam van de winnaar en pas hiermee het 
         scorebord en de entries in de local storage aan. Verwijder het
         inputveld en stop de timer voor de naam in te vullen
  @param {string} newplace - De plaats die de winnaar moet krijgen in het scorebord
*/
function procesScoreOfWinner(newplace) { 
  let newPlace = newplace;
  let scored = getScore();
  let nameWinner = getNameWinner();
  if (nameWinner !== undefined) { 
    changeScoreboard(newPlace, nameWinner, scored);
    addEntriesScoreboardToLocalStorage();
    removeNameInputFields();
    clearInterval(enterWinnerNameTimer);
  }   
} 


/**
  @function changeScoreboard
  @desc Pas de entries van het scorebord aan in het domein en pas de waarden 
        in het scorebord aan in de applicatie indien er een nieuwe high score is.
  @param {string} newplace - De plaats die de winnaar moet krijgen in het scorebord
  @param {string} name - De naam van de winnaar
  @param {number} score - De score die de winnaar heeft behaald
 */
function changeScoreboard(newplace, name, score) {
  let newPlace = newplace;
  let nameWinner = name;
  let scored = score;
  adjustEntriesScoreboard(newPlace, nameWinner, scored);
  assignScoreBoardToFields();
}


/**
  @function  addEntriesToLocalStorage
  @desc Voeg de entries van het scorebord toe aan de local storage 
 */
function addEntriesScoreboardToLocalStorage() { 
  let entriesScoreboard = getEntriesScoreBoard();
  addEntriesToLocalStorage(entriesScoreboard);
}  


/***************************************************************************
 **                 MODULE SCOREBOARDCONTROLLER                            **
 ***************************************************************************/




/***************************************************************************
 **                MODULE LOCALSTORAGE                                **
 ***************************************************************************/

/**
  @function setScoreBoard
  @desc   Haal de keys op uit de local storage, filter enkel de keys die het spel gebruikt en
          haal hun overeenkomstige values op. Ken deze toe aan een Map object en vul indien nodig
          lege plaatsen op
  @return {map} Een map met de entries van de local storage van de browser
 */
function getEntriesLocalStorage(){ 
  let keysLocalStorage = getKeysLocalStorage();
  let filteredKeysLocalStorage = filterKeysLocalStorage(keysLocalStorage);
  let localEntries = entriesLocalStorage(filteredKeysLocalStorage);
  return localEntries;
} 


/**
  @function getKeysLocalStorage
  @desc   Lees de keys van de local storage van de webbrowser in
  @return {array} Een array met de keys van de local storage
  */
function getKeysLocalStorage() { 
  let keysLocalStorage = []; 
  let index = localStorage.length - 1;
  while(index >= 0) { 
    let keyName = localStorage.key(index);
    keysLocalStorage.push(keyName);
    index--;
  } 
  return keysLocalStorage;
} 


/**
  @function filterKeysLocalStorage
  @desc   Filter de keys van de local storage op entries: placeThree, placeTwo, placeOne
  @param  {array} keysLocalStorage - Een array met keys uit de local storage van de webbrowser
  @return {array} Een array met keys (mits aanwezig in local storage): placeThree, placeTwo, placeOne 
  */
function filterKeysLocalStorage(keys) { 
  let filteredKeysLocalStorage = []; 
  if(keys.length <= 0) { 
    return keys
  } 
  keys.forEach(key => {
      if(key.includes("placeOne") || key.includes("placeTwo") || key.includes("placeThree")) { 
        filteredKeysLocalStorage.push(key);
      }});
  return filteredKeysLocalStorage;
} 
  

/**
  @function getEntriesLocalStorage
  @desc   Haal de entries, met naam en score, uit de local storage van de webbrowser 
          en vul met de waarden de variabele entriesScoreboard. De entries uit de local storage worden omgezet
          in een object EntryScore
  @param  {array} filteredKeysLocalStorage - Een array met keys (mits aanwezig in local storage): placeThree, placeTwo, placeOne
  @return {map} Een Map object met alle entries die bij de keys horen
  */
function entriesLocalStorage(filteredKeys) { 
  let entries = new Map();
  filteredKeys.forEach(key => { 
    let entryScore = JSON.parse(localStorage.getItem(key));
    if (entryScore === null) {  
      entryScore = new EntryScore();
    }
    entries.set(key, entryScore);
  }); 
  return entries;
} 
  

/**
  @function addEntriesToLocalStorage
  @desc  Voeg de key/value paren van de map entriesScoreboard toe aan de local storage van de webbrowser,
         het entryScore object worden omgezet naar een string format. 
  @param {map} Een map die alle informatie van de 3 scorebord omvat
  */
function addEntriesToLocalStorage(scoreboard) {
  let entries = scoreboard
  entries.forEach((entry, key) => { 
    localStorage.setItem(key, JSON.stringify(entry));
  });
}

/***************************************************************************
 **                MODULE LOCALSTORAGE                                **
 ***************************************************************************/