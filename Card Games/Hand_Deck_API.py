# Card Game API

import random


######### Class Card ########

    # This class defines a card as a tuple of a given integer number
    # between 2 and 14 (11 through 14 for J,Q,K,A) and the suit as a char

    # It creates a new card given the parameters for number and suit if
    # the input is valid.

######### Class Card Public Functions ##########

    # Card.Suit() returns the suit of the current card
    # Card.Num() returns the integer or char of the current card (2-10, J, Q, K, A)
    # Card.NumInt() returns only the integer value of the card (2-14)
    # Card.numSuitPair() returns a tuple of (number_char, suit)
    # Card.numSuitPairInt() returns a tuple of the int value of the card and its suit

#################################################

class Card(object):
    def __init__(self, number = int(), suit = str()):
        if not self.validInput(suit, number):
            print "Invalid Card Input!"
            exit()                          # TODO: Change to exception
        self.suit = suit
        self.number = number
        self.numName = self.convertNumToCardName()
        self.suitAndNum = self.numSuitPair()
        self.suitAndNumInt = self.numSuitPairInt()

    def validSuit(self, suit): # private
        if suit == "S" or suit == "C" or suit == "D" or suit == "H":
            return True
        return False

    def validNum(self, num): # private
        if type(num) != int:
            return False
        if num < 2 or num > 14:
            return False
        return True

    def validInput(self, suit, num):
        if self.validSuit(suit) and self.validNum(num):
            return True

    def convertNumToCardName(self):
        if self.number <= 10:
            return self.number
        elif self.number == 11:
            return "J"
        elif self.number == 12:
            return "Q"
        elif self.number == 13:
            return "K"
        else:
            return "A"

    def Suit(self):
        return self.suit

    def Num(self):
        return self.numName

    def NumInt(self):
        return self.number

    def numSuitPair(self):
        return (self.numName, self.suit)

    def numSuitPairInt(self):
        return (self.number, self.suit)

    def printCard(self):
        if self.number <= 10:
            name = str(self.number)
        elif self.number == 11:
            name = "Jack"
        elif self.number == 12:
            name = "Queen"
        elif self.number == 13:
            name = "King"
        else:
            name = "Ace"

        if self.suit == "S":
            suit = "Spades"
        elif self.suit == "H":
            suit = "Hearts"
        elif self.suit == "C":
            suit = "Clubs"
        else:
            suit = "Diamonds"

        print name + " of " + suit


###################################################

########## Class Hand ############

    # This class represents a hand. This could be used for either a 
    # Player's hand or operate as a representation of a board available
    # in the game i.e. the cards publicly available in Poker

    # A Hand is represented by a list if Cards.

########## Class Hand Public Functions ##########

    # Hand.clear(discardPile) removes all of the cards from the hand and
    #                         adds them to the discard pile
    # Hand.draw(deck, number=1) draws cards from the given deck and adds
    #                           them to the hand with a default option of drawing 1 card.
    # Hand.showHand() prints all of the cards in the current hand
    # Hand.numCards() returns the number of cards currently in the hand
    # Hand.playCard(num, suit) checks if the card is in the hand and throws an
    #                          exception if not.  If it is in the hand, it is 
    #                          removed from the hand and returned.
    # Hand.playTopCard() Plays the first card in the hand if there is one, and otherwise
    #                          throws an error
    # Hand.isEmpty() returns true if hand is empty, false otherwise
    # Hand.shuffleCards() shuffles the cards still in the hand

##################################################



class Hand(object):
    def __init__(self):
        self.hand = [] # represent hand as list of cards

    def clear(self, discards):  # use to put in a waste deck (perhaps associated with a  
        discards.add(self.hand) # particular deck) that will be used for reshuffling
        self.hand = []
        return discards

    def draw(self, deck, number=1):
        drew = deck.take(number)
        self.hand.extend(drew)
        return drew

    def showHand(self):
        for card in self.hand:
            card.printCard()

    def numCards(self):
        return len(self.hand)

    def playCard(self, num, suit): # TODO: Way to make this abstract to work for other types of cards?
        if (num, suit) not in self.hand:
            print "You don't have this card!"
            exit() ########################## TODO: THROW AN EXCEPTION HERE INSTEAD ##################
        self.hand.remove((num, suit))
        return (num, suit)

    def playTopCard(self):
        if self.hand == []:
            print "No cards to play!"
            exit() ######################### TODO: Raise an exceptino instead #################
        topCard = self.hand[0]
        self.hand.remove(topCard)
        return topCard

    def isEmpty(self):
        if self.hand:
            return True
        return False

    def shuffleCards(self):
        handSize = len(self.deck)
        oldHand = self.hand
        newHand = []
        while handSize > 0:
            randNum = random.randint(0, handSize-1)
            toTransfer = oldHand[randNum]
            newHand.append(toTransfer)
            oldHand.remove(toTransfer)
            handSize = handSize - 1
        self.hand = newHand

##################################################

############# Class Deck ############

    # This class represents a physical deck of cards used by the dealer.
    # It initializes to a full set of 52 cards in order and then subsequently
    # randomized.
    # The deck is represented as a list of cards.

############# Class Deck Public Functions #################

    # Deck.newDeck() creates a new ordered deck of 52 cards
    # Deck.shuffleDeck() shuffles the given Deck
    # Deck.sortDeck() sorts the cards currently in the deck
    # Deck.printDeck() prints all the cards in the deck
    # Deck.numCardsInDeck() returns the number of cards in the deck
    # Deck.isEmpty() returns true if empty and false otherwise
    # Deck.take(numCards=1) removes the top numCards from the top of
    #                       the  Deck and returns them in a list
    # Deck.discards() returns the discard pile associated with the deck
    # Deck.replenishDeckWithDiscards() empties the discard pile, adding the
    #                                  discards to the back of the Deck

##################################################

class Deck(object):
    def __init__(self):
        self.deck = [] # Represented as list of cards
        self.newDeck()
        self.shuffleDeck()
        self.discardPile = DiscardPile()

    def currDeck(self):
        return self.deck

    def newDeck(self):
        deck = []
        suitList = ["C", "D", "S", "H"]
        for suit in suitList:
            for num in range (2, 15):
                deck.append(Card(num, suit))
        self.deck = deck

    def shuffleDeck(self):
        deckSize = len(self.deck)
        oldDeck = self.deck
        newDeck = []
        while deckSize > 0:
            randNum = random.randint(0, deckSize-1)
            toTransfer = oldDeck[randNum]
            newDeck.append(toTransfer)
            oldDeck.remove(toTransfer)
            deckSize = deckSize - 1
        self.deck = newDeck
        return self.deck

    def sortCards(self, cardList):
        length = len(cardList)
        for index in range(1, length):
            currentCard = cardList[index]
            currentValue = currentCard.NumInt()
            position = index
            while position > 0 and cardList[position-1].NumInt() > currentValue:
                cardList[position] = cardList[position-1]
                position = position-1
            cardList[position] = currentCard
        for card in cardList:
            print card.suitAndNum
        return cardList

    def sortDeck(self):
        splitSuits = [[],[],[],[]] # [[clubs][diamonds][spades][hearts]]
        for card in self.deck:
            if card.Suit() == "C":
                splitSuits[0].append(card)
            elif card.Suit() == "D":
                splitSuits[1].append(card)
            elif card.Suit() == "S":
                splitSuits[2].append(card)
            else:
                splitSuits[3].append(card)
        for i in range(0, 4):
            splitSuits[i] = self.sortCards(splitSuits[i])
        self.deck = []
        for i in range(0, 4):
            self.deck.extend(splitSuits[i])

    def printDeck(self):
        for card in self.deck:
            print card.suitAndNum

    def numCardsInDeck(self):
        return len(self.deck)

    def isEmpty(self):
        return not len(self.deck)

    def take(self, numCards=1):
        takeList = []
        for i in range(0, numCards):
            toTake = self.deck[0]
            self.deck.remove(toTake)
            takeList.append(toTake)
        return takeList

    def discards(self):
        return self.discardPile

    # def replenishDeckWithDiscards(self):
    #     return self.deck.extend(self.discardPile.clearPile())

##################################################

############# Class DiscardPile ############

    # This class is used to represent a pile of discarded cards to
    # be associated with a particular deck or a bigger pile.

############# Class DiscardPile Public Functions #################

    # DiscardPile.add(cards) adds a list of cards to the discard pile
    # DiscardPile.clearPile removes all cards from the pile and returns them

##################################################

class DiscardPile(object):
    def __init__(self):
        self.pile = [] # represented as list of cards

    def add(self, cards):
        return self.pile.extend(cards)

    def clearPile(self):
        oldPile = self.pile
        self.pile = []
        return oldPile

    def printPile(self):
        for card in self.pile:
            print card.numSuitPair()

##################################################

############# Class Dealer ############

    # This class acts as the main dealer for the game, acting
    # as an intermediary between the deck and the hand.

############# Class Dealer Public Functions #################

    # Dealer.DealCards(hand, number=1, deck=0): This function deals number
    #                                           of cards to deck. If deck is
    #                                           unspecified, uses builtin deck if exists.
    #                                           Cannot specify deck without num currently
    # Dealer.shuffle(deck=0): This function shuffles a given deck or the
    #                         builtin one for the dealer if it exists
    # Dealer.orderDeck(deck=0): This function orders a given deck or the
    #                           builtin on for the dealer if it exists
    # Dealer.replenishDeckWithDiscards(deck=0): add discards of a given deck
    #                                           or builtin deck for dealer if exists
    # Dealer.dealingFromDeck(deck): Specify a particular deck the dealer is working with

##################################################

class Dealer(object):
    def __init__(self):
        self.deck = 0

    def DealCards(self, hand, number=1, deck=0):
        if deck:
            return hand.draw(deck, number)
        elif self.deck:
            return hand.draw(self.deck, number)
        else:
            print "Attempting to deal cards from invalid deck!"
            exit(1) ## TODO: this

    def shuffle(self, deck=0):
        if deck:
            return deck.shuffleDeck()
        elif self.deck:
            return self.deck.shuffleDeck()
        else:
            print "Attempting to shuffle invalid deck!"
            exit(1) ## TODO: this

    def orderDeck(self, deck=0):
        if deck:
            return deck.sortDeck()
        elif self.deck:
            return self.deck.sortDeck()
        else:
            print "Attempting to order invalid deck!"
            exit(1) ## TODO: this

    def replenishDeckWithDiscards(self, deck=0):
        if deck:
            return deck.currDeck().extend(deck.discardPile.clearPile())
        elif self.deck:
            return self.deck.currDeck().extend(self.deck.discardPile.clearPile())
        else:
            print "Adding back to invalid deck!"
            exit(1) ## TODO: this

    def dealingFromDeck(self, deck):
        self.deck = deck


def main(): # basic tests
    d = Deck()
    p1 = Hand()
    p2 = Hand()
    dealer = Dealer()
    print d.numCardsInDeck()
    dealer.dealingFromDeck(d)
    dealer.DealCards(p1)
    print d.numCardsInDeck()
    dealer.DealCards(p2, 5)
    print d.numCardsInDeck()
    print "--- p1's hand ---"
    p1.showHand()
    print "--- p2's hand ---"
    p2.showHand()
    print "\n"
    p2.clear(d.discards())
    p1.clear(d.discards())
    discards = d.discards()
    discards.printPile()
    dealer.replenishDeckWithDiscards(d)
    print d.numCardsInDeck()


if __name__ == "__main__":
    main()