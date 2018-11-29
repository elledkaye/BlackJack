var numberofdecks = 1;
var startingBankroll = 200;
var betPerRound = 25;
var numberOfRounds = 5;
var valueCounter = 0;


var game = {
    players: [{ name: "Dealer", money: 1000000000 }, { name: "Spongebob", money: startingBankroll }, { name: "Patrick", money: startingBankroll }, { name: "Sandy", money: startingBankroll }, { name: "Mr.Crabs", money: startingBankroll }],
    startGame: function () {
        gameDeck.createSequence();
        this.dealCards();
        this.calcHandValue();
    },
    addPlayer: function (newPlayer) {
        var startingBankroll = 200
        this.players.push({ 
            name: newPlayer, 
            money:startingBankroll

        });
    },
    dealCards: function () {
        this.players.forEach(function (element, position) {
            if (position === 0) {
                var card1 = this.dealSingleCard(false);
                var card2 = this.dealSingleCard(true);
            } else {
                //dont deal if no money
                //placebet
                var card1 = this.dealSingleCard(true);
                var card2 = this.dealSingleCard(true);
            };

            this.players[position].hands = [[card1, card2]];
            // if both cards same test should i split
        }, this);

    },
    dealSingleCard: function (cardOrientation, position) {
        var cardPosition = Math.floor(Math.random() * (gameDeck.deck.length));
        var dealtCard = gameDeck.deck[cardPosition];
        dealtCard.cardOrientationUp = cardOrientation;
        gameDeck.deck.splice(cardPosition, 1);
        return dealtCard;
    },
    hitCard: function (position, handPosition) {
        var newCard = this.dealSingleCard(true);
        game.players[position].hands[handPosition].push(newCard);
        game.calcHandValue();
    },
    stay: function (position, handPosition) {
        

    },
    split: function (position) {
        var secondCard = game.players[position].hands[0][1];
        game.players[position].hands[0].splice(1, 1);
        game.players[position].hands.push([secondCard]);

        var newCard1 = this.dealSingleCard(true);
        var newCard2 = this.dealSingleCard(true);

        this.players[position].hands[0].push(newCard1);
        this.players[position].hands[1].push(newCard2);

        game.calcHandValue();

    },
    calcHandValue: function () {
        this.players.forEach(function (element, playerPosition) {
            var eachHand = game.players[playerPosition].hands;
            eachHand.forEach(function (element, handPosition) {
                eachHand[handPosition].forEach(function (element, cardPosition) {
                    var cardValue = eachHand[handPosition][cardPosition].value;
                    if (cardValue === "A") {
                        cardValue = 11;
                    } else if (cardValue === "J" || cardValue === "Q" || cardValue === "K") {
                        cardValue = 10
                    };
                    valueCounter = valueCounter + cardValue;

                })
                eachHand[handPosition].valueAsNumber = valueCounter;
                valueCounter = 0;
            }, this);
        }, this);
    },
    returnPayout: function (value) {
    },
    skipPlayer: function (position) {
    },
    clearGame: function () {
        gameDeck.deck = [];
    }
}

var payout = {
    loss: function (position) {
        var currentBank = game.players[position].money;
        game.players[position].money = currentBank - betPerRound;
        var dealerBank = game.players[0].money;
        game.players[0].money = dealerBank + betPerRound;
    },
    win: function (position) {
        var currentBank = game.players[position].money;
        game.players[position].money = currentBank + betPerRound;
        var dealerBank = game.players[0].money;
        game.players[0].money = dealerBank - betPerRound;
    },
    blackjack: function (position) {
        var currentBank = game.players[position].money;
        game.players[position].money = currentBank + (betPerRound * (3 / 2));
        var dealerBank = game.players[0].money;
        game.players[0].money = dealerBank - (betPerRound * (3 / 2));
    },
    push: function () {

    }
}

var gameDeck = {
    values: [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"],
    suits: [
        "Hearts",
        "Spades",
        "Clubs",
        "Diamonds"
    ],
    deck: [],
    createDeck: function () {
        for (i = 0; i < numberofdecks; i++) {
            this.suits.forEach(function (element, suitPosition) {
                this.values.forEach(function (element, position) {
                    if (suitPosition === 0 || suitPosition === 3) {
                        var cardColor = "Red"
                    } else {
                        var cardColor = "Black"
                    };
                    gameDeck.deck.push(
                        {
                            suit: this.suits[suitPosition],
                            value: this.values[position],
                            color: cardColor,
                            cardOrientationUp: false

                        })
                }, this);
            }, this);
        }
    },
    shuffleDeck: function () {
        for (let i = this.deck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = temp;
        }
    },
    createSequence: function () {
        this.createDeck();
        this.shuffleDeck();
    }
}

var automatedPlay = {
    gameSequence: function () {
        for (i = numberOfRounds; i > 0; i--) {
            this.roundSequence();
            this.getTurnResult();
        };

    },
    roundSequence: function () {
        for (i = 1; i < (game.players.length - 1); i++) {
            basicStrategy(game.players[i].valueAsNumber, position);
        };
        basicStrategy(game.players[0].valueAsNumber, 0)
        this.getTurnResult();
    },
    basicStrategy: function (playerHandValue, dealerUpCard) {

        // switch statement

    },
    getTurnResult: function () {
        var dealerScore = game.players[0].hands[0].valueAsNumber;
        for (i = 1; i < game.players.length; i++) {

            game.players[i].hands.forEach(function (element, position) {
            
                var playerScore = game.players[i].hands[position].valueAsNumber;
                if (playerScore === 21) {
                    payout.blackjack(i);
                    console.log(game.players[i].name, " got Blackjack!");
                } else if (dealerScore === 0) {
                    payout.win(i);
                    console.log(game.players[i].name, " won!");
                } else if (playerScore === 0) {
                    payout.loss(i);
                    console.log(game.players[i].name, " lost!");
                } else if (playerScore > dealerScore) {
                    payout.win(i);
                    console.log(game.players[i].name, " won!");
                } else {
                    payout.loss(i);
                    console.log(game.players[i].name, " lost!");
                };

            })

        }
    }
}


var addEventListeners = {

}