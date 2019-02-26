/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {

}


/**
 * Constructora de MemoryGame
 */
MemoryGame = function (gs) {
    var array;
    array = new Array(16);
    var contEncontradas = 0;
    var contCartasArriba = 0;
    var puedoClickear = true;
    var primeraCarta = new MemoryGameCard("back");
    var estadoJuego = "Memory Game";
    var cartas = ["8-ball", "potato", "dinosaur", "kronos", "rocket", "unicorn", "guy", "zeppelin", "8-ball", "potato", "dinosaur", "kronos", "rocket", "unicorn", "guy", "zeppelin"]


    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min));
    }
    /*
     *Inicializa el juego creando las cartas (recuerda que son 2 de
     *cada tipo de carta), desordenándolas y comenzando el bucle de juego.
     */
    this.initGame = function () {
        for (let index = 0; index < 16; index++) {
            let randomPos = getRandomInt(0, (cartas.length));
            array[index] = new MemoryGameCard(cartas[randomPos]);
            cartas.splice(randomPos, 1);
        }
        this.loop();
    };
    /*Dibuja el juego, esto es: (1) escribe el mensaje con el estado actual
    del juego y (2) pide a cada una de las cartas del tablero que se dibujen.
    */
    this.draw = function () {
        gs.drawMessage(estadoJuego);
        for (let index = 0; index < 16; index++) {
            array[index].draw(gs, index);
        }
    };
    /*
    loop(): Es el bucle del juego. En este caso es muy sencillo: llamamos al
    método draw cada 16ms (equivalente a unos 60fps). Esto se realizará con
    la función setInterval de Javascript.
    */
    this.loop = function () {
        setInterval(this.draw, 1000/60);
    };
    /*
    onClick(cardId): Este método se llama cada vez que el jugador pulsa
    sobre alguna de las cartas (identificada por el número que ocupan en el
    array de cartas del juego). Es el responsable de voltear la carta y, si hay
    dos volteadas, comprobar si son la misma (en cuyo caso las marcará como
    encontradas). En caso de no ser la misma las volverá a poner boca abajo1.
    */
    this.flipear = function(cardId){
        array[cardId].flip();
        primeraCarta.flip();
    }
    this.onClick = function (cardId) {
        if (array[cardId].estadoCarta == "bocaAbajo" && puedoClickear) {
            array[cardId].flip();
            contEncontradas++;
            if (contEncontradas == 2) {
                puedoClickear = false;
                let iguales = false;
                let indice = 0;
                while (!iguales && indice < array.length) {
                    if (array[cardId].compareTo(array[indice]) && array[indice].estadoCarta == "bocaArriba" && indice != cardId) {
                        iguales = true;
                        array[cardId].found();
                        array[indice].found();
                        estadoJuego = "Match Found"
                        contCartasArriba += 2;
                    }
                    indice++;
                }
                if (!iguales) {
                    estadoJuego = "Try again";
                    setTimeout(this.flipear, 2000, cardId);
                   
                }
                else if (contCartasArriba == 16) {
                    estadoJuego = "You win!";
                }
                contEncontradas = 0;
                setTimeout(1000);
                puedoClickear = true;
            }else {
                estadoJuego = "Memory Game";
                primeraCarta = array[cardId];
            }
        }
    };

};



/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */

MemoryGameCard = function (id) {
    /*MemoryGameCard(sprite): Constructora que recibe el nombre del sprite
    que representa la carta. Las cartas han de crearse boca abajo.
    */
    this.idCard = id;
    this.estadoCarta = "bocaAbajo";

    /*flip(): Da la vuelta a la carta, cambiando el estado de la misma.
     */
    this.flip = function () {

        if (this.estadoCarta == "bocaAbajo") {
            this.estadoCarta = "bocaArriba";

        } else {
            this.estadoCarta = "bocaAbajo";
        }
    }
    /*found(): Marca una carta como encontrada, cambiando el estado de la
    misma.
    */
    this.found = function () {
        this.estadoCarta = "encontrada"
    }

    /*compareTo(otherCard): Compara dos cartas, devolviendo true si ambas
    representan la misma carta.
    */
    this.compareTo = function (otherCard) {
        if (this.idCard == otherCard.idCard) {
            return true;
        }
        return false;
    }

    /*draw(gs, pos): Dibuja la carta de acuerdo al estado en el que se encuentra.
    Recibe como parámetros el servidor gráfico y la posición en la que se
    encuentra en el array de cartas del juego (necesario para dibujar una
    carta).
    */
    this.draw = function (gs, pos) {
        if (this.estadoCarta == "bocaAbajo") {
            gs.draw("back", pos);
        } else {
            gs.draw(this.idCard, pos);
        }
    }

};