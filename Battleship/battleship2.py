import os
import re
import random

BOARDSIZE = 9


class Boat(object):
    def __init__(self, boatName = str(), boatSize = int()):
        self.boatname = boatName
        self.length = self.life = boatSize

    def char_code(self):
        return self.boatname[0]

    def name(self):
        return self.boatname

    def size(self):
        return self.length

    def hit(self):
        self.life -= 1

    def isSunk(self):
        if self.life == 0:
            return True
        return False


class BattleshipBoard(object):
    def __init__(self, boardSize = int(), playerName = str()):
        self.boardSize = boardSize
        self.targetBoard = self.makeBoard()
        self.UAVBoard = self.makeBoard()
        self.boats = [Boat("Destroyer", 3), Boat("Submarine", 2), Boat("Carrier", 5), \
                      Boat("Battleship", 4)]
        # can't name a boat starting with an X or O or have 2 with same first letter
        # Can add new boats or change their names or sizes as wanted outside of this 
        # requirement
        self.boatsRemaining = len(self.boats)
        self.dir_coord_grid = {"ul": (-1, -1), "up": (0, -1), "ur": (1, -1), \
                               "r": (1, 0), "dr": (1, 1), "down": (0, 1), \
                               "dl": (-1, 1), "l": (-1, 0)}
        self.valid_vessel_regex = '[A-N]|[P-W]|[Y-Z]'
        self.otherplayer
        self.gameover = False

    def otherplayer(self, player = None):
        if player == None:
            return self.otherplayer
        else:
            self.otherplayer = player

    def addCorners(self, board):
        board[0][0] = '*'
        board[0][self.boardSize+1] = '*'
        board[self.boardSize+1][0] = '*'
        board[self.boardSize+1][self.boardSize+1] = '*'
        return board

    def makeRow(self):
        return ['_']*self.boardSize

    def makeBoard(self):
        rows = [0]*(self.boardSize+2)
        rows[0] = [1]
        for col in range(2, self.boardSize+1):
            rows[0].append(col%10)
        rows[self.boardSize+1] = ['#']*self.boardSize
        for i in range (1, self.boardSize+1):
            rows[i] = self.makeRow()
        for row in range (0, self.boardSize+2):
            rows[row].insert(0, row%10)
            rows[row].insert(self.boardSize+1, '|')
        return self.addCorners(rows)

    def printBoard(self, board):
        for row in board:
            for col in row:
                print col,
            print '\n',

    def printTargetBoard(self):
        self.printBoard(self.targetBoard)

    def printUAVBoard(self):
        self.printBoard(self.UAVBoard)

    def inRange(self, x, y):
        if x > self.boardSize or x <= 0:
            return False
        if y > self.boardSize or y <= 0:
            return False
        return True

    def isValid(self, x, y, direc, boatSize):
        if not self.inRange(x, y): # start point in range
            print "Please select somewhere on the board"
        for direction in self.dir_coord_grid:
            if direction == direc:
                (change_x, change_y) = self.dir_coord_grid[direction]
                if not self.inRange(x + change_x*(boatSize-1), y + change_y*(boatSize-1)):
                    return False # end point in range
                for i in range(0, boatSize):
                    if re.search(self.valid_vessel_regex, \
                                 self.UAVBoard[y + change_y*i][x + change_x*i]):
                        return False # check if boat already placed there
        return True

    def placeBoat(self, boat, x, y, direction):
        for direc in self.dir_coord_grid:
            if direc == direction:
                (change_x, change_y) = self.dir_coord_grid[direc]
                for i in range(0, boat.size()):
                    self.UAVBoard[y + change_y*i][x + change_x*i] = boat.char_code()

    def validDirection(self, direction):
        return direction in self.dir_coord_grid

    def isHit(self, x, y):
        if self.inRange(x, y) == False:
            print "This can't happen"
            return False
        elif re.search(self.valid_vessel_regex, self.UAVBoard[y][x]):
            print "It's a hit!\nPress enter to continue..."
            raw_input()
            return True
        elif self.UAVBoard[y][x] == 'X' or self.UAVBoard[y][x] == 'O':
            print "You already shot here. Miss!"
            raw_input()
            return False
        else:
            print self.otherplayer.playerName + " missed!\nPress enter to continue..."
            raw_input()
            return False

    def tookHit(self, boat):
        boat.hit()
        if boat.isSunk():
            self.boatsRemaining = self.boatsRemaining - 1
            print self.playerName + "'s " + boat.name() + " was sunk!"
            raw_input()
        return boat

    def gameOver(self):
        print self.otherplayer.playerName + " wins!\nThanks for playing!"
        self.gameover = True
        self.otherplayer.gameover = True
        print raw_input()

    def receivedAttack(self, x, y):
        os.system("clear")
        if not self.inRange(x, y):
            print "Shot was not on the board\nPress enter to return to option menu"
            raw_input()
            self.otherplayer.optionMenu()
        else:
            if self.isHit(x, y):
                for i in range(0, len(self.boats)):
                    if self.UAVBoard[y][x] == self.boats[i].char_code():
                        self.boats[i] = self.tookHit(self.boats[i])
                        self.targetBoard[y][x] = self.boats[i].char_code()
                if self.boatsRemaining == 0:
                    self.gameOver()
                self.UAVBoard[y][x] = 'X'
                self.targetBoard[y][x] = 'X'
            else:
                if not self.UAVBoard[y][x] == 'X':
                    self.UAVBoard[y][x] = 'O'
                    self.targetBoard[y][x] = 'O'

    def yourBoard(self):
        self.printUAVBoard()
        print "Press enter to return"
        raw_input()
        self.optionMenu()

    def optionTargetBoard(self):
        self.printTargetBoard()
        print "Press enter to return"
        raw_input()
        self.otherplayer.optionMenu()

    def playgame(self):
        while not self.gameover:
            self.otherplayer.optionMenu()
            if not self.gameover:
                self.optionMenu()


class Computer(BattleshipBoard):
    def __init__(self, boardsize = int(), playerName = str()):
        super(Computer, self).__init__(boardsize, playerName)
        self.playerName = playerName
        self.otherplayer = self.otherplayer()
        self.addBoats()
        self.toTarget = []
        self.targettingAround = None
        self.hadHit = None

    def generate_direction(self):
        direction = random.randrange(1, len(self.dir_coord_grid))
        counter = 1
        for direc in self.dir_coord_grid:
            if counter == direction:
                return direc
            counter += 1
        #return self.dir_coord_grid[direction][0]

    def randCoords(self):
        x = random.randrange(1, self.boardSize+1)
        y = random.randrange(1, self.boardSize+1)
        return (x, y)

    def addBoats(self):
        for boat in self.boats:
            repeat = True
            while repeat:
                (x_coord, y_coord) = self.randCoords()
                direction = self.generate_direction()
                if self.isValid(x_coord, y_coord, direction, boat.size()):
                    repeat = False
            self.placeBoat(boat, x_coord, y_coord, direction)

    def alreadyShotAt(self, x, y):
        if self.otherplayer.UAVBoard[y][x] == 'X' or self.otherplayer.UAVBoard[y][x] == 'O':
            return True
        return False

    def addAllPossDirections(self, x, y):
        for direction in self.dir_coord_grid:
            (change_x, change_y) = self.dir_coord_grid[direction]
            if self.inRange(x+change_x, y+change_y):
                if not self.alreadyShotAt(x+change_x, y+change_y):
                    self.toTarget.append((x+change_x, y+change_y))

    def distanceFromTarget(self, nextShot):
        x = nextShot[0]-self.targettingAround[0]
        y = nextShot[1]-self.targettingAround[1]
        return (x, y)

    def replaceOldTarget(self, old_x, old_y):
        self.toTarget.remove((old_x, old_y))
        (orig_x, orig_y) = self.hadHit
        if old_x < orig_x:
            new_x = old_x-1
        elif old_x > orig_x:
            new_x = old_x+1
        else:
            new_x = old_x
        if old_y < orig_y:
            new_y = old_y-1
        elif old_y > orig_y:
            new_y = old_y+1
        else:
            new_y = old_y
        if self.inRange(new_x, new_y) and not self.alreadyShotAt(new_x, new_y):
            self.toTarget.append((new_x, new_y))

    def attack(self):
        if self.toTarget:
            num_boats_left = self.otherplayer.boatsRemaining
            nextShot = self.toTarget[0]
            if re.search(self.valid_vessel_regex, self.otherplayer.UAVBoard[nextShot[1]][nextShot[0]]):
                if self.targettingAround: # You had one point, now you know its orientation
                    (dist_x, dist_y) = self.distanceFromTarget(nextShot)
                    self.toTarget = []
                    if not self.alreadyShotAt(nextShot[0]+dist_x, nextShot[1]+dist_y) \
                       and self.inRange(nextShot[0]+dist_x, nextShot[1]+dist_y):
                        self.toTarget.append((nextShot[0]+dist_x, nextShot[1]+dist_y))
                    if not self.alreadyShotAt(self.hadHit[0]-dist_x, self.hadHit[1]-dist_y) \
                       and self.inRange(self.hadHit[0]-dist_x, self.hadHit[1]-dist_y):
                        self.toTarget.append((self.hadHit[0]-dist_x, self.hadHit[1]-dist_y))
                    self.targettingAround = None
                else: # you hit the target and it was in line with the established orientation
                    self.replaceOldTarget(nextShot[0], nextShot[1])
            else: # Shot missed
                self.toTarget.remove(nextShot)
            self.otherplayer.receivedAttack(nextShot[0], nextShot[1])
            if self.otherplayer.boatsRemaining < num_boats_left:
                self.toTarget = []
        else:
            (x,y) = self.randCoords()
            while self.alreadyShotAt(x, y):
                (x,y) = self.randCoords()
            if re.search(self.valid_vessel_regex, self.otherplayer.UAVBoard[y][x]):
                self.addAllPossDirections(x,y)
                self.targettingAround = (x,y)
                self.hadHit = (x,y)
            self.otherplayer.receivedAttack(x, y)

    def optionMenu (self):
        self.attack()


class HumanPlayer(BattleshipBoard):
    def __init__(self, boardSize = int(), playerName = str()):
        super(HumanPlayer, self).__init__(boardSize, playerName)
        self.playerName = playerName
        self.otherplayer = self.otherplayer()
        self.ready()
        self.addBoats()

    def ready(self):
        os.system("clear")
        print "Ready " + self.playerName + "? (y/n)"
        inp = raw_input()
        while inp != 'y':
            print "Ready " + self.playerName + "? (y/n)"
            inp = raw_input()

    def addBoats(self):
        for boat in self.boats:
            os.system("clear")
            self.printUAVBoard()
            repeat = True
            while repeat:
                print ("Where (x, y) do you want to put the " + boat.name() + \
                       "? It has a length of " + str(boat.size()))
                x_coord = self.find_coord("x")
                y_coord = self.find_coord("y")
                print "Direction? (ul, up, ur, r, dr, down, dl, l)"
                direction = raw_input()
                while not self.validDirection(direction):
                    print "Please enter a valid direction"
                    direction = raw_input()
                if self.isValid(x_coord, y_coord, direction, boat.size()):
                    repeat = False
            self.placeBoat(boat, x_coord, y_coord, direction)
        self.printUAVBoard()

    def find_coord(self, coord):
        print coord + "-coordinate?"
        try:
            point = input()
        except:
            return self.find_coord(coord)
        return point

    def attack(self):
        try:
            print "x-coordinate of your shot?"
            x_coord = input()
            print "y-coordinate of your shot?"
            y_coord = input()
            self.otherplayer.receivedAttack(x_coord, y_coord)
        except:
            os.system("clear")
            self.attack()

    def gameOptions(self):
        os.system("clear")
        print self.playerName + ", what do you want to do?"
        print "- View your board (you)"
        print "- View your opponent's target board (opp)"
        print "- Attack (att)"
        print "- Resign (quit)"

    def optionMenu (self):
        self.gameOptions()
        try:
            inp = raw_input()
        except:
            self.gameOptions()
        while (inp != 'you' and inp != 'opp' and inp != 'att' and inp != 'quit'):
            self.gameOptions()
            try:
                inp = raw_input()
            except:
                self.gameOptions()
        if inp == 'you':
            self.yourBoard()
        elif inp == 'opp':
            self.otherplayer.optionTargetBoard()
        elif inp == 'att':
            os.system("clear")
            self.attack()
        elif inp == 'quit':
            os.system("clear")
            print self.playerName + " resigns!"
            self.gameOver()

def main():
    os.system("clear")
    print "Would you like to play 1-player, 2-player, or watch the computer battle it out?\
    \n\n(1p, 2p, demo)\n"
    choice = raw_input()
    while choice != "1p" and choice != "2p" and choice != "demo":
        print "Please enter one of the above options"
        choice = raw_input()
    if choice == "1p":
        p1 = HumanPlayer(BOARDSIZE, 'Player 1')
        p2 = Computer(BOARDSIZE, 'CPU')
    elif choice == "2p":
        p1 = HumanPlayer(BOARDSIZE, 'Player 1')
        p2 = HumanPlayer(BOARDSIZE, 'Player 2')
    else:
        p1 = Computer(BOARDSIZE, 'CPU 1')
        p2 = Computer(BOARDSIZE, 'CPU 2')
    p1.otherplayer(p2)
    p2.otherplayer(p1)
    p2.playgame()

if __name__ == "__main__":
    main()