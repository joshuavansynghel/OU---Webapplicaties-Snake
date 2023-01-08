QUnit.module( "testing uitgangscode ");

QUnit.test( "test of QUnit werkt", 
	function( assert ) {
	    assert.expect(1);
	    assert.equal(2, 2, "twee is twee");
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

/**
QUnit.test( "test getDimensionsCanvas", 
	function( assert ) {
		var width, height;
		getDimensionsCanvas();
		assert.expect(2);
		assert.equal(width, 400, "wijdte moet 400 zijn");
		assert.equal(height, 400, "hoogte moet 400 zijn");
	});
*/

QUnit.test( "test Snake constructor", 
	function( assert ) {
		segments = []
		segments.push(createSegment(1, 2));
		segments.push(createSegment(3, 4));
		createStartSnake(segments);
		assert.expect(1);
		assert.equal(snake.segments.length, 2, "er moeten 2 segmenten in de variabele snake zitten");
});


QUnit.test( "test createStartSnake", 
	function( assert ) {
		width = 400;
		height = 400;
		createStartSnake();
		assert.expect(8);
		//alle testen voor het eerste segment van de slang
		assert.equal(snake.segments[0].radius, R, "straal moet gelijk zijn aan constante R");
		assert.equal(snake.segments[0].x, R + width/2, "x coordinaat moet de helft zijn van de wijdte + R");
		assert.equal(snake.segments[0].y, R + height/2, "y coordinaat moet de helft zijn van de hoogte + R");
		assert.equal(snake.segments[0].color, SNAKE, "kleur moet gelijk zijn aan constante SNAKE");
		//alle testen voor het tweede segment van de slang
		assert.equal(snake.segments[1].radius, R, "straal tweede segment moet gelijk zijn aan constante R");
		assert.equal(snake.segments[1].x, R + width/2, "x coordinaat moet de helft zijn van de wijdte + R");
		assert.equal(snake.segments[1].y, height/2 - R, "y coordinaat moet de helft zijn van de hoogte - R");
		assert.equal(snake.segments[1].color, HEAD, "kleur moet gelijk zijn aan constante HEAD");
});

QUnit.test( "test createFood",
	function( assert ) {
		var food = createFood(30, 60);
		assert.expect(4);
		assert.equal(food.radius, R, "straal moet gelijk zijn aan constante R");
		assert.equal(food.x, 30, "x coordinaat moet gelijk zijn aan 30");
		assert.equal(food.y, 60, "y coordinaat moet gelijkj zijn aan 60");
		assert.equal(food.color, FOOD, "kleur moet gelijk zijn aan constante FOOD");

		var food2 = createFood(0 + getRandomInt(0, 450), YMIN + getRandomInt(0, 450));
		console.log("test createfood: food x" + food2.x + "food y " + food2.y);
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

QUnit.test( "test createFood", 
	function ( assert ) {
		//width = 400;
		//height = 400;
		createStartSnake();
		createFoods();
		assert.expect(2);
		assert.equal(foods.length, NUMFOODS, "aantal foods moet gelijk zijn aan constante NUMFOODS");
		assert.equal(foods.forEach(collidesWithOneOf(foods)), false, 
			"geen enkel food mag een collision opleveren met een ander stuk food");
		
		assert.equal(foods.forEach(collidesWithOneOf(snake.segments)), false,
			"geen enkel food mag een collision opleveren met segment van de slang");
});