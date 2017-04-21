import os
#import sys
import curses
import time
import pygame

pygame.init()
width = 25
height = 30

columns = []
tail = []
head_x = width/2
head_y = height/2
tail_length = 4

def createTail(size):
	for i in range (1,size):
		columns[width/2][height/2 + i] = '#' 
		tail.append([width/2, height/2 + i])

def setup():
	rows = [' '] * height
	for j in range (0, width):
		rows = [' ' for index in rows]
		columns.append(rows)
	columns[head_x][head_y] = '^'
	createTail(tail_length + 1)

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

def moveup():
	global head_x
	global head_y
	head_y = head_y - 1
	if (head_y == 0): head_y = height - 2
	columns[head_x][head_y] = '^'

def moveleft():
	global head_x
	global head_y
	head_x = head_x - 1
	if (head_x == 0): head_x = width - 2
	columns[head_x][head_y] = '<'

def moveright():
	global head_x
	global head_y
	head_x = head_x + 1
	if (head_x == width - 1): head_x = 1
	columns[head_x][head_y] = '>'

def movedown():
	global head_x
	global head_y
	head_y = head_y + 1
	if (head_y == height - 1): head_y = 1
	columns[head_x][head_y] = 'v'

setup()
printboard()
"""
while True:
	eventlist =  (pygame.event.get())
	print (eventlist[0] + '\n')
	#if pygame.event.get() == pygame.K_DOWN:
	#	print ("Hey whattap")
"""

for i in range (1, 100):
	time.sleep(0.1)
	columns[tail[tail_length-1][0]][tail[tail_length-1][1]] = ' '
	tail.pop()
	tail.insert(0, [head_x, head_y])
	columns[head_x][head_y] = '#'
	if ((i / 10) % 2 == 0): moveright()
	else: movedown()
	printboard()


#for event in pygame.event.get():
#	if event.type == pygame.K_DOWN:
#		print ("Hey whattap")
	#a = sys.stdin.read(1)
	#a = curses.KEY_DOWN
	#print a

#psuedocode:
#  if head = up, do stuff
#  if head = down, do other stuff
