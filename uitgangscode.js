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
    snaketimer,               // timer van de snake
    spelGestart = false,      // status van het spel

    xMax,                     // maximale waarde van x
    yMax                      // maximale waarde van y

    lastPressedArrowKey = UP; // string van de laatst gedrukte arrow key

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

$(document).ready(function () {
    prepareCanvas();
    $("#stopSnake").click(stopGame);
    $("#startSnake").click(init);
});

/**
  @function prepareCanvas() -> void
  @desc Haal de afmetingen van het canvas op en indien nodig pas deze aan
        om de elementen mooi af te beelden, sla het max en min van de coordinaten op
*/
function prepareCanvas() {
    getDimensionsCanvas();

    //DEZE FUNCTIE WERKT NOG NIET, HET CANVAS WORDT AANGEPAST NAAR PX AFMETINGEN WAT NIET MAG
    //indien hoogte of breedte niet deelbaar is door 2 R dient het canvas
    //nieuwe afmetingen te krijgen om de elementen mooi af te kunnen beelden
    if (width % (2 * R) != 0 ||
        height % (2 * R) != 0) {

        var newSize = Math.floor(width / (2 * R)) * 2 * R;

        //pas nieuwe afmetingen toe op canvas en sla deze afmetingen op in variabelen
        $("#mySnakeCanvas").innerWidth(newSize);
        $("#mySnakeCanvas").innerHeight(newSize);
        getDimensionsCanvas();
    }
    //toekennen van max waarde die x of y kan hebben
    xMax = width - R;     
    yMax = height - R;    
}

/**
  @function getDimensionsCanvas() -> void
  @desc Haal de hoogte en wijdte van het canvas op via het DOM-object
        en sla deze op in variabelen
*/
function getDimensionsCanvas() {
    width = $("#mySnakeCanvas").innerWidth();
    height = $("#mySnakeCanvas").innerHeight();
}

/**
  @function stopGame() -> void
  @desc Maak het canvas leeg, stop de timer, maak de array met voedsel leeg,
        maak status gameGestart false en maak lastPressedKey terug naar boven
*/
function stopGame() { 
  $("#mySnakeCanvas").clearCanvas(); 
  clearInterval(snaketimer);
  
  //Aanvulling Laurens 
   clearInterval(enterWinnerNameTimer);
   resetScore();
   removeEnterNameFields();
   //Aanvulling Laurens
  
  foods = [];
  spelGestart = false 
  lastPressedArrowKey = UP;
} 

/**
  @function init() -> void
  @desc Haal eventueel bestaand voedsel en een bestaande slang weg, 
        cre\"eer een slang, genereer voedsel en teken deze elementen
        en start de timer die de slang doet bewegen
*/
function init() {
    if(spelGestart == false) { 
        spelGestart = true
        
		//Aanvulling Laurens
		fillScoreField();
		removeEnterNameFields();
		clearInterval(enterWinnerNameTimer);
		resetNameWinner();
		getContentLocalStorage();
		//Aanvulling Laurens
		
		createStartSnake();
        createFoods();
        draw();
        snaketimer = setInterval(function() {
            move(lastPressedArrowKey);}, SLEEPTIME);
    } 
}

/**
  @function draw() -> void
  @desc Teken de slang en het voedsel op het canvas
*/
function draw() {
    var canvas = $("#mySnakeCanvas").clearCanvas();
    drawElements(snake.segments, canvas);
    drawElements(foods, canvas);
}

/**
  @function move() -> void
  @desc Beweeg slang in de richting die het laatst met de pijljes werd gedrukt, corrigeer
        indien deze uit het canvas zou verdwijnen en verlies het spel indien slang botst
        met zichzelf
*/
function move() {
    //bepaal de richting van de volgende kop van de slang 
    determineDirection();
    newHead = createNewHead();
	
	//aanvulling Laurens 
	let foodCollision = false; 
	let noFoodsLeft = foods.length <= 1;
	
	
    //behandel mogelijke collisions van slang en voedsel
	if (!newHead.collidesWithOneOf(snake.segments)) {
	foodCollision = newHead.collidesWithOneOf(foods);
	updateSnakeCoordinaten(newHead, foodCollision);
	draw();
	} else {determineResultGame();}
	if (foodCollision && noFoodsLeft) { 
	  determineResultGame(); 
	}  
}

/**
  @function determineDirection() -> void
  @desc Wijzig de richting van de slang indien deze niet tegenovergesteld is met 
        de laatste drukte arrow key
*/
function determineDirection() {
    if (!oppositeDirectionSnake()) { 
        snake.setDirection(lastPressedArrowKey);
    }
} 

/**
  @function oppositeDirectionSnake() -> boolean
  @desc Geef aan of de huidige richting van de slang tegenovergesteld is
        aan de laatste ingedrukte arrow key
  @return {boolean} false indien de huidige richting van slang en laatst gedrukte
                          arrowkey tegenovergesteld zijn
                    anders true
*/
function oppositeDirectionSnake() {
    return (snake.getDirection() == UP && lastPressedArrowKey == DOWN) ||
            (snake.getDirection() == DOWN && lastPressedArrowKey == UP) ||
            (snake.getDirection() == LEFT && lastPressedArrowKey == RIGHT) ||
            (snake.getDirection() == RIGHT && lastPressedArrowKey == LEFT);
}

/**
  @function createNewHead() -> Element
  @desc Bereken de positie van het nieuwe hoofd van de slang indien deze binnen
        of buiten het canvas valt
  @return {Element} met straal R en color HEAD
*/
function createNewHead() {
    let currentHead = snake.segments.at(-1);
    let newHead;

    //maak een nieuwe head aan op basis van laatst ingedrukte arrow key
    switch (lastPressedArrowKey) {
        case UP:
            newHead = createHead(currentHead.x, currentHead.y - (2*R));
            break;
        case DOWN:
            newHead = createHead(currentHead.x, currentHead.y + (2*R));
            break;
        case LEFT:
            newHead = createHead(currentHead.x - (2*R), currentHead.y);
            break;
        case RIGHT:
            newHead = createHead(currentHead.x + (2*R), currentHead.y);
            break;
    }

    //herbereken positie nieuwe head indien deze buiten het canvas zou vallen
    if (elementOutOfBounds(newHead)) {
        refitNewHeadToCanvas(newHead);
    }
    return newHead;
}

/**
  @function elementOutOfBounds(element) -> boolean
  @desc Geef aan of het element buiten het canvas valt
  @param {Element} element een Element object
  @return {boolean} false bij:
                       - element van buiten het canvas
                    anders true
*/
function elementOutOfBounds(element) {
    return element.x < XMIN || element.x > xMax ||
            element.y < YMIN || element.y > yMax;
}


/**
  @function refitNewHeadToCanvas(element) -> void
  @desc Pas de x of y coordinaat van het nieuwe hoofd aan
        zodat deze weer binnen het canvas valt
  @param {Element} element een Element object
*/
function refitNewHeadToCanvas(element) {
    switch (lastPressedArrowKey) {
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
  @function updateSnakeCoordinaten(newHead, foodCollision) -> void
  @desc Past coordinaten van de slang en reageer indien deze
        met voedsel botst
  @param {Element} newHead de nieuwe head van de slang
  @param {boolean} foodCollision false bij botsing nieuwe head met voedsel
                                 anders true
*/
function updateSnakeCoordinaten(newHead, foodCollision) {
    snake.segments.at(-1).color = SNAKE;
    snake.segments.push(newHead);
    if(!foodCollision) {
        snake.segments.shift();
    } else {
        removeFood(newHead.x, newHead.y);
		//Aanvulling Laurens
		setScore();
    }
}

/**
  @function removeFood(x, y) -> void
  @desc Verwijder voedsel indien deze op een gegeven x en y coordinaat ligt
  @param {number} x x-coordinaat
  @param {number} y y-coordinaat
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

/**
  @function verloren() -> void
  @desc Stop het spel en geef aan de gebruiker aan dat deze verloren is
*/
function verloren() {
    stopGame();
    drawVerloren();
}

/**
  @function drawVerloren -> void
  @desc Teken een afbeelding op het canvas dat duidelijk aangeeft dat gebruiker is verloren
*/
function drawVerloren() {
    $("#mySnakeCanvas").drawImage({
    source: 'sad_snake.jpg',
    x: 210, y: 240,
    scale : 0.5
    });
}


////////////////Aanvulling Laurens 



var place;

function gewonnen(place) {
	stopGame();
	drawGewonnen();
	enterNameFields();
	
	enterWinnerNameTimer = setInterval(function() {
    checkIfNameWinnerIsPresent();}, WAITFORNAMEWINNER);
}

function drawGewonnen() {
	$("#mySnakeCanvas").drawImage({
	source: 'newHighScore.jpg',
	x: 230, y: 190,
	scale : 1
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
    this.direction = UP;
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

/**
  @function collidesWithOneOf(elements) -> boolean
  @desc Geef aan dit element bots met een andere array van elementen
  @param [Element] elements een array van elementen
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
 **                 Hulpfuncties                                          **
 ***************************************************************************/
 
/**
  @function createStartSnake() -> Snake
  @desc Slang creëren, bestaande uit  twee segmenten, 
        in het midden van het veld
  @return: slang volgens specificaties
*/
function createStartSnake() {
    var segments   = [createSegment(width/2, height/2), 
                      createHead(width/2, height/2 - 2 * R)];
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
    //genereer willekeurig getal dat deelbaar is door 2*R
    //dit zorgt ervoor dat x en y zo gekozen worden dat ze mooi op canvas worden afgebeeld
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
  @return {boolean} false bij:
                       - geen getal
                       - kleiner dan 0;
                    anders true
*/
function isPosInteger(x) {
    return x >= 0 && Number.isInteger(x);
}

/***************************************************************************
 **                 Score                                         **
 ***************************************************************************/
 
var score = 0; 
var nameWinner;

 

function getNameWinner() { 
	return nameWinner; 
} 

function resetNameWinner() { 
	nameWinner = undefined;
} 


function setScore(){
	changeScore();
	fillScoreField();
} 
	
function changeScore() { 
	score = score + 10;
} 
	
function resetScore() { 
	score = 0;
	
} 

function getScore() { 
	return score; //$(".scorefield4").text();
	
} 

function scoreIsNewHigh(score) { 
	let newPlace = "noHighscore"; 
	let intermediateScore = 0; 
	entriesLocalStorage.forEach((entry, key) => { 
		let entryScore = entry.score; 
		console.log(score >= entryScore && entryScore >=  intermediateScore);
		if (+score >= +entryScore && +entryScore >=  +intermediateScore){ 
			intermediateScore = entryScore;
			newPlace = key;	
		}
	}); 
	return newPlace;
} 

function adjustEntriesLocalStorage(place, newName) { 
		newScore = getScoreField();
		newEntry = new EntryScore(newName, newScore); 
		//console.log(place);
		switch (place) {
		case "placeOne": 
		entryPlaceOne = entriesLocalStorage.get("placeOne");
		entryPlaceTwo = entriesLocalStorage.get("placeTwo");
		entriesLocalStorage.set("placeOne", newEntry);
		entriesLocalStorage.set("placeTwo",entryPlaceOne);
		entriesLocalStorage.set("placeThree",entryPlaceTwo);
		break;
		case "placeTwo": 
		entryPlaceTwo = entriesLocalStorage.get("placeTwo");
		entriesLocalStorage.set("placeTwo",newEntry);
		entriesLocalStorage.set("placeThree",entryPlaceTwo);
		break;
		case "placeThree": 
		entriesLocalStorage.set("placeThree",newEntry);
		break;
		} 
} 





/***************************************************************************
 **                 LocalStorage                                    **
 ***************************************************************************/

//localStorage.clear();

/**
entry1 = JSON.stringify(new EntryScore("SnakeKiller030", 40, true));
entry2 = JSON.stringify(new EntryScore("Joop", 60, true));
entry3 = JSON.stringify(new EntryScore("Aagje", 200, true));
entry3 = JSON.stringify(new EntryScore("Aagj", 30, true));
localStorage.setItem("placeOne",entry2);
localStorage.setItem("placeTwo",entry1);
//localStorage.setItem("placeThree",entry3);
localStorage.setItem("hey",entry3);
localStorage.setItem("gek",entry3);
*/

var entriesLocalStorage;
	

function EntryScore(name, scored) { 
	this.name = name;
	this.score = scored;

} 

function getContentLocalStorage(){ 
	initEntriesLocalStorage();
	let keysLocalStorage = getKeysLocalStorage();
	let filteredKeysLocalStorage = filterKeysLocalStorage(keysLocalStorage);
	entriesLocalStorage = getEntriesLocalStorage(filteredKeysLocalStorage);
	completeEntriesLocalStorage();
	assignStorageToScorefields(entriesLocalStorage);
	addEntriesToLocalStorage();
} 


function initEntriesLocalStorage() { 
	entriesLocalStorage = new Map();
	entriesLocalStorage.set("placeThree", );
	entriesLocalStorage.set("placeTwo", );
	entriesLocalStorage.set("placeOne", );
} 

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
	

function getEntriesLocalStorage(filteredKeys) { 
	filteredKeys.forEach(key => { 
		let entryScore = JSON.parse(localStorage.getItem(key));
		if (entryScore === null) {  
			entryScore = new EntryScore();
		}
		entriesLocalStorage.set(key, entryScore);
	}); 
	return  entriesLocalStorage;
}	
	
	
function completeEntriesLocalStorage() { 
	let places = ["placeOne", "placeTwo", "placeThree"];
	places.forEach(key => { 
		if(entriesLocalStorage.get(key) === undefined) { 
			entriesLocalStorage.set(key, new EntryScore("", 0));
		} 
	});	
} 


function addEntriesToLocalStorage() {
	entriesLocalStorage.forEach((entry, key) => { 
		localStorage.setItem(key, JSON.stringify(entry));
	});
} 



/***************************************************************************
 **                 Application                                          **
 ***************************************************************************/

var enterWinnerNameTimer;
WAITFORNAMEWINNER = 1000


function fillScoreField() {
	$(".scorefield4").text(score);
} 



function getScoreField() { 
	return $(".scorefield4").text();
}



function changeScoreWithinGame(newPlace, name) {
	let place = newPlace;
	if(!place.includes("noHighscore")) {
		adjustEntriesLocalStorage(place, name);
		addEntriesToLocalStorage();
		assignStorageToScorefields(entriesLocalStorage);
	} 
}
	

	
function assignStorageToScorefields(sortedEntries) { 
	entriesLocalStorage.forEach((entryScore, key) => { ; 
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

function determineResultGame() { 
	let result = getScoreField();
	place = scoreIsNewHigh(result);
	if(!place.includes("noHighscore")) { 
		gewonnen(place); 
	} else {verloren();}
 } 


function enterNameFields() { 
		createEnterNameButton();
		createEnterNameField();
		createEventlisterer();
} 



function createEnterNameButton() { 
	labe1One = document.createElement("label");
	labe1Two = document.createElement("label");
	$(".scoreboard").append(labe1One);
	$(".scoreboard").append(labe1Two);
	var button = document.createElement("button");
	button.innerHTML = "Enter name";
	$(".scoreboard").append(button);	
	
} 

function createEnterNameField() { 
	var nameField = document.createElement("INPUT");
	nameField.setAttribute("type", "text");
	$(".scoreboard").append(nameField);
} 

function createEventlisterer() { 
	buttonCollection = document.getElementsByTagName("button");
	nameFieldCollection = document.getElementsByTagName("INPUT");
	button = buttonCollection[0];
	nameField = nameFieldCollection[2]
	buttonCollection[0].addEventListener("click", function() {
	nameWinner = nameFieldCollection[2].value.substring(0, 13);
	});
	return nameWinner;
} 



function checkIfNameWinnerIsPresent() { 
	console.log(score);
	nameWinner = getNameWinner();
	if (nameWinner !== undefined) { 

		changeScoreWithinGame(place, nameWinner);
		removeEnterNameFields();
		clearInterval(enterWinnerNameTimer);
	} 	
} 


function removeEnterNameFields() { 
	labelCollection = document.getElementsByTagName("label");
	labe1One = labelCollection[10];
	labe1Two = labelCollection[11];
	
	if(labe1One !== undefined && labe1Two !== undefined ) { 
		labe1One.remove();
		labe1Two.remove();
	} 
	
	buttonCollection = document.getElementsByTagName("button");
	button = buttonCollection[0];
	if(button !== undefined) { 
		button.remove();
	} 
	
	nameFieldCollection = document.getElementsByTagName("INPUT");
	nameField = nameFieldCollection[2];
	if(nameField !== undefined) { 
		nameField.remove();
	} 
} 
