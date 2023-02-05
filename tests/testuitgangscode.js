QUnit.module( "test QUnit " );

QUnit.test( "test of QUnit werkt", 
	function( assert ) {
	    assert.expect(1);
	    assert.equal(2, 2, "twee is twee");
});

/***************************************************************************
 **                MODULE ELEMENT                                         **
 ***************************************************************************/

QUnit.module( "test module element" );

QUnit.test( "test Element constructor", 
	function( assert ) {
		var element = new Element(10, 20, 50, "RED");
		assert.expect(4);
		assert.equal(element.radius, R, "straal moet gelijk zijn aan constante R");
		assert.equal(element.x, 20, "xCoordinaat moet 20 zijn");
		assert.equal(element.y, 50, "yCoordinaat moet 50 zijn");
		assert.equal(element.color, "RED", "kleur moet RED zijn");
});

QUnit.test( "test collidesWithOneOf methode van Element object ",
	function( assert ) {
		//initialize elements
		var firstElement = new Element(R, 10, 20, FOOD);
		var secondElement = new Element(R, 10, 15, FOOD);
		var thirdElement = new Element(R, 15, 20, FOOD);
		var fourthElement = new Element(R, 50, 50, FOOD);
		var fifthElement = new Element(R, 30, 40, FOOD);

		assert.expect(6);
		//check met lege array
		var emptyArray = [];
		assert.equal(firstElement.collidesWithOneOf(emptyArray), false, 
			"element botst niet met lege array");

		//check met array waar collisie met eerste element inzit
		//check of dit collision oplevert indien element in eerste positie array zit
		var arrayWithCollisionInFirstPosition = [];
		arrayWithCollisionInFirstPosition.push(firstElement, fourthElement, fifthElement);
		assert.equal(firstElement.collidesWithOneOf(arrayWithCollisionInFirstPosition), 
			true, "element botst met eerste positie");

		//check of dit collision oplevert indien element in middelste positie array zit
		var arrayWithCollisionMiddlePosition = [];
		arrayWithCollisionMiddlePosition.push(fourthElement, firstElement, fifthElement);
		assert.equal(firstElement.collidesWithOneOf(arrayWithCollisionMiddlePosition),
			true, "element botst met middelste positie");

		//check of dit collision oplevert indien element in laatste positie array zit
		var arrayWithCollisionLastPosition = [];
		arrayWithCollisionLastPosition.push(fourthElement, fifthElement, firstElement);
		assert.equal(firstElement.collidesWithOneOf(arrayWithCollisionLastPosition),
			true, "element botst met laatste positie");

		//check of geen collision oplevert indien enkel x of y waarde gelijk zijn
		var arrayWithEqualX = []
		arrayWithEqualX.push(secondElement, fourthElement, fifthElement);
		assert.equal(firstElement.collidesWithOneOf(arrayWithEqualX), 
			false, "element botst niet indien enkel x waarde gelijk is");

		var arrayWithEqualY = []
		arrayWithEqualY.push(fourthElement, thirdElement, fifthElement);
		assert.equal(firstElement.collidesWithOneOf(arrayWithEqualY),
			false, "element botst niet indien enkel y waarde gelijk zijn");
});

/***************************************************************************
 **                MODULE FOOD                                            **
 ***************************************************************************/

QUnit.module( "test module food" );

QUnit.test( "test createFoods", 
	function ( assert ) {
		//initialiseer hoogte en wijdte van canvas
		width = 460;
		height = 460;
		snake = createStartSnake();

		//initaliseer xMax en yMax
		xMax = width - R;
		yMax = height - R;

		//creëer snake en pas daarna het voedsel
		//snake = createStartSnake();
		foods = createFoods(snake);
	

		//initaliseer variabelen om collisions te meten en variabele voor out of bounds
		var foodCollision = false;
		var snakeCollision = false;
		var foodOutOfBounds = false;

		assert.expect(4);
		assert.equal(foods.length, NUMFOODS, "aantal foods moet gelijk zijn aan constante NUMFOODS");

		//haal elementen foods 1 voor 1 uit array en controleer of deze botst met resterende elementen
		for (counter = 0; counter < NUMFOODS - 1; counter++) {
			var food = foods.pop();
			if (food.collidesWithOneOf(foods)) {
				foodCollision = true;
			}
		}

		assert.equal(foodCollision, false, 
			"elementen uit foods mogen geen collision opleveren met andere elementen binnen foods");

		//reset foods en maak deze opnieuw aan
		foods = createFoods(snake);

		//haal elementen foods 1 voor 1 uit array en controleer of deze botst met de slang
		for (counter = 0; counter < NUMFOODS - 1; counter++) {
			var food = foods.pop();
			if (food.collidesWithOneOf(snake.segments)) {
				snakeCollision = true;
			}
		}

		assert.equal(snakeCollision, false,
			"elementen uit foods mogen geen collision opleveren met andere elementen binnen foods");

		//reset foods en maak deze opnieuw aan
		foods = createFoods(snake);

		//haal elementen foods 1 voor 1 uit array en controleer of deze binnen het canvas ligen
		for (counter = 0; counter < NUMFOODS - 1; counter++) {
			var food = foods.pop();
			if (elementOutOfBounds(food)) {
				console.log("foodx: " + food.x + " and foody: " + food.y);
				foodOutOfBounds = true;
			}
		}

		assert.equal(foodOutOfBounds, false, "elementen uit foods mogen niet buiten het canvas liggen");
});

QUnit.test( "test createFood",
	function( assert ) {
		var food = createFood(30, 60);
		assert.expect(4);
		assert.equal(food.radius, R, "straal moet gelijk zijn aan constante R");
		assert.equal(food.x, 30, "x coordinaat moet gelijk zijn aan 30");
		assert.equal(food.y, 60, "y coordinaat moet gelijkj zijn aan 60");
		assert.equal(food.color, FOOD, "kleur moet gelijk zijn aan constante FOOD");	
});


QUnit.test( "test getRandomMultipleOfRadius",
	function ( assert ) {
		var randomMultiple = getRandomMultipleOfRadius(0, 460);
		assert.expect(3);
		assert.ok(randomMultiple >= 0, "resultaat moet groter of gelijk zijn aan minimum");
		assert.ok(randomMultiple <= 460, "resultaat moet kleiner of gelijk zijn aan maximum");
		assert.equal(randomMultiple % (2 * R), 0, "resultaat moet deelbaar zijn door 2R");
});


QUnit.test( "test getRandomInt met geldige waarden",
	function( assert ) {
		assert.expect(2);
		assert.ok(getRandomInt(2, 10) >= 2, "resultaat moet groter of gelijk zijn aan 2");
		assert.ok(getRandomInt(2, 10) <= 10, "resultaat moet kleiner of gelijk zijn aan 10");
});

QUnit.test( "test getRandomInt met gelijke waarden",
	function( assert ) {
		assert.expect(1);
		assert.equal(getRandomInt(15, 15), 15, "resultaat moet gelijk zijn aan 15");
});

QUnit.test( "test getRandomInt met ongeldige waarden", 
	function( assert ) {
		assert.expect(5);
		assert.throws(function() {
			getRandomInt(0.5, 20);
		}, new Error("Het moeten gehele getallen van 0 of groter zijn"),
			"minimum is geen geheel getal");
		assert.throws(function() {
			getRandomInt(10, 22.5);
		}, new Error("Het moeten gehele getallen van 0 of groter zijn"),
			"maximum is geen geheel getal");
		assert.throws(function() {
			getRandomInt(-3, 30);
		}, new Error("Het moeten gehele getallen van 0 of groter zijn"),
			"minimum is geen positief getal");
		assert.throws(function() {
			getRandomInt(5, -20);
		}, new Error("Het moeten gehele getallen van 0 of groter zijn"),
			"maximum is geen positief getal");
		assert.throws(function() {
			getRandomInt(7, 1);
		}, new Error("Het eerste argument moet kleiner of gelijk aan het tweede argument zijn"),
			"minimum is groter dan het maximum");		
});

QUnit.test( "test isPosInteger met geldige waarden",
	function ( assert ) {
		assert.expect(4);
		assert.equal(isPosInteger(7), true, "resultaat moet true opleveren");
		assert.equal(isPosInteger(7899873), true, "resultaat moet true opleveren");
		assert.equal(isPosInteger(-45), false, "resultaat moet false opleveren");
		assert.equal(isPosInteger(-484846), false, "resultaat moet false opleveren");
});

QUnit.test( "test isPosInteger met randgevallen",
	function ( assert ) {
		assert.expect(3);
		assert.equal(isPosInteger(Number.MAX_VALUE), true, "resultaat moet true opleveren");
		assert.equal(isPosInteger(Number.MIN_VALUE), false, "resultaat moet false opleveren");
		assert.equal(isPosInteger(0), true, "resultaat moet true opleveren");
});

QUnit.test( "test isPosInteger met ongeldige waarden",
	function ( assert ) {
		assert.expect(2);
		assert.equal(isPosInteger("tekst"), false, "resultaat moet false opleveren");
		assert.equal(isPosInteger([]), false, "resultaat moet false opleveren");
});

/***************************************************************************
 **                            MODULE SNAKE                               **
 ***************************************************************************/
QUnit.module( "test module snake" );

QUnit.test( "test Snake constructor", 
	function( assert ) {
		segments = []
		segments.push(createSegment(1, 2));
		segments.push(createSegment(3, 4));
		snake = new Snake(segments);
		assert.expect(2);
		assert.equal(snake.segments.length, 2, "er moeten 2 segmenten in de variabele snake zitten");
		assert.equal(snake.direction, UP, "de startrichting moet gelijk zijn aan constante UP");
});

QUnit.test( "test Snake methoden", 
	function( assert ) {
		snake = new Snake([]);
		assert.expect(2);
		assert.equal(snake.getDirection(), UP, "de geretourneerde richting moet gelijk zijn aan constante UP");
		snake.setDirection(DOWN);
		assert.equal(snake.getDirection(), DOWN, 
				"de geretourneerde richting moet na wijziging gelijk zijn aan constante DOWN");
});

QUnit.test( "test createStartSnake", 
	function( assert ) {
		snake = createStartSnake();

		assert.expect(8);
		//alle testen voor het eerste segment van de slang
		assert.equal(snake.segments[0].radius, R, "straal moet gelijk zijn aan constante R");
		assert.equal(snake.segments[0].x, width/2, "x coordinaat moet de helft zijn van de wijdte");
		assert.equal(snake.segments[0].y, height/2, "y coordinaat moet de helft zijn van de hoogte");
		assert.equal(snake.segments[0].color, SNAKE, "kleur moet gelijk zijn aan constante SNAKE");
		//alle testen voor het tweede segment van de slang
		assert.equal(snake.segments[1].radius, R, "straal tweede segment moet gelijk zijn aan constante R");
		assert.equal(snake.segments[1].x, width/2, "x coordinaat moet de helft zijn van de wijdte");
		assert.equal(snake.segments[1].y, height/2 - 2*R, "y coordinaat moet de helft zijn van de hoogte - 2R");
		assert.equal(snake.segments[1].color, HEAD, "kleur moet gelijk zijn aan constante HEAD");
});

QUnit.test( "test createSegment", 
	function( assert ) {
        var segment = createSegment(15, 25);
        assert.expect(4);
        assert.equal(segment.radius, R, "straal moet gelijk zijn aan constante R");
        assert.equal(segment.x, 15, "x moet 15 zijn");
        assert.equal(segment.y, 25, "y moet 25 zijn");
        assert.equal(segment.color, SNAKE, "kleur moet gelijk zijn aan constante SNAKE");
});

QUnit.test( "test createHead", 
	function( assert ) {
        var head = createHead(100,150);
        assert.expect(4);
        assert.equal(head.radius, R, "straal moet gelijk zijn aan constante R");
        assert.equal(head.x, 100, "x moet 100 zijn");
        assert.equal(head.y, 150, "y moet 150 zijn");
        assert.equal(head.color, HEAD, "kleur moet gelijk zijn aan constante HEAD");
});

/***************************************************************************
 **                 MODULE SCORE                                          **
 ***************************************************************************/

QUnit.module( "test module score" );

QUnit.test( "test setScore ",
	function ( assert ) {
		assert.expect(2);
		setScore(10);
		assert.equal(score, 10, "score moet gelijk zijn aan 10");
		assert.notEqual(score, 2, "score is niet gelijk aan 2");
});

QUnit.test( "test getScore ",
	function ( assert ) {
		assert.expect(2);
		score = 50;
		assert.equal(getScore(), 50, "getScore moet gelijk zijn aan 50");
		assert.notEqual(getScore(), 20, "getScore is niet gelijk aan 20");
});


QUnit.test( "test changeScore ",
	function ( assert ) {
		assert.expect(3);
		score = 20;
		changeScore();
		assert.equal(score, 30, "na changeScore moet score gelijk zijn aan 30");
		assert.notEqual(score, 20, "na changeScore is score niet gelijk aan 20");
		assert.notEqual(score, 50, "na changeScore is score niet gelijk aan 50");
});

QUnit.test( "test resetScore ",
	function ( assert ) {
		assert.expect(3);
		score = 20;
		resetScore();
		assert.equal(score, 0, "na resetScore moet score gelijk zijn aan 0");
		assert.notEqual(score, 20, "na changeScore is score niet gelijk aan 20");
		assert.notEqual(score, 10, "na changeScore is score niet gelijk aan 50");
});

/***************************************************************************
 **                 MODULE WINNAAR                                        **
 ***************************************************************************/

QUnit.module( "test module winnaar" );

QUnit.test( "test getNameWinner met string",
	function ( assert ) {
		assert.expect(3);
		nameWinner = "jan";
		assert.equal(getNameWinner(), "jan", "nameWinner moet gelijk zijn aan jan ");
		assert.notEqual(getNameWinner(), "piet", "nameWinner is niet gelijk aan piet");
		assert.notEqual(getNameWinner(), "", "nameWinner is niet gelijk aan een lege string waarde ");
});

QUnit.test( "test getNameWinner met lege string waarde",
	function ( assert ) {
		assert.expect(3);
		nameWinner = "";
		assert.equal(getNameWinner(), "", "nameWinner moet gelijk zijn aan lege waarde ");
		assert.notEqual(getNameWinner(), "piet", "nameWinner is niet gelijk aan piet");
		assert.notEqual(getNameWinner(), "alice", "nameWinner is niet gelijk aan alice ");
});

QUnit.test( "test setNameWinner met string",
	function ( assert ) {
		assert.expect(3);
		setNameWinner("jan");
		assert.equal(nameWinner, "jan", "nameWinner moet gelijk zijn aan jan")
		assert.notEqual(nameWinner, "piet", "nameWinner is niet gelijk aan piet");
		assert.notEqual(nameWinner, "", "nameWinner is niet gelijk aan een lege waarde")
});

QUnit.test( "test setNameWinner met lege string",
	function ( assert ) {
		assert.expect(3);
		setNameWinner("");
		assert.equal(nameWinner, "", "nameWinner moet gelijk zijn aan lege waarde")
		assert.notEqual(nameWinner, "piet", "nameWinner is niet gelijk aan piet");
		assert.notEqual(nameWinner, "jan", "nameWinner is niet gelijk aan jan")
});

QUnit.test( "test resetNameWinner ",
	function ( assert ) {
		assert.expect(3);
		resetNameWinner();
		assert.equal(nameWinner, undefined, "nameWinner moet gelijk zijn aan undefined");
		assert.notEqual(nameWinner, "piet", "nameWinner is niet gelijk aan piet");
		assert.notEqual(nameWinner, "", "nameWinner is niet gelijk aan een lege waarde");
});

/***************************************************************************
 **                 MODULE SCOREBOARDENTRIES                              **
 ***************************************************************************/

QUnit.module( "test module scoreboardentries" );

QUnit.test( "test contstructor EntryScore ",
	function ( assert ) {
		assert.expect(2);
		entryscore = new EntryScore("jan", 200);
		assert.equal(entryscore.name, "jan", "name van EntryScore is jan");
		assert.equal(entryscore.score, 200, "score van EntryScore is 200");
});

QUnit.test( "test addScoreBoardEntries op gelijke testdata",
	function ( assert ) {
		assert.expect(1);
	
		entriesLocalStorageTest = new Map();
		entriesLocalStorageTest.set("placeThree", new EntryScore("Alice", 20));
		entriesLocalStorageTest.set("placeTwo", new EntryScore("Jan", 40));
		entriesLocalStorageTest.set("placeOne", new EntryScore("Truus", 50));
		
		entriesScoreboardTest = new Map();
		entriesScoreboardTest.set("placeThree", new EntryScore("Alice", 20));
		entriesScoreboardTest.set("placeTwo", new EntryScore("Jan", 40));
		entriesScoreboardTest.set("placeOne",new EntryScore("Truus", 50));
		
		addScoreBoardEntries(entriesLocalStorageTest); 
		
		assert.deepEqual(getEntriesScoreBoard(), entriesScoreboardTest, "entriesScoreboard is gelijk aan entriesScoreboardTest");
});


QUnit.test( "test addScoreBoardEntries op ongelijke testdata",
	function ( assert ) {
		assert.expect(1);
	
		entriesLocalStorageTest = new Map();
		entriesLocalStorageTest.set("placeThree", new EntryScore("Alice", 20));
		entriesLocalStorageTest.set("placeTwo", new EntryScore("Jan", 40));
		entriesLocalStorageTest.set("placeOne", new EntryScore("Truus", 50));
		
		entriesScoreboardTest = new Map();
		entriesScoreboardTest.set("placeThree", new EntryScore("Alice", 20));
		entriesScoreboardTest.set("placeTwo", new EntryScore("Gert", 40)); //ongelijk
		entriesScoreboardTest.set("placeOne",new EntryScore("Truus", 50));
		
		addScoreBoardEntries(entriesLocalStorageTest); 
		
		assert.notDeepEqual(getEntriesScoreBoard(), entriesScoreboardTest, "entriesScoreboard is ongelijk aan entriesScoreboardTest");
});

QUnit.test( "test setKeysScoreboard met gelijke testdata",
	function ( assert ) {
		assert.expect(1);
		entriesScoreboardTest = new Map();
		entriesScoreboardTest.set("placeThree", );
		entriesScoreboardTest.set("placeTwo", );
		entriesScoreboardTest.set("placeOne", );
		setKeysScoreboard();
		assert.deepEqual(entriesScoreboard, entriesScoreboardTest, "entriesScoreboard heeft 3 key: placeThree, placeTwo, placeOne");
});


QUnit.test( "test setKeysScoreboard met ongelijke testdata",
	function ( assert ) {
		assert.expect(1);
		entriesScoreboardTest = new Map();
		entriesScoreboardTest.set("placeTwo", );
		entriesScoreboardTest.set("placeOne", );
		setKeysScoreboard();
		assert.notDeepEqual(entriesScoreboard, entriesScoreboardTest, "entriesScoreboard heeft 3 key: placeThree, placeTwo, placeOne");
});

QUnit.test( "test setEntriesScoreBoard op gelijke testdata",
	function ( assert ) {
		assert.expect(1);
		entriesLocalStorageTest = new Map();
		entriesLocalStorageTest.set("placeThree", new EntryScore("Alice", 20));
		entriesLocalStorageTest.set("placeTwo", new EntryScore("Jan", 20));
		entriesLocalStorageTest.set("placeOne", new EntryScore("Truus", 30));
		setEntriesScoreBoard(entriesLocalStorageTest); 
		assert.deepEqual(entriesScoreboard, entriesLocalStorageTest, "entriesScoreboard is gelijk aan entriesLocalStorageTest");
});

QUnit.test( "test setEntriesScoreBoard op ongelijke testdata",
	function ( assert ) {
		assert.expect(1);
		entriesLocalStorageTest = new Map();
		entriesLocalStorageTest.set("placeThree", new EntryScore("Alice", 20));
		entriesLocalStorageTest.set("placeTwo", new EntryScore("Jan", 20));
		entriesLocalStorageTest.set("placeOne", new EntryScore("Truus", 30));
		setEntriesScoreBoard(entriesLocalStorageTest); 
		entriesLocalStorageTest.set("placeOne", new EntryScore("Johan", 30));
		assert.notDeepEqual(entriesScoreboard, entriesLocalStorageTest, "entriesScoreboard is ongelijk aan entriesLocalStorageTest");
});

QUnit.test( "test completeEntriesScoreboard op gelijke testdata",
	function ( assert ) {
		assert.expect(2);
		
		entriesScoreboardTest = new Map();
		entriesScoreboardTest.set("placeThree", new EntryScore("Alice", 20));
		entriesScoreboardTest.set("placeTwo", new EntryScore("Jan", 20));
		entriesScoreboardTest.set("placeOne", new EntryScore("",0));
		
		setKeysScoreboard();
		entriesScoreboard.set("placeThree", new EntryScore("Alice", 20));
		entriesScoreboard.set("placeTwo", new EntryScore("Jan", 20));
		entriesScoreboard.set("placeOne",);
		completeEntriesScoreboard(); 
		
		assert.deepEqual(entriesScoreboard, entriesScoreboardTest, "entriesScoreboard is gelijk aan entriesScoreboardTest");
		assert.deepEqual(entriesScoreboard.get("placeOne"), new EntryScore("",0), "waarde van key placeOne is gelijk aan new EntryScore");
});


QUnit.test( "test completeEntriesScoreboard op ongelijke testdata",
	function ( assert ) {
		assert.expect(2);
	
		entriesScoreboardTest = new Map();
		entriesScoreboardTest.set("placeThree", new EntryScore("Alice", 20));
		entriesScoreboardTest.set("placeTwo", new EntryScore("Jan", 20));
		entriesScoreboardTest.set("placeOne",);
		
		setKeysScoreboard();
		entriesScoreboard.set("placeThree", new EntryScore("Alice", 20));
		entriesScoreboard.set("placeTwo", new EntryScore("Jan", 20));
		entriesScoreboard.set("placeOne",);
		completeEntriesScoreboard(); 
		
		assert.notDeepEqual(entriesScoreboard, entriesScoreboardTest, "entriesScoreboard is ongelijk aan entriesScoreboardTest");
		assert.notDeepEqual(entriesScoreboard.get("placeOne"), entriesScoreboardTest.get("placeOne"),
		"waarde van key placeOne in entriesScoreboard is ongelijk aan waarde van key placeOne in entriesScoreboardTest");
});

QUnit.test( "test getEntriesScoreBoard op gelijke testdata",
	function ( assert ) {
		assert.expect(1);
	
		entriesScoreboardTest = new Map();
		entriesScoreboardTest.set("placeThree", new EntryScore("Alice", 20));
		entriesScoreboardTest.set("placeTwo", new EntryScore("Jan", 40));
		entriesScoreboardTest.set("placeOne",new EntryScore("Truus", 50));
		
		setKeysScoreboard();
		entriesScoreboard.set("placeThree", new EntryScore("Alice", 20));
		entriesScoreboard.set("placeTwo", new EntryScore("Jan", 40));
		entriesScoreboard.set("placeOne",new EntryScore("Truus", 50));
		
		assert.deepEqual(getEntriesScoreBoard(), entriesScoreboardTest, "entriesScoreboard is gelijk aan entriesScoreboardTest");
});


QUnit.test( "test getEntriesScoreBoard op ongelijke testdata",
	function ( assert ) {
		assert.expect(1);
	
		entriesScoreboardTest = new Map();
		entriesScoreboardTest.set("placeThree", new EntryScore("Alice", 20));
		entriesScoreboardTest.set("placeTwo", new EntryScore("Jan", 40));
		entriesScoreboardTest.set("placeOne",new EntryScore("Truus", 60));
		
		setKeysScoreboard();
		entriesScoreboard.set("placeThree", new EntryScore("Alice", 20));
		entriesScoreboard.set("placeTwo", new EntryScore("Jan", 40));
		entriesScoreboard.set("placeOne", new EntryScore("Alice", 30));
		
		assert.notDeepEqual(getEntriesScoreBoard(), entriesScoreboardTest, "entriesScoreboard is ongelijk aan entriesScoreboardTest");
});


QUnit.test( "test scoreIsNewHigh met gelijke testdata",
	function ( assert ) {
		assert.expect(6);
		
		setKeysScoreboard();
		entriesScoreboard.set("placeThree", new EntryScore("Alice", 20));
		entriesScoreboard.set("placeTwo", new EntryScore("Jan", 30));
		entriesScoreboard.set("placeOne", new EntryScore("Alice", 50));
		
		setScore(-1);
		assert.equal(scoreIsNewHigh(), "noHighscore", "scoreIsNewHigh geeft geen high score"); 
		setScore(0);
		assert.equal(scoreIsNewHigh(), "noHighscore", "scoreIsNewHigh geeft geen high score"); 
		setScore(10);
		assert.equal(scoreIsNewHigh(), "noHighscore", "scoreIsNewHigh geeft geen high score"); 
		setScore(20); 
		assert.equal(scoreIsNewHigh(), "placeThree", "scoreIsNewHigh geeft placeThree"); 
		setScore(40); 
		assert.equal(scoreIsNewHigh(), "placeTwo", "scoreIsNewHigh geeft placeTwo"); 
		setScore(60); 
		assert.equal(scoreIsNewHigh(), "placeOne", "scoreIsNewHigh geeft placeOne"); 
});


QUnit.test( "test scoreIsNewHigh met ongelijke testdata",
	function ( assert ) {
		assert.expect(6);
		
		setKeysScoreboard();
		entriesScoreboard.set("placeThree", new EntryScore("Alice", 20));
		entriesScoreboard.set("placeTwo", new EntryScore("Jan", 30));
		entriesScoreboard.set("placeOne", new EntryScore("Alice", 50));
		
		setScore(-1);
		assert.notEqual(scoreIsNewHigh(), "placeThree", "scoreIsNewHigh geeft geen placeThree"); 
		setScore(0);
		assert.notEqual(scoreIsNewHigh(), "placeTwo", "scoreIsNewHigh geeft geen placeTwo"); 
		setScore(10);
		assert.notEqual(scoreIsNewHigh(), "placeOne", "scoreIsNewHigh geeft geen placeOne"); 
		setScore(20); 
		assert.notEqual(scoreIsNewHigh(), "noHighscore", "scoreIsNewHigh geeft geen noHighscore"); 
		setScore(40); 
		assert.notEqual(scoreIsNewHigh(), "noHighscore", "scoreIsNewHigh geeft geen noHighscore"); 
		setScore(60); 
		assert.notEqual(scoreIsNewHigh(), "noHighscore", "scoreIsNewHigh geeft geen noHighscore"); 
});



QUnit.test( "test adjustEntriesScoreboard op gelijke testdata",
	function ( assert ) {
		assert.expect(1);
	
		setKeysScoreboard();
		entriesScoreboard.set("placeThree", new EntryScore("Alice", 20));
		entriesScoreboard.set("placeTwo", new EntryScore("Jan", 40));
		entriesScoreboard.set("placeOne", new EntryScore("Johan", 50));
		
		adjustEntriesScoreboard("placeThree", "Alice", 30); 
		adjustEntriesScoreboard("placeTwo", "Gert", 40); 
		adjustEntriesScoreboard("placeOne", "Truus", 80); 
		
		entriesScoreboardTest = new Map();
		entriesScoreboardTest.set("placeThree", new EntryScore("Gert", 40));
		entriesScoreboardTest.set("placeTwo", new EntryScore("Johan", 50));
		entriesScoreboardTest.set("placeOne", new EntryScore("Truus", 80));
		
		assert.deepEqual(getEntriesScoreBoard(), entriesScoreboardTest, "entriesScoreboard is gelijk aan entriesScoreboardTest");
});

QUnit.test( "test adjustEntriesScoreboard op ongelijke testdata",
	function ( assert ) {
		assert.expect(1);
	
		setKeysScoreboard();
		entriesScoreboard.set("placeThree", new EntryScore("Alice", 20));
		entriesScoreboard.set("placeTwo", new EntryScore("Jan", 40));
		entriesScoreboard.set("placeOne", new EntryScore("Johan", 50));
		
		adjustEntriesScoreboard("placeTwo", "Gert", 40); 
	
		entriesScoreboardTest = new Map();
		entriesScoreboardTest.set("placeThree",  new EntryScore("Alice", 20));
		entriesScoreboardTest.set("placeTwo", new EntryScore("Jan", 40));
		entriesScoreboardTest.set("placeOne", new EntryScore("Johan", 50));
		
		assert.notDeepEqual(getEntriesScoreBoard(), entriesScoreboardTest, "entriesScoreboard is ongelijk aan entriesScoreboardTest");
});

/***************************************************************************
 **                 MODULE SNAKEGAME                                      **
 ***************************************************************************/

QUnit.module( "test module snakegame" );

QUnit.test( "test getSnakeSegments",
	function( assert ) {
		snake = createStartSnake();
		segments = getSnakeSegments();

		assert.expect(1);
		assert.equal(segments, snake.segments, "de functie levert dezelfde segmenten op als de property van de slang");
});

QUnit.test( "test getFoods",
	function( assert ) {
		snake = createStartSnake();
		foods = createFoods(snake);

		assert.expect(1);
		assert.equal(foods, getFoods(), "de functie levert dezelfde array voedsel op als de variabele");
});
	
QUnit.test( "test getGameStatus",
	function( assert ) {
		assert.expect(1);
		assert.equal(getGameStatus(), INACTIVE, "de functie levert dezelfde waarde op als de begin waarde van de variabele");
});

QUnit.test( "test stopSnakeGame", 
	function( assert ) {
		snake = createStartSnake();
		foods = createFoods(snake);
		gameStatus = ACTIVE;

		assert.expect(4);

		//test of variabelen niet gelijk zijn aan de default waarde
		assert.notDeepEqual(foods, [], "foods is niet gelijk aan de default waarde");
		assert.notEqual(gameStatus, INACTIVE, "gamestatus is niet gelijk aan de default waarde");

		//gebruik functie stopSnakeGame
		stopSnakeGame();

		//test of variabelen terug de default waarde hebben gekregen
		assert.deepEqual(foods, [], "foods is opnieuw een lege array");
		assert.equal(gameStatus, INACTIVE, "gamestatus is opnieuw naar de constante INACTIVE gezet");
});

/**
QUnit.test( "test initSnakeGame", 
	function( assert ) {

		stopSnakeGame();
		assert.expect(4);

		//verander gamestatus naar ACTIVE en pas functie toe
		gameStatus = ACTIVE;
		initSnakeGame();

		console.log("snake: " + JSON.stringify(snake) + " and foods: " + JSON.stringify(foods));
		//test of variabelen nog steeds leeg zijn
		assert.equal(snake, undefined, "snake mag nog steeds geen beginwaarde hebben gekregen");
		assert.deepEqual(foods, [], "foods moet nog steeds een lege array zijn");

		//verander gamestatus naar INACTIVE en pas functie toe
		gameStatus = INACTIVE;
		initSnakeGame();

		//test of variabelen een waarde hebben gekregen
		assert.notEqual(snake, undefined, "snake mag nog steeds geen beginwaarde hebben gekregen");
		assert.notDeepEqual(foods, [], "foods moet nog steeds een lege array zijn");
});
**/

QUnit.test( "test determineDirection met niet tegengestelde richtingen",
	function( assert ) {
		//initialiseer snake met default UP direction en lastpressed arrow key
		snake = createStartSnake();
		lastPressedArrowKey = RIGHT;

		//initialiseer variabele om vorige direction bij te houden
		//Snake direction UP
		var previousDirection = snake.getDirection();

		determineDirection(lastPressedArrowKey);

		assert.expect(4);
		assert.equal(snake.getDirection(), lastPressedArrowKey,
			"bij snake direction UP en lastPressedArrowKey RIGHT wijzigt direction naar lastPressedArrowKey");

		//snake direction RIGHT
		snake.setDirection(RIGHT);
		previousDirection = snake.getDirection();
		lastPressedArrowKey = DOWN;

		determineDirection(lastPressedArrowKey);

		assert.equal(snake.getDirection(), lastPressedArrowKey,
			"bij snake direction RIGHT en lastPressedArrowKey DOWN wijzigt direction naar lastPressedArrowKey");

		//snake direction DOWN
		snake.setDirection(DOWN);
		previousDirection = snake.getDirection();
		lastPressedArrowKey = LEFT;

		determineDirection(lastPressedArrowKey);

		assert.equal(snake.getDirection(), lastPressedArrowKey,
			"bij snake drection DOWN en lastPressedArrowKey LEFT wijzigt direction naar lastPressedArrowKey");

		//snake direction LEFT
		snake.setDirection(LEFT);
		previousDirection = snake.getDirection();
		lastPressedArrowKey = UP;

		determineDirection(lastPressedArrowKey);

		assert.equal(snake.getDirection(), lastPressedArrowKey,
			"bij snake direction LEFT en lastPressedArrowKey UP wijzigt direction naar lastPressedArrowKey");
});

QUnit.test( "test determineDirection met tegengestelde richtingen",
	function( assert ) {
		//initialiseer snake met default UP direction en lastpressed arrow key
		snake = createStartSnake();
		lastPressedArrowKey = DOWN;

		//initialiseer variabele om vorige direction bij te houden
		//Snake direction UP
		var previousDirection = snake.getDirection();

		determineDirection(lastPressedArrowKey);

		assert.expect(4);
		assert.equal(previousDirection, snake.getDirection(),
			"bij snake direction UP en lastPressedArrowKey DOWN blijft direction ongewijzigd");

		//snake direction RIGHT
		snake.setDirection(RIGHT);
		previousDirection = snake.getDirection();
		lastPressedArrowKey = LEFT;

		determineDirection(lastPressedArrowKey);

		assert.equal(previousDirection, snake.getDirection(),
			"bij snake direction RIGHT en lastPressedArrowKey LEFT blijft direction ongewijzigd");

		//snake direction DOWN
		snake.setDirection(DOWN);
		previousDirection = snake.getDirection();
		lastPressedArrowKey = UP;

		determineDirection(lastPressedArrowKey);

		assert.equal(previousDirection, snake.getDirection(),
			"bij snake drection DOWN en lastPressedArrowKey UP blijft direction ongewijzigd");

		//snake direction LEFT
		snake.setDirection(LEFT);
		previousDirection = snake.getDirection();
		lastPressedArrowKey = RIGHT;

		determineDirection(lastPressedArrowKey);

		assert.equal(previousDirection, snake.getDirection(),
			"bij snake direction LEFT en lastPressedArrowKey RIGHT blijft direction ongewijzigd");
});

QUnit.test( "test oppositeDirectionSnake met niet tegengestelde richtingen",
	function( assert ) {
		//initieer snake met default UP direction en lastpressed arrow key
		createStartSnake();
		lastPressedArrowKey = RIGHT;

		assert.expect(4);
		assert.equal(oppositeDirectionSnake(), false,
			"met snake UP is tegengestelde richting niet RIGHT");

		snake.setDirection(RIGHT);
		lastPressedArrowKey = DOWN;

		assert.equal(oppositeDirectionSnake(), false,
			"met snake RIGHT is tegengestelde richting niet DOWN");

		snake.setDirection(DOWN);
		lastPressedArrowKey = LEFT;

		assert.equal(oppositeDirectionSnake(), false,
			"met snake DOWN is tegengestelde richting niet LEFT");

		snake.setDirection(LEFT);
		lastPressedArrowKey = UP;

		assert.equal(oppositeDirectionSnake(), false, 
			"met snake LEFT is tegengestelde richting niet UP");
	})

QUnit.test( "test oppositeDirectionSnake met tegengestelde richtingen",
	function( assert ) {
		//initieer snake met default UP direction en lastpressed arrow key
		snake = createStartSnake();
		lastPressedArrowKey = DOWN;

		assert.expect(4);
		assert.equal(oppositeDirectionSnake(lastPressedArrowKey), true,
			"met snake UP is tegengestelde richting DOWN");

		snake.setDirection(RIGHT);
		lastPressedArrowKey = LEFT;

		assert.equal(oppositeDirectionSnake(lastPressedArrowKey), true,
			"met snake RIGHT is tegengestelde richting LEFT");

		snake.setDirection(DOWN);
		lastPressedArrowKey = UP;

		assert.equal(oppositeDirectionSnake(lastPressedArrowKey), true,
			"met snake DOWN is tegengestelde richting UP");

		snake.setDirection(LEFT);
		lastPressedArrowKey = RIGHT;

		assert.equal(oppositeDirectionSnake(lastPressedArrowKey), true, 
			"met snake LEFT is tegengestelde richting RIGHT");
});

QUnit.test( "test createNewHead",
	function( assert ) {
		//de hoogte en breedte moeten worden geinitaliseerd voor aanmaken snake
		width = 460;
		height = 460;

		var previousHead;
		var currentHead;

		//creeër nieuwe slang en sla huidig hoofd op in variabele
		snake = createStartSnake();
		currentHead = snake.segments.at(-1);

		//maak een nieuw hoofd aan en sla dit ook op in een variabele
		newHead = createNewHead();

		//snake direction is UP		
		assert.expect(8);
		assert.equal(currentHead.x, newHead.x, "bij direction UP blijft x waarde ongewijzigd");
		assert.equal(currentHead.y - (2*R), newHead.y, 
			"bij direction UP moet y waarde met 2 * R worden verminderd");

		//snake direction is DOWN
		snake.setDirection(DOWN);
		newHead = createNewHead();

		assert.equal(currentHead.x, newHead.x, "bij direction DOWN blijft x waarde ongewijzigd");
		assert.equal(currentHead.y + (2*R), newHead.y,
			"bij direction DOWN moet y waarde met 2 * R worden vermeerderd");

		//snake direction is LEFT
		snake.setDirection(LEFT);
		newHead = createNewHead();

		assert.equal(currentHead.x - (2*R), newHead.y,
			"bij direction LEFT moet x waarde met 2 * R worden verminderd");
		assert.equal(currentHead.y, newHead.y, "bij direction LEFT blijft y waarde ongewijzigd");

		//snake direction is RIGHT
		snake.setDirection(RIGHT);
		newHead = createNewHead();

		assert.equal(currentHead.x + (2*R), newHead.x,
			"bij direction RIGHT moet x waarde met 2 * R worden vermeerderd");
		assert.equal(currentHead.y, newHead.y, "bij direction RIGHT blijft y waarde ongewijzigd");

});

QUnit.test( "test elementOutOfBounds binnen canvas",
	function( assert ) {
		//de max waarden moeten worden geinitaliseerd
		//de min waarden liggen vast als constante
		xMax = 460;
		yMax = 460;

		//door aanmaken segmenten ipv elementen ligt de nadruk op de coordinaten
		var elementWithinxMax = createSegment(xMax - 10, 40);
		var elementWithinyMax = createSegment(30, yMax - 30);
		var elementWithinXMIN = createSegment(XMIN + 20, 210);
		var elementWithinYMIN = createSegment(170, YMIN + 25);

		assert.expect(4);
		assert.equal(elementOutOfBounds(elementWithinxMax), false, "element ligt binnen xMax");
		assert.equal(elementOutOfBounds(elementWithinyMax), false, "element ligt binnen yMax");
		assert.equal(elementOutOfBounds(elementWithinXMIN), false, "element ligt binnen XMIN");
		assert.equal(elementOutOfBounds(elementWithinYMIN), false, "element ligt binnen YMIN");
});

QUnit.test( "test elementOutOfBounds op rand van canvas",
	function( assert ) {
		//de max waarden moeten worden geinitaliseerd
		//de min waarden liggen vast als constante
		xMax = 460;
		yMax = 460;

		//door aanmaken segmenten ipv elementen ligt de nadruk op de coordinaten
		var elementOnxMax = createSegment(xMax, 40);
		var elementOnyMax = createSegment(30, yMax);
		var elementOnXMIN = createSegment(XMIN, 210);
		var elementOnYMIN = createSegment(170, YMIN);

		assert.expect(4);
		assert.equal(elementOutOfBounds(elementOnxMax), false, "element ligt op xMax");
		assert.equal(elementOutOfBounds(elementOnyMax), false, "element ligt op yMax");
		assert.equal(elementOutOfBounds(elementOnXMIN), false, "element ligt op XMIN");
		assert.equal(elementOutOfBounds(elementOnYMIN), false, "element ligt op YMIN");
});

QUnit.test( "test elementOutOfBounds buiten canvas",
	function( assert ) {
		//de max waarden moeten worden geinitaliseerd
		//de min waarden liggen vast als constante
		xMax = 460;
		yMax = 460;

		//door aanmaken segmenten ipv elementen ligt de nadruk op de coordinaten
		var elementBeyondxMax = createSegment(xMax + 20, 40);
		var elementBeyondyMax = createSegment(30, yMax + 30);
		var elementBeyondXMIN = createSegment(XMIN - 30, 210);
		var elementBeyondYMIN = createSegment(170, YMIN - 10);

		assert.expect(4);
		assert.equal(elementOutOfBounds(elementBeyondxMax), true, "element ligt buiten xMax");
		assert.equal(elementOutOfBounds(elementBeyondyMax), true, "element ligt buiten yMax");
		assert.equal(elementOutOfBounds(elementBeyondXMIN), true, "element ligt buiten XMIN");
		assert.equal(elementOutOfBounds(elementBeyondYMIN), true, "element ligt buiten YMIN");
});

QUnit.test( "test refitNewHeadToCanvas ",
	function( assert ) {
		//initialize variables
		xMax = 460;
		yMax = 460;

		snake = createStartSnake();

		//door aanmaken segmenten ipv elementen ligt de nadruk op de coordinaten
		var elem = createSegment(240, 370);

		snake.setDirection(UP);
		refitNewHeadToCanvas(elem);

		assert.expect(4);
		assert.equal(elem.y, yMax, "indien UP moet y gelijk zijn aan yMax");

		snake.setDirection(RIGHT);
		refitNewHeadToCanvas(elem);

		assert.equal(elem.x, XMIN, "indien RIGHT moet x gelijk zijn aan XMIN");

		snake.setDirection(DOWN);
		refitNewHeadToCanvas(elem);

		assert.equal(elem.y, YMIN, "indien DOWN moet y gelijk zijn aan YMIN");

		snake.setDirection(LEFT);
		refitNewHeadToCanvas(elem);

		assert.equal(elem.x, xMax, "indien LEFT moet x gelijk zijn aan xMax");
});

//Include test to cover food removed in start, middle and end of array
QUnit.test( "test removeFood", 
	function( assert ) {
		foods = [createFood(50, 70),createFood(20, 30),createFood(100, 20)];

		/**
		function removedFoodInFoods(coordinatex, coordinatey) {
		foods.some(function(f) {
			console.log("coordinatex: " + coordinatex + " and coordinatey: " + coordinatey);
			console.log("fx: " + f.x + " and fy: " + f.y);
			console.log(coordinatex == f.x && coordinatey == f.y);
			return coordinatex == f.x && coordinatey == f.y;
		})};

		console.log("contains 20 30: " + removedFoodInFoods(20, 30));	

		*/
		function containsRemovedFood(x, y) {
			foods.some(function(f) {
				console.log("fx: " + f.x + " and fy: " + f.y);
				return x == f.x && y == f.y;
			});
		}
		console.log(containsRemovedFood(20, 30));

		removedFoodInFoods = foods.some(function(f) {
			return f.x == 20 && f.y == 30;
		});
		

		assert.expect(4);
		assert.equal(foods.length, 3, "aan start van test moet foods 3 objecten bevatten");
		assert.equal(removedFoodInFoods, true, "het te verwijderen item zit nog steeds in foods");

		removeFood(20, 30);
		assert.equal(foods.length, 2, "na verwijderen voedsel mogen slechts 2 objecten resteren");

		removedFoodInFoods = foods.some(function(f) {
			return f.x == 20 && f.y == 30;
		});
		assert.equal(removedFoodInFoods, false, "het te verwijderen item zit niet meer in foods");
});


/***************************************************************************
 **                 MODULE LOCALSTORAGE                                   **
 ***************************************************************************/

QUnit.test( "test getKeysLocalStorage op gelijke testdata",
	function ( assert ) {
		assert.expect(1);
		
		localStorage.clear();
		
		localStorage.setItem("placeThree", "waarde3");
		localStorage.setItem("placeTwo", "waarde2");
		localStorage.setItem("placeOne", "waarde1");
	
		let keysLocalStorageTest = ["placeTwo", "placeThree", "placeOne"]; 
		
		let keysLocalStorage = getKeysLocalStorage();

		assert.deepEqual(keysLocalStorage, keysLocalStorageTest,  "keysLocalStorage is gelijk aan keysLocalStorageTest");
		
		localStorage.clear();
});


QUnit.test( "test getKeysLocalStorage op ongelijke testdata",
	function ( assert ) {
		assert.expect(1);
		
		localStorage.clear();
		
		localStorage.setItem("placeThree", "waarde3");
		localStorage.setItem("placeTwo", "waarde2");
		localStorage.setItem("placeOne", "waarde1");
	
		let keysLocalStorageTest = ["placeTwo", "placeOne"]; 
		
		let keysLocalStorage = getKeysLocalStorage();

		assert.notDeepEqual(keysLocalStorage, keysLocalStorageTest,  "keysLocalStorage is niet gelijk aan keysLocalStorageTest");
		
		localStorage.clear();
});


QUnit.test( "test filterKeysLocalStorage() op gelijke testdata",
	function ( assert ) {
		assert.expect(1);
		
		localStorage.clear();
		
		localStorage.setItem("placeThree", "waarde3");
		localStorage.setItem("placeTwo", "waarde2");
		localStorage.setItem("placeOne", "waarde1");
		localStorage.setItem("boom", "");
		localStorage.setItem("land", "");
		localStorage.setItem("vliegtuig", "");
	
		let filteredDeysLocalStorageTest = ["placeTwo", "placeThree", "placeOne"]; 
		
		let keysLocalStorage = getKeysLocalStorage();
		let filteredKeysLocalStorage =  filterKeysLocalStorage(keysLocalStorage);

		assert.deepEqual(filteredKeysLocalStorage, filteredDeysLocalStorageTest,  "filteredKeysLocalStorage is gelijk aan filteredDeysLocalStorageTest");
		
		localStorage.clear();
});


QUnit.test( "test filterKeysLocalStorage() op ongelijke testdata",
	function ( assert ) {
		assert.expect(2);
		
		localStorage.clear();
		
		localStorage.setItem("placeThree", "waarde3");
		localStorage.setItem("placeTwo", "waarde2");
		localStorage.setItem("placeOne", "waarde1");
		localStorage.setItem("boom", "");
		localStorage.setItem("land", "");
		localStorage.setItem("vliegtuig", "");
	
		let filteredDeysLocalStorageTest = ["boom", "vliegtuig", "placeTwo", "placeThree", "placeOne", "land"]; 
	
		let keysLocalStorage = getKeysLocalStorage();
		let filteredKeysLocalStorage =  filterKeysLocalStorage(keysLocalStorage);

		assert.deepEqual(keysLocalStorage, filteredDeysLocalStorageTest, "keysLocalStorage is gelijk aan filteredDeysLocalStorageTest");
		assert.notDeepEqual(filteredKeysLocalStorage, filteredDeysLocalStorageTest,  "filteredKeysLocalStorage is niet gelijk aan filteredDeysLocalStorageTest");
		
		localStorage.clear();
});


QUnit.test( "test entriesLocalStorage() op gelijke testdata",
	function ( assert ) {
		assert.expect(7);
		
		localStorage.clear();
		
		let entriesScoreboardTest = new Map();
		entriesScoreboardTest.set("placeTwo", new EntryScore("Jan", 40));
		entriesScoreboardTest.set("placeThree", new EntryScore("Alice", 20));
		entriesScoreboardTest.set("placeOne", new EntryScore("Johan", 50));
		
		localStorage.setItem("placeThree", JSON.stringify(new EntryScore("Alice", 20)));
		localStorage.setItem("placeTwo", JSON.stringify(new EntryScore("Jan", 40)));
		localStorage.setItem("placeOne", JSON.stringify(new EntryScore("Johan", 50)));
	
		let keysLocalStorage = getKeysLocalStorage();
		let filteredKeysLocalStorage =  filterKeysLocalStorage(keysLocalStorage);
		let entries = getEntriesLocalStorage(filteredKeysLocalStorage);
		
		assert.equal(entries.size, entriesScoreboardTest.size, "entries is gelijk aan entriesScoreboardTest");
		assert.equal(entries.get("placeOne").score, entriesScoreboardTest.get("placeOne").score, "entries is gelijk aan entriesScoreboardTest");
		assert.equal(entries.get("placeTwo").score, entriesScoreboardTest.get("placeTwo").score, "entries is gelijk aan entriesScoreboardTest");
		assert.equal(entries.get("placeThree").score, entriesScoreboardTest.get("placeThree").score, "entries is gelijk aan entriesScoreboardTest");
		assert.equal(entries.get("placeOne").name, entriesScoreboardTest.get("placeOne").name, "entries is gelijk aan entriesScoreboardTest");
		assert.equal(entries.get("placeTwo").name, entriesScoreboardTest.get("placeTwo").name, "entries is gelijk aan entriesScoreboardTest");
		assert.equal(entries.get("placeThree").name, entriesScoreboardTest.get("placeThree").name, "entries is gelijk aan entriesScoreboardTest");

		localStorage.clear();
});



QUnit.test( "test addEntriesToLocalStorage()",
	function ( assert ) {
		assert.expect(7);
		
		localStorage.clear();
		
		let entriesScoreboardTest = new Map();
		entriesScoreboardTest.set("placeTwo", new EntryScore("Jan", 40));
		entriesScoreboardTest.set("placeThree", new EntryScore("Alice", 20));
		entriesScoreboardTest.set("placeOne", new EntryScore("Johan", 50));
		
		setKeysScoreboard();
		entriesScoreboard.set("placeThree", new EntryScore("Alice", 20));
		entriesScoreboard.set("placeTwo", new EntryScore("Jan", 40));
		entriesScoreboard.set("placeOne", new EntryScore("Johan", 50));
		
		addEntriesToLocalStorage(entriesScoreboard);
	
		let keysLocalStorage = getKeysLocalStorage();
		let filteredKeysLocalStorage = filterKeysLocalStorage(keysLocalStorage);
		let entries = getEntriesLocalStorage(filteredKeysLocalStorage);
		
		assert.equal(entries.size, entriesScoreboardTest.size, "entries is gelijk aan entriesScoreboardTest");
		assert.equal(entries.get("placeOne").score, entriesScoreboardTest.get("placeOne").score, "entries is gelijk aan entriesScoreboardTest");
		assert.equal(entries.get("placeTwo").score, entriesScoreboardTest.get("placeTwo").score, "entries is gelijk aan entriesScoreboardTest");
		assert.equal(entries.get("placeThree").score, entriesScoreboardTest.get("placeThree").score, "entries is gelijk aan entriesScoreboardTest");
		assert.equal(entries.get("placeOne").name, entriesScoreboardTest.get("placeOne").name, "entries is gelijk aan entriesScoreboardTest");
		assert.equal(entries.get("placeTwo").name, entriesScoreboardTest.get("placeTwo").name, "entries is gelijk aan entriesScoreboardTest");
		assert.equal(entries.get("placeThree").name, entriesScoreboardTest.get("placeThree").name, "entries is gelijk aan entriesScoreboardTest");
		
		localStorage.clear();
});


QUnit.test( "test getEntriesLocalStorage()",
	function ( assert ) {
		assert.expect(7);
		
		localStorage.clear();
		
		let entriesScoreboardTest = new Map();
		entriesScoreboardTest.set("placeTwo", new EntryScore("Jan", 40));
		entriesScoreboardTest.set("placeThree", new EntryScore("Alice", 20));
		entriesScoreboardTest.set("placeOne", new EntryScore("Johan", 50));
		
		setKeysScoreboard();
		entriesScoreboard.set("placeThree", new EntryScore("Alice", 20));
		entriesScoreboard.set("placeTwo", new EntryScore("Jan", 40));
		entriesScoreboard.set("placeOne", new EntryScore("Johan", 50));
		
		addEntriesToLocalStorage(entriesScoreboard);

		let entries = getEntriesLocalStorage(entriesScoreboard);
		
		assert.equal(entries.size, entriesScoreboardTest.size, "entries is gelijk aan entriesScoreboardTest");
		assert.equal(entries.get("placeOne").score, entriesScoreboardTest.get("placeOne").score, "entries is gelijk aan entriesScoreboardTest");
		assert.equal(entries.get("placeTwo").score, entriesScoreboardTest.get("placeTwo").score, "entries is gelijk aan entriesScoreboardTest");
		assert.equal(entries.get("placeThree").score, entriesScoreboardTest.get("placeThree").score, "entries is gelijk aan entriesScoreboardTest");
		assert.equal(entries.get("placeOne").name, entriesScoreboardTest.get("placeOne").name, "entries is gelijk aan entriesScoreboardTest");
		assert.equal(entries.get("placeTwo").name, entriesScoreboardTest.get("placeTwo").name, "entries is gelijk aan entriesScoreboardTest");
		assert.equal(entries.get("placeThree").name, entriesScoreboardTest.get("placeThree").name, "entries is gelijk aan entriesScoreboardTest");
		
		localStorage.clear();
});


/***************************************************************************
 **                 MODULE CONTROLLER                                 **
 ***************************************************************************/

QUnit.module( "test module controller" );

QUnit.test( "test getDimensionsCanvas", 
	function( assert ) {
		//reset width en height
		width = 0;
		height = 0;

		assert.expect(4);
		assert.notEqual(width, 460, "width mag aan start nog niet gelijk zijn aan wijdte canvas");
		assert.notEqual(height, 460, "height mag aan start nog niet gelijk zijn aan hoogte canvas");

		getDimensionsCanvas();

		assert.equal(width, 460, "width moet de waarde 460 hebben gekregen");
		assert.equal(height, 460, "height moet de waarde 460 hebben gekregen");
})





/**

QUnit.test( "test drawElement revised", 
	function( assert ) {
		var canv = $("#mySnakeCanvas");


		var drawnImage = canv.getCanvasImage(".jpg");

		console.log("DrawnImage: " + drawnImage);

		drawVerloren();

		var drawnImage = canv.getCanvasImage(".jpg");

		console.log("DrawnImage: " + drawnImage);

	});


QUnit.test( "test drawElement revised", 
	function(assert) {
		var canv = $("#mySnakeCanvas");
		console.log("canvas: " + JSON.stringify(canv));
		var food = createFood(40, 70);
		assert.expect(3);

		drawElement(food, canv);

		//foodObject = canv.getObjects().length;


		console.log("canvas: " + canv);
		console.log("number of objects on canvas: " + canv.getObjects().length);
		//assert.equal(canv.getObjects().length, 0, "bij initialisatie canvas mag er nog geen element op staan");
});



QUnit.test( "test drawElement", 
	function(assert) {
		var canv = document.createElement("canvas");
		console.log("canvas: " + JSON.stringify(canv));
		canv.innerWidth = 460;
		canv.innerHeight = 460;
		var food = createFood(40, 70);
		assert.expect(3);
		console.log("number of objects on canvas: " + canv.getObjects().length);
		//assert.equal(canv.getObjects().length, 0, "bij initialisatie canvas mag er nog geen element op staan");

});



**/

/**
QUnit.test( "test getDimensionsCanvas", 
	function( assert ) {
		var width, height;
		getDimensionsCanvas();
		assert.expect(2);
		assert.equal(width, 400, "wijdte moet 400 zijn");
		assert.equal(height, 400, "hoogte moet 400 zijn");
	});


QUnit.test( "drawVerloren
QUnit.test( "verloren
QUnit.test( "updateSnakeCoordinaten ")

*/

/***************************************************************************
 **                 MODULE CONTROLLER DEUX                                 **
 ***************************************************************************/

QUnit.module( "test module controllerdeux" );

QUnit.test( "test getScoreField", 
	function( assert ) {

		//ken de huidige waarde van scorefield4 toe aan variabele
		var labelText = getScoreField();

		assert.expect(2);
		assert.equal(labelText, "", "scorefield4 moet een lege string zijn aan de start");

		//wijzig de interne score en wijzig het label dat naar deze score verwijst
		setScore(20);
		setScoreField();

		var labelText = getScoreField();
		assert.equal(labelText, 20, "scorefield4 moet de waarde 20 gekregen hebben");
});


QUnit.test( "test setScoreField",
	function( assert ) {

		//wijzig de interne score zonder dit op het label te schrijven
		setScore(40);
		var labelText = getScoreField();

		assert.expect(2);
		assert.notEqual(labelText, 40, "de score van het label mag nog niet gewijzigd zijn naar 40");

		//wijzig het label naar de interne score
		setScoreField();
		labelText = getScoreField();

		assert.equal(labelText, 40, "de score van het label is nu gewijzigd naar 40");
});

QUnit.test( "test resetScoreField",
	function( assert ) {
		//ken huidige score aan een variabele
		var labelText = getScoreField();
		assert.expect(2);
		assert.notEqual(labelText, 0, "de score van het label mag niet 0 zijn");

		//reset de score en ken dit toe aan variabele
		resetScoreField();
		labelText = getScoreField();
		assert.equal(labelText, 0, "na de reset moet de score 0 zijn");
});

/**
QUnit.test( "test determineResultGame",
	function( assert ) {
		//Maak nieuwe local storeage en vul deze met scores
		entriesLocalStorageTest = new Map();
		entriesLocalStorageTest.set("placeThree", new EntryScore("Alice", 20));
		entriesLocalStorageTest.set("placeTwo", new EntryScore("Jan", 40));
		entriesLocalStorageTest.set("placeOne", new EntryScore("Truus", 50));


	});
**/
