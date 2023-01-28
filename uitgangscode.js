import * as settings from "./settings.js";
import {Element} from "./element.js";
import {Snake} from "./snake.js";
import {createFood} from "./food.js";
    
var snake,
    foods = [],                        // voedsel voor de slang
    width,                             // breedte van het tekenveld
    height,                            // hoogte van het tekenveld
    snaketimer,                        // timer van de snake
    spelGestart = false,               // status van het spel

    xMax,                              // maximale waarde van x
    yMax,                              // maximale waarde van y

    lastPressedArrowKey = settings.UP; // string van de laatst gedrukte arrow key


$(document).keydown(function (e) {
    switch (e.code) {
    case "ArrowLeft":
       lastPressedArrowKey = settings.LEFT;
       break;
    case "ArrowUp":
       lastPressedArrowKey = settings.UP;
       break;
    case "ArrowRight":
       lastPressedArrowKey = settings.RIGHT;
       break;
    case "ArrowDown":
       lastPressedArrowKey = settings.DOWN;
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

    //toekennen van max waarde die x of y kan hebben
    xMax = width - settings.R;     
    yMax = height - settings.R;    
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
  lastPressedArrowKey = settings.UP;
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
        foods = createFoods();
        draw();
        snaketimer = setInterval(function() {
            move(lastPressedArrowKey);}, settings.SLEEPTIME);
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
    let newHead = createNewHead();
	
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
    return (snake.getDirection() == settings.UP && lastPressedArrowKey == settings.DOWN) ||
            (snake.getDirection() == settings.DOWN && lastPressedArrowKey == settings.UP) ||
            (snake.getDirection() == settings.LEFT && lastPressedArrowKey == settings.RIGHT) ||
            (snake.getDirection() == settings.RIGHT && lastPressedArrowKey == settings.LEFT);
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
    switch (snake.getDirection()) {
        case settings.UP:
            newHead = createHead(currentHead.x, currentHead.y - (2 * settings.R));
            break;
        case settings.DOWN:
            newHead = createHead(currentHead.x, currentHead.y + (2 * settings.R));
            break;
        case settings.LEFT:
            newHead = createHead(currentHead.x - (2 * settings.R), currentHead.y);
            break;
        case settings.RIGHT:
            newHead = createHead(currentHead.x + (2 * settings.R), currentHead.y);
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
    return element.x < settings.XMIN || element.x > xMax ||
            element.y < settings.YMIN || element.y > yMax;
}


/**
  @function refitNewHeadToCanvas(element) -> void
  @desc Pas de x of y coordinaat van het nieuwe hoofd aan
        zodat deze weer binnen het canvas valt
  @param {Element} element een Element object
*/
function refitNewHeadToCanvas(element) {
    switch (snake.getDirection()) {
        case settings.UP:
            element.y = yMax;
            break;
        case settings.DOWN:
            element.y = settings.YMIN;
            break;
        case settings.LEFT:
            element.x = xMax;
            break;
        case settings.RIGHT:
            element.x = settings.XMIN;
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
    snake.segments.at(-1).color = settings.SNAKE;
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
    checkIfNameWinnerIsPresent();}, settings.WAITFORNAMEWINNER);
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
                      createHead(width/2, height/2 - 2 * settings.R)];
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
    return new Element(settings.R, x, y, settings.SNAKE);
}

/**
  @function createHead(x,y) -> Element
  @desc Head slang creeren op een bepaalde plaats
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaart middelpunt
  @return: {Element} met straal R en color HEAD
*/
function createHead(x, y) {
    return new Element(settings.R, x, y, settings.HEAD);
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
        food,
        foods;
   while (i < settings.NUMFOODS ) {
     food = createFood(settings.XMIN + getRandomMultipleOfRadius(0, xMax), 
                        settings.YMIN + getRandomMultipleOfRadius(0, yMax));
     if (!food.collidesWithOneOf(snake.segments) && !food.collidesWithOneOf(foods)) {
       foods.push(food);
       i++
     }
   }
   return foods;  
}



/***************************************************************************
 **                 Score                                         **
 ***************************************************************************/
 
var score = 0; 
var nameWinner;

var entriesLocalStorage;

 

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
		let newScore = getScoreField();
		let newEntry = new EntryScore(newName, newScore); 
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
	let entriesLocalStorage = getEntriesLocalStorage(filteredKeysLocalStorage);
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
	let place = scoreIsNewHigh(result);
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
	let labe1One = document.createElement("label");
	let labe1Two = document.createElement("label");
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
	let buttonCollection = document.getElementsByTagName("button");
	let nameFieldCollection = document.getElementsByTagName("INPUT");
	let button = buttonCollection[0];
	let nameField = nameFieldCollection[2]
	buttonCollection[0].addEventListener("click", function() {
	let nameWinner = nameFieldCollection[2].value.substring(0, 13);
	});
	return nameWinner;
} 



function checkIfNameWinnerIsPresent() { 
	console.log(score);
	var nameWinner = getNameWinner();
	if (nameWinner !== undefined) { 

		changeScoreWithinGame(place, nameWinner);
		removeEnterNameFields();
		clearInterval(enterWinnerNameTimer);
	} 	
} 


function removeEnterNameFields() { 
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
