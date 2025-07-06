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

def draw_koch_snowflake(t, length, iterations):
    """Dessine un flocon de Koch"""
    def koch_line(turtle, length, iterations):
        if iterations == 0:
            turtle.forward(length)
        else:
            length /= 3.0
            koch_line(turtle, length, iterations - 1)
            turtle.left(60)
            koch_line(turtle, length, iterations - 1)
            turtle.right(120)
            koch_line(turtle, length, iterations - 1)
            turtle.left(60)
            koch_line(turtle, length, iterations - 1)
    
    # Dessiner les trois côtés du triangle
    for _ in range(3):
        koch_line(t, length, iterations)
        t.right(120)

def draw_sierpinski_triangle(t, length, iterations):
    """Dessine un triangle de Sierpinski"""
    def sierpinski(turtle, length, iterations):
        if iterations == 0:
            # Dessiner un triangle plein
            for _ in range(3):
                turtle.forward(length)
                turtle.left(120)
        else:
            # Diviser en trois triangles plus petits
            sierpinski(turtle, length / 2, iterations - 1)
            turtle.forward(length / 2)
            sierpinski(turtle, length / 2, iterations - 1)
            turtle.backward(length / 2)
            turtle.left(60)
            turtle.forward(length / 2)
            turtle.right(60)
            sierpinski(turtle, length / 2, iterations - 1)
            turtle.left(60)
            turtle.backward(length / 2)
            turtle.right(60)
    
    sierpinski(t, length, iterations)

def draw_dragon_curve(t, length, iterations, direction=1):
    """Dessine la courbe du dragon de Heighway"""
    if iterations == 0:
        t.forward(length)
    else:
        draw_dragon_curve(t, length / (2**0.5), iterations - 1, 1)
        t.left(90 * direction)
        draw_dragon_curve(t, length / (2**0.5), iterations - 1, -1)

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

def apply_symmetry(t, draw_function, params, symmetry_options):
    """Applique les effets de symétrie"""
    if not symmetry_options:
        draw_function(t, params)
        return
    
    mirror = symmetry_options.get("mirror", False)
    rotation = symmetry_options.get("rotation", 1)
    kaleidoscope = symmetry_options.get("kaleidoscope", False)
    
    # Sauvegarder la position et orientation initiales
    initial_pos = t.position()
    initial_heading = t.heading()
    
    if kaleidoscope:
        # Effet kaléidoscope - 8 copies avec rotations
        for i in range(8):
            t.penup()
            t.goto(initial_pos)
            t.setheading(initial_heading + i * 45)
            t.pendown()
            draw_function(t, params)
            
            if mirror:
                # Ajouter l'effet miroir
                t.penup()
                t.goto(initial_pos)
                t.setheading(initial_heading + i * 45 + 180)
                t.pendown()
                draw_function(t, params)
    elif rotation > 1:
        # Rotations multiples
        for i in range(rotation):
            t.penup()
            t.goto(initial_pos)
            t.setheading(initial_heading + i * (360 / rotation))
            t.pendown()
            draw_function(t, params)
            
            if mirror:
                t.penup()
                t.goto(initial_pos)
                t.setheading(initial_heading + i * (360 / rotation) + 180)
                t.pendown()
                draw_function(t, params)
    elif mirror:
        # Effet miroir simple
        draw_function(t, params)
        t.penup()
        t.goto(initial_pos)
        t.setheading(initial_heading + 180)
        t.pendown()
        draw_function(t, params)
    else:
        draw_function(t, params)

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
    
    symmetry_options = params.get("symmetry")

    if mode == "geometric":
        t.penup()
        t.goto(0, 0)
        t.pendown()
        apply_symmetry(t, draw_geometric_pattern, params, symmetry_options)
    
    elif mode == "fractal":
        fractal_type = params.get("fractal_type", "tree")
        
        if fractal_type == "tree":
            t.penup()
            t.goto(0, -200)
            t.pendown()
            t.setheading(90)  # Pointer vers le haut
            apply_symmetry(t, lambda turtle, p: draw_fractal_tree(turtle, p["size"], p["iterations"], p["angle"], p["reduction"]), params, symmetry_options)
        
        elif fractal_type == "koch":
            t.penup()
            t.goto(-150, 50)
            t.pendown()
            t.setheading(0)
            apply_symmetry(t, lambda turtle, p: draw_koch_snowflake(turtle, p["size"], p["iterations"]), params, symmetry_options)
        
        elif fractal_type == "sierpinski":
            t.penup()
            t.goto(-100, -100)
            t.pendown()
            t.setheading(0)
            apply_symmetry(t, lambda turtle, p: draw_sierpinski_triangle(turtle, p["size"], p["iterations"]), params, symmetry_options)
        
        elif fractal_type == "dragon":
            t.penup()
            t.goto(-50, 0)
            t.pendown()
            t.setheading(0)
            apply_symmetry(t, lambda turtle, p: draw_dragon_curve(turtle, p["size"], p["iterations"]), params, symmetry_options)

    elif mode == "spiral":
        t.penup()
        t.goto(0, 0)
        t.pendown()
        apply_symmetry(t, draw_spiral, params, symmetry_options)

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
