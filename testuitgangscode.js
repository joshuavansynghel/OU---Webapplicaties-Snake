QUnit.module( "testing uitgangscode ", {
	setup: function() {
		//mimick wijdte en hoogte canvas
		width = 460;
		height = 460;

		//mimick xMax en yMax
		xMax = 460 - R;
		yMax = 460 - R;

		//Creëer slang en voedsel
		createStartSnake();
		createFoods();
	}
});

QUnit.test( "test of QUnit werkt", 
	function( assert ) {
	    assert.expect(1);
	    assert.equal(2, 2, "twee is twee");
});


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

QUnit.test( "test determineDirection met niet tegengestelde richtingen",
	function( assert ) {
		//initialiseer snake met default UP direction en lastpressed arrow key
		createStartSnake();
		lastPressedArrowKey = RIGHT;

		//initialiseer variabele om vorige direction bij te houden
		//Snake direction UP
		var previousDirection = snake.getDirection();

		determineDirection();

		assert.expect(4);
		assert.equal(snake.getDirection(), lastPressedArrowKey,
			"bij snake direction UP en lastPressedArrowKey RIGHT wijzigt direction naar lastPressedArrowKey");

		//snake direction RIGHT
		snake.setDirection(RIGHT);
		previousDirection = snake.getDirection();
		lastPressedArrowKey = DOWN;

		determineDirection();

		assert.equal(snake.getDirection(), lastPressedArrowKey,
			"bij snake direction RIGHT en lastPressedArrowKey DOWN wijzigt direction naar lastPressedArrowKey");

		//snake direction DOWN
		snake.setDirection(DOWN);
		previousDirection = snake.getDirection();
		lastPressedArrowKey = LEFT;

		determineDirection();

		assert.equal(snake.getDirection(), lastPressedArrowKey,
			"bij snake drection DOWN en lastPressedArrowKey LEFT wijzigt direction naar lastPressedArrowKey");

		//snake direction LEFT
		snake.setDirection(LEFT);
		previousDirection = snake.getDirection();
		lastPressedArrowKey = UP;

		determineDirection();

		assert.equal(snake.getDirection(), lastPressedArrowKey,
			"bij snake direction LEFT en lastPressedArrowKey UP wijzigt direction naar lastPressedArrowKey");
});

QUnit.test( "test determineDirection met tegengestelde richtingen",
	function( assert ) {
		//initialiseer snake met default UP direction en lastpressed arrow key
		createStartSnake();
		lastPressedArrowKey = DOWN;

		//initialiseer variabele om vorige direction bij te houden
		//Snake direction UP
		var previousDirection = snake.getDirection();

		determineDirection();

		assert.expect(4);
		assert.equal(previousDirection, snake.getDirection(),
			"bij snake direction UP en lastPressedArrowKey DOWN blijft direction ongewijzigd");

		//snake direction RIGHT
		snake.setDirection(RIGHT);
		previousDirection = snake.getDirection();
		lastPressedArrowKey = LEFT;

		determineDirection();

		assert.equal(previousDirection, snake.getDirection(),
			"bij snake direction RIGHT en lastPressedArrowKey LEFT blijft direction ongewijzigd");

		//snake direction DOWN
		snake.setDirection(DOWN);
		previousDirection = snake.getDirection();
		lastPressedArrowKey = UP;

		determineDirection();

		assert.equal(previousDirection, snake.getDirection(),
			"bij snake drection DOWN en lastPressedArrowKey UP blijft direction ongewijzigd");

		//snake direction LEFT
		snake.setDirection(LEFT);
		previousDirection = snake.getDirection();
		lastPressedArrowKey = RIGHT;

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
		createStartSnake();
		lastPressedArrowKey = DOWN;

		assert.expect(4);
		assert.equal(oppositeDirectionSnake(), true,
			"met snake UP is tegengestelde richting DOWN");

		snake.setDirection(RIGHT);
		lastPressedArrowKey = LEFT;

		assert.equal(oppositeDirectionSnake(), true,
			"met snake RIGHT is tegengestelde richting LEFT");

		snake.setDirection(DOWN);
		lastPressedArrowKey = UP;

		assert.equal(oppositeDirectionSnake(), true,
			"met snake DOWN is tegengestelde richting UP");

		snake.setDirection(LEFT);
		lastPressedArrowKey = RIGHT;

		assert.equal(oppositeDirectionSnake(), true, 
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
		createStartSnake();
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
		var elementBeyondxMax = createSegment(xMax - 10, 40);
		var elementBeyondyMax = createSegment(30, yMax - 30);
		var elementBeyondXMIN = createSegment(XMIN + 20, 210);
		var elementBeyondYMIN = createSegment(170, YMIN + 25);

		assert.expect(4);
		assert.equal(elementOutOfBounds(elementBeyondxMax), false, "element ligt binnen xMax");
		assert.equal(elementOutOfBounds(elementBeyondyMax), false, "element ligt binnen yMax");
		assert.equal(elementOutOfBounds(elementBeyondXMIN), false, "element ligt binnen XMIN");
		assert.equal(elementOutOfBounds(elementBeyondYMIN), false, "element ligt binnen YMIN");
});

QUnit.test( "test elementOutOfBounds op rand van canvas",
	function( assert ) {
		//de max waarden moeten worden geinitaliseerd
		//de min waarden liggen vast als constante
		xMax = 460;
		yMax = 460;

		//door aanmaken segmenten ipv elementen ligt de nadruk op de coordinaten
		var elementBeyondxMax = createSegment(xMax, 40);
		var elementBeyondyMax = createSegment(30, yMax);
		var elementBeyondXMIN = createSegment(XMIN, 210);
		var elementBeyondYMIN = createSegment(170, YMIN);

		assert.expect(4);
		assert.equal(elementOutOfBounds(elementBeyondxMax), false, "element ligt op xMax");
		assert.equal(elementOutOfBounds(elementBeyondyMax), false, "element ligt op yMax");
		assert.equal(elementOutOfBounds(elementBeyondXMIN), false, "element ligt op XMIN");
		assert.equal(elementOutOfBounds(elementBeyondYMIN), false, "element ligt op YMIN");
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

		//door aanmaken segmenten ipv elementen ligt de nadruk op de coordinaten
		var elem = createSegment(240, 370);

		lastPressedArrowKey = UP;
		refitNewHeadToCanvas(elem);

		assert.expect(4);
		assert.equal(elem.y, yMax, "indien UP moet y gelijk zijn aan yMax");

		lastPressedArrowKey = RIGHT;
		refitNewHeadToCanvas(elem);

		assert.equal(elem.x, XMIN, "indien RIGHT moet x gelijk zijn aan XMIN");

		lastPressedArrowKey = DOWN;
		refitNewHeadToCanvas(elem);

		assert.equal(elem.y, YMIN, "indien DOWN moet y gelijk zijn aan YMIN");

		lastPressedArrowKey = LEFT;
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


QUnit.test( "test createStartSnake", 
	function( assert ) {
		width = 400;
		height = 400;
		createStartSnake();
		assert.expect(8);
		//alle testen voor het eerste segment van de slang
		assert.equal(snake.segments[0].radius, R, "straal moet gelijk zijn aan constante R");
		assert.equal(snake.segments[0].x, width/2, "x coordinaat moet de helft zijn van de wijdte + R");
		assert.equal(snake.segments[0].y, height/2, "y coordinaat moet de helft zijn van de hoogte + R");
		assert.equal(snake.segments[0].color, SNAKE, "kleur moet gelijk zijn aan constante SNAKE");
		//alle testen voor het tweede segment van de slang
		assert.equal(snake.segments[1].radius, R, "straal tweede segment moet gelijk zijn aan constante R");
		assert.equal(snake.segments[1].x, width/2, "x coordinaat moet de helft zijn van de wijdte + R");
		assert.equal(snake.segments[1].y, height/2 - 2*R, "y coordinaat moet de helft zijn van de hoogte - R");
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



QUnit.test( "test drawElement", 
	function(assert) {
		var canv = document.createElement("canvas");
		console.log("canvas: " + canv);
		canv.innerWidth = 460;
		canv.innerHeight = 460;
		var food = createFood(40, 70);
		assert.expect(3);
		console.log("number of objects on canvas: " + canv.getObjects().length);
		//assert.equal(canv.getObjects().length, 0, "bij initialisatie canvas mag er nog geen element op staan");

});

//More tests needed
QUnit.test( "test createFoods", 
	function ( assert ) {
		//initialiseer hoogte en wijdte van canvas
		width = 460;
		height = 460;

		//initaliseer xMax en yMax
		xMax = width - R;
		yMax = height - R;

		//creëer snake en pas daarna het voedsel
		createStartSnake();
		foods = [];
		createFoods();

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
		foods = [];
		createFoods();

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
		foods = [];
		createFoods();

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