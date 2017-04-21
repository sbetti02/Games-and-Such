# Blackjack

import Hand_Deck_API
import os

MIN_BET = 5
MAX_BET = 500

# human player class
    # internal rep of name
    # inherit from Hand class
    # have a hand, be able to request for more cards
    # be able to remove all cards in a hand
    # Internal representation of how much money you have left
    # Mechanism for placing bets
    # internal mechanism for total score
    # hold whether or not has an ace (and how many)

class HumanPlayer(Hand_Deck_API.Hand):
    def __init__(self, name=str(), entryAmount=500):
        self.currMoney = entryAmount
        self.bet = 0 # needs to be reset after each round
        self.Score = 0 # needs to be reset after each round
        self.Name = name
        self.dealer = GameControl()
        self.numAces = 0 # needs to be reset after each round
        self.busted = False # needs to be reset after each round
        self.hand = []

    def score(self):
        return self.Score

    def name(self):
        return self.Name

    def Busted(self):
        return self.busted

    def Bet(self):
        return self.bet

    def resetRoundVariables(self):
        self.bet = 0
        self.Score = 0
        self.numAces = 0
        self.busted = False

    def wonPot(self, amount):
        self.currMoney = self.currMoney + amount + self.bet

    def outOfMoney(self):
        return not self.currMoney

    def redoBet(self):
        print "Please enter a valid integer between " + str(min(MIN_BET, self.currMoney)) + \
              " and " + str(min(MAX_BET, self.currMoney)) + "." # will print same number when currmoney less than minbet
        self.validateBet()

    def validateBet(self):
        try: 
            bet = input()
        except:
            self.redoBet()
        if bet > min(MAX_BET, self.currMoney) or bet < min(MIN_BET, self.currMoney) or type(bet) != int:
            self.redoBet()
        return bet

    def makeInitialBet(self):
        os.system("clear")
        print "How much do you want to bet, " + self.Name + "?"
        print "Your current amount: " + str(self.currMoney)
        self.bet = self.validateBet()
        self.currMoney = self.currMoney - self.bet

    def doubleDown(self):
        print "Would you like to double your bet? (y/n)"
        ans = raw_input()
        if ans == "y":
            print self.bet
            print self.bet*2
            print self.currMoney
            newBet = min(self.bet*2, MAX_BET)
            self.currMoney = self.currMoney - (newBet - self.bet)
            self.bet = newBet
            print self.bet

    def HitStandInput(self):
        ans = raw_input()
        if ans != "hit" and ans != "stand": # TODO: to upper case
            self.HitStandInput()
        return ans

    def addCardToScore(self, card):
        value = card.NumInt()
        if value == 14:
            value = 11
            self.numAces = self.numAces + 1
        elif value >= 10:
            value = 10
        self.Score = self.Score + value

    def isBusted(self):
        while self.Score > 21 and self.numAces > 0:
            self.numAces = self.numAces - 1
            self.Score = self.Score - 10
        if self.Score > 21:
            self.busted = True
        return self.busted

    def hitOrStand(self):
        print "Do you want to hit or stand?"
        print self.Name + ", you hold the following cards: "
        self.showHand()
        ans = self.HitStandInput()
        if ans == "hit":
            self.addCardToScore(self.dealer.DealCards(self)[0])
            if self.isBusted():
                print self.Name + " busted!"
                return
            self.hitOrStand()
        elif ans == "stand":
            return
        else:
            "how did you get here?"

    def takeTurn(self):
        print self.Name + ", you hold the following cards: "
        self.showHand()
        self.doubleDown()
        self.hitOrStand()
        return

    def handScore(self):
        self.Score = 0
        for card in self.hand:
            self.addCardToScore(card)

    def totalMoney(self):
        return self.currMoney

    def whosDealing(self, Dealer):
        self.dealer = Dealer





# Dealer Class /// don't really feel like making the game with these rules
    # Take hit if <= 16

# GameControl
    # inherit from dealer
    # internal control of remaining players
    # Determine who wins a particular hand
    # Determine if there has been a winner
        # determine if someone has lost
        # if only one player left, they are the winner
    # Instruct player whose turn it is to make a move

class GameControl(Hand_Deck_API.Dealer):
    def __init__(self, playerList = list()):
        self.playerList = playerList
        #self.deck = self.dealingFromDeck(Hand_Deck_API.Deck())
        self.dealingFromDeck(Hand_Deck_API.Deck())

    def accumBets(self):
        bets = 0
        for player in self.playerList:
            print player.Bet()
            bets = bets + player.Bet()
        return bets

    # determine who won a particular hand. Could be for 2 or several people
    # take money pooled from bets, give to winner
    def handWinners(self):
        currWinners = []
        for player in self.playerList:
            if player.Busted():
                pass
            elif currWinners == []:
                currWinners.append(player)
            elif player.score() > currWinners[0].score():
                currWinners = [player]
            elif player.score() == currWinners[0].score():
                currWinners.append(player)
        return currWinners

    def splitPot(self, bets, winners):
        numWinners = len(winners)
        if numWinners == 0:
            return
        totalPerPerson = bets/numWinners
        for winner in winners:
            winner.wonPot(totalPerPerson)
        return

    def removeLosers(self):
        newList = []
        for player in self.playerList:
            if not player.outOfMoney():
                newList.append(player)
        self.playerList = newList
        if self.gameover():
            self.displayWinner()

    def clearTable(self):
        for player in self.playerList:
            player.resetRoundVariables()
            player.clear(self.deck.discards()) # set for self.deck.discardPile = ?

    def roundOver(self):
        winnerList = self.handWinners()
        betTotal = self.accumBets()
        self.splitPot(betTotal, winnerList)
        self.removeLosers()
        self.clearTable()
        self.startRound()

    def startRound(self):
        for player in self.playerList:
            player.makeInitialBet()
        numPlayers = len(self.playerList)
        for i in range(0, numPlayers*2):
            if self.deck.isEmpty():
                self.replenishDeckWithDiscards()
                self.shuffle()
            self.DealCards(self.playerList[i%numPlayers], 1)
        for player in self.playerList:
            player.handScore()
            player.takeTurn()
        self.roundOver()

    def displayWinner(self):
        if len(self.playerList) == 1:
            print "Congratulations! " + self.playerList[0].name() + \
                  " won and finished with a total of " + str(self.playerList[0].totalMoney()) + "!!"
        else:
            print "Looks like everyone lost!  Sorry, better luck next time!"
        exit(1)
        # Proclaim that player in playerlist is winner
        # Account for no one winning

    def gameover(self):
        if len(self.playerList) <= 1:
            return True
        else:
            return False

# computer player class
    # internal rep of name
    # inherit from hand class
    # Be able to make automated judgment about whether
    # or not to request another card
    # internal representation for choosing how to place bets
    # remove all cards from hand after a turn
    # perhaps solve for optimal bets to place/time to request additional card
    # internal mechanism for the total score


def main():
    #p1 = HumanPlayer("Player 1")
    #p2 = HumanPlayer("Player 2")
    #p3 = HumanPlayer("Player 3")
    os.system("clear")
    print "Welcome to Blackjack!\nHow many people would like to play?"
    num = input()
    playerList = []
    for i in range(1, num+1):
        playerList.append(HumanPlayer("Player " + str(i)))
    dealer = GameControl(playerList)
    #dealer = GameControl([p1, p2, p3])
    # welcome screen
    dealer.startRound()

if __name__ == "__main__":
    main()