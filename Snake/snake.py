import os
#import sys
import curses

width = 25
height = 30

rows = [' '] * height
columns = []

for j in range (0, width):
	rows = [' ' for index in rows]
	columns.append(rows)

columns[width/2][height/2] = '^'

def printboard():
	os.system('clear')
	for row in range (0,height):
		for col in range (0, width):
			if ((col == 0 and (row == 0 or row == height - 1)) \
				 or (row == 0 and col == width - 1) or \
				 (row == height - 1 and col == width - 1)): print '+',
			elif (col == 0 or col == width - 1): print '|',
			elif (row == 0 or row == height - 1): print '-',
			else: print columns[col][row],
		print '\n',


printboard()
"""
while(1):
	#a = sys.stdin.read(1)
	a = curses.KEY_DOWN
	print a
	"""


"""
def createTail(size):
"""