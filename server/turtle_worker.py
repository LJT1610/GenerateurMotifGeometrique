import sys
import json
import turtle
from PIL import Image
import io
import time
import math

def draw_geometric_pattern(t, params):
    """Dessine un motif géométrique"""
    sides = params["sides"]
    depth = params["depth"]
    size = params["size"]
    angle = params["angle"]
    
    for _ in range(depth):
        for _ in range(sides):
            t.forward(size)
            t.right(360 / sides)
        t.right(angle)
        size *= 0.95

def draw_fractal_tree(t, length, iterations, angle, reduction):
    """Dessine un arbre fractal"""
    if iterations == 0:
        return
    
    t.forward(length)
    
    # Branche droite
    t.right(angle)
    draw_fractal_tree(t, length * reduction, iterations - 1, angle, reduction)
    
    # Branche gauche
    t.left(2 * angle)
    draw_fractal_tree(t, length * reduction, iterations - 1, angle, reduction)
    
    # Retour à la position initiale
    t.right(angle)
    t.backward(length)

def draw_spiral(t, params):
    """Dessine une spirale"""
    turns = params["turns"]
    size = params["size"]
    increment = params["increment"]
    angle_step = params["angle"]
    
    current_size = size
    total_steps = int(turns * (360 // angle_step))  # Convertir en entier
    
    for _ in range(total_steps):
        t.forward(current_size)
        t.right(angle_step)
        current_size += increment / (360 // angle_step)

def main():
    # Lire les paramètres
    with open(sys.argv[1], 'r') as f:
        params = json.load(f)

    # Configuration Turtle
    screen = turtle.Screen()
    screen.setup(width=500, height=500, startx=-2000, starty=-2000)
    screen.bgcolor("black")
    screen.tracer(0)

    t = turtle.Turtle()
    t.hideturtle()
    t.speed(0)
    t.color(params["color"])
    
    # Positionnement selon le mode
    mode = params.get("mode", "geometric")
    
    if mode == "geometric":
        t.penup()
        t.goto(0, 0)
        t.pendown()
        draw_geometric_pattern(t, params)
        
    elif mode == "fractal":
        t.penup()
        t.goto(0, -200)
        t.pendown()
        t.setheading(90)  # Pointer vers le haut
        draw_fractal_tree(t, params["size"], params["iterations"], 
                         params["angle"], params["reduction"])
        
    elif mode == "spiral":
        t.penup()
        t.goto(0, 0)
        t.pendown()
        draw_spiral(t, params)

    # Rendu final
    screen.update()
    time.sleep(0.2)

    # Capture du canvas avec fond noir
    canvas = screen.getcanvas()
    ps_data = canvas.postscript(colormode='color')

    # Conversion en PNG avec fond noir
    img = Image.open(io.BytesIO(ps_data.encode('utf-8')))
    black_bg = Image.new('RGB', img.size, 'black')
    if img.mode == 'RGBA':
        black_bg.paste(img, mask=img.split()[-1])
    else:
        black_bg.paste(img)
    black_bg.save('output.png', 'PNG')

    # Fermeture propre
    screen.bye()

if __name__ == "__main__":
    main()
