/** @module settings */

export const R        = 10,            // straal van een element
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

export var   xMax,                     // maximale x positie die element mag hebben
             yMax;                     // maximale y positie die element mag hebben

/**
  @function setMaxCoordinates
  @desc  Toekennen van de maximale coordinaten die een
         x of y coordinaat mag hebben aan lokale variabelen
  @param {number} width - De wijdte van het canvas
  @param {number} height - De hoogte van het canvas
*/
export function setMaxCoordinates(width, height) {
  xMax = width - R;
  yMax = height - R;
}