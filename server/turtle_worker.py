import sys
import json
import turtle
from PIL import Image, ImageFilter
import io
import time
import math

def hex_to_rgb(hex_color):
    """Convertit une couleur hexadécimale en RGB"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_hex(rgb):
    """Convertit RGB en hexadécimal"""
    return f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}"

def interpolate_color(color1, color2, factor):
    """Interpole entre deux couleurs"""
    r1, g1, b1 = hex_to_rgb(color1)
    r2, g2, b2 = hex_to_rgb(color2)
    
    r = int(r1 + (r2 - r1) * factor)
    g = int(g1 + (g2 - g1) * factor)
    b = int(b1 + (b2 - b1) * factor)
    
    return f"#{r:02x}{g:02x}{b:02x}"

def fix_turtle_color(color):
    """Corrige les problèmes de couleur de turtle"""
    # Si la couleur est noir pur, utiliser une couleur très sombre
    if color.lower() == "#000000" or color.lower() == "black":
        return "#010101"  # Presque noir mais pas complètement
    return color

def draw_geometric_pattern(t, params):
    """Dessine un motif géométrique avec dégradé optionnel"""
    sides = params["sides"]
    depth = params["depth"]
    size = params["size"]
    angle = params["angle"]
    gradient = params.get("gradient", False)
    
    for i in range(depth):
        if gradient:
            # Calculer la couleur pour cette itération
            factor = i / max(1, depth - 1)
            color = interpolate_color(params["gradient_start"], params["gradient_end"], factor)
            t.color(fix_turtle_color(color))
        
        for _ in range(sides):
            t.forward(size)
            t.right(360 / sides)
        t.right(angle)
        size *= 0.95

def draw_fractal_tree(t, length, iterations, angle, reduction, params, current_depth=0):
    """Dessine un arbre fractal avec dégradé optionnel"""
    if iterations == 0:
        return
    
    gradient = params.get("gradient", False)
    if gradient:
        max_depth = params.get("iterations", 4)
        factor = current_depth / max(1, max_depth - 1)
        color = interpolate_color(params["gradient_start"], params["gradient_end"], factor)
        t.color(fix_turtle_color(color))
    
    t.forward(length)
    
    # Branche droite
    t.right(angle)
    draw_fractal_tree(t, length * reduction, iterations - 1, angle, reduction, params, current_depth + 1)
    
    # Branche gauche
    t.left(2 * angle)
    draw_fractal_tree(t, length * reduction, iterations - 1, angle, reduction, params, current_depth + 1)
    
    # Retour à la position initiale
    t.right(angle)
    t.backward(length)

def draw_koch_snowflake(t, length, iterations, params, current_depth=0):
    """Dessine un flocon de Koch avec dégradé optionnel"""
    def koch_line(turtle, length, iterations, current_depth=0):
        gradient = params.get("gradient", False)
        if gradient:
            max_depth = params.get("iterations", 4)
            factor = current_depth / max(1, max_depth)
            color = interpolate_color(params["gradient_start"], params["gradient_end"], factor)
            turtle.color(fix_turtle_color(color))
        
        if iterations == 0:
            turtle.forward(length)
        else:
            length /= 3.0
            koch_line(turtle, length, iterations - 1, current_depth + 1)
            turtle.left(60)
            koch_line(turtle, length, iterations - 1, current_depth + 1)
            turtle.right(120)
            koch_line(turtle, length, iterations - 1, current_depth + 1)
            turtle.left(60)
            koch_line(turtle, length, iterations - 1, current_depth + 1)
    
    # Dessiner les trois côtés du triangle
    for _ in range(3):
        koch_line(t, length, iterations, current_depth)
        t.right(120)

def draw_sierpinski_triangle(t, length, iterations, params, current_depth=0):
    """Dessine un triangle de Sierpinski avec dégradé optionnel"""
    def sierpinski(turtle, length, iterations, current_depth=0):
        gradient = params.get("gradient", False)
        if gradient:
            max_depth = params.get("iterations", 4)
            factor = current_depth / max(1, max_depth)
            color = interpolate_color(params["gradient_start"], params["gradient_end"], factor)
            turtle.color(fix_turtle_color(color))
        
        if iterations == 0:
            # Dessiner un triangle plein
            for _ in range(3):
                turtle.forward(length)
                turtle.left(120)
        else:
            # Diviser en trois triangles plus petits
            sierpinski(turtle, length / 2, iterations - 1, current_depth + 1)
            turtle.forward(length / 2)
            sierpinski(turtle, length / 2, iterations - 1, current_depth + 1)
            turtle.backward(length / 2)
            turtle.left(60)
            turtle.forward(length / 2)
            turtle.right(60)
            sierpinski(turtle, length / 2, iterations - 1, current_depth + 1)
            turtle.left(60)
            turtle.backward(length / 2)
            turtle.right(60)
    
    sierpinski(t, length, iterations, current_depth)

def draw_dragon_curve(t, length, iterations, direction=1, params=None, current_depth=0):
    """Dessine la courbe du dragon de Heighway avec dégradé optionnel"""
    gradient = params.get("gradient", False) if params else False
    if gradient and params:
        max_depth = params.get("iterations", 4)
        factor = current_depth / max(1, max_depth)
        color = interpolate_color(params["gradient_start"], params["gradient_end"], factor)
        t.color(fix_turtle_color(color))
    
    if iterations == 0:
        t.forward(length)
    else:
        draw_dragon_curve(t, length / (2**0.5), iterations - 1, 1, params, current_depth + 1)
        t.left(90 * direction)
        draw_dragon_curve(t, length / (2**0.5), iterations - 1, -1, params, current_depth + 1)

def draw_spiral(t, params):
    """Dessine une spirale avec dégradé optionnel"""
    turns = params["turns"]
    size = params["size"]
    increment = params["increment"]
    angle_step = params["angle"]
    gradient = params.get("gradient", False)
    
    current_size = size
    total_steps = int(turns * (360 // angle_step))
    
    for i in range(total_steps):
        if gradient:
            factor = i / max(1, total_steps - 1)
            color = interpolate_color(params["gradient_start"], params["gradient_end"], factor)
            t.color(fix_turtle_color(color))
        
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
    screen.bgcolor("white")  # Toujours blanc pour la capture
    screen.tracer(0)

    t = turtle.Turtle()
    t.hideturtle()
    t.speed(0)
    
    # Couleur de base si pas de dégradé - avec correction pour le noir
    if not params.get("gradient", False):
        base_color = fix_turtle_color(params["color"])
        t.color(base_color)
    
    # Épaisseur du trait - fine par défaut, plus épaisse seulement avec glow
    if params.get("glow", False):
        t.pensize(3)  # Trait épais pour l'effet glow
    else:
        t.pensize(1)  # Trait fin par défaut (comme avant)
    
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
            t.setheading(90)
            apply_symmetry(t, lambda turtle, p: draw_fractal_tree(turtle, p["size"], p["iterations"], p["angle"], p["reduction"], p), params, symmetry_options)
        
        elif fractal_type == "koch":
            t.penup()
            t.goto(-150, 50)
            t.pendown()
            t.setheading(0)
            apply_symmetry(t, lambda turtle, p: draw_koch_snowflake(turtle, p["size"], p["iterations"], p), params, symmetry_options)
        
        elif fractal_type == "sierpinski":
            t.penup()
            t.goto(-100, -100)
            t.pendown()
            t.setheading(0)
            apply_symmetry(t, lambda turtle, p: draw_sierpinski_triangle(turtle, p["size"], p["iterations"], p), params, symmetry_options)
        
        elif fractal_type == "dragon":
            t.penup()
            t.goto(-50, 0)
            t.pendown()
            t.setheading(0)
            apply_symmetry(t, lambda turtle, p: draw_dragon_curve(turtle, p["size"], p["iterations"], 1, p), params, symmetry_options)

    elif mode == "spiral":
        t.penup()
        t.goto(0, 0)
        t.pendown()
        apply_symmetry(t, draw_spiral, params, symmetry_options)

    # Rendu final
    screen.update()
    time.sleep(0.2)

    # Sauvegarder directement en EPS puis convertir
    canvas = screen.getcanvas()
    canvas.postscript(file='temp_output.eps')
    
    # Fermeture propre
    screen.bye()
    
    # Traitement amélioré de l'image avec PIL
    try:
        # Lire le fichier EPS et le convertir
        from PIL import Image
        img = Image.open('temp_output.eps')
        img = img.convert('RGBA')
        
        # Créer le fond avec la couleur désirée
        background_color = params.get("background_color", "#ffffff")
        bg_rgb = hex_to_rgb(background_color)
        
        # Créer une nouvelle image avec le fond coloré
        final_img = Image.new('RGB', (500, 500), bg_rgb)
        
        # Redimensionner l'image du motif si nécessaire
        if img.size != (500, 500):
            img = img.resize((500, 500), Image.Resampling.LANCZOS)
        
        # Traitement amélioré de la transparence avec anti-aliasing
        if background_color.lower() != "#ffffff":
            # Si on avait utilisé #010101 au lieu de #000000, le reconvertir
            original_color = params.get("color", "#0070f3")
            if original_color.lower() == "#000000":
                # Remplacer les pixels #010101 par du vrai noir
                data = img.getdata()
                new_data = []
                for item in data:
                    if len(item) >= 3:
                        # Si c'est notre couleur de substitution (#010101), la remplacer par du noir
                        if item[0] <= 5 and item[1] <= 5 and item[2] <= 5 and not (item[0] >= 250 and item[1] >= 250 and item[2] >= 250):
                            new_data.append((0, 0, 0, 255) if len(item) == 4 else (0, 0, 0))
                        elif item[0] >= 250 and item[1] >= 250 and item[2] >= 250:
                            new_data.append((255, 255, 255, 0) if len(item) == 4 else (255, 255, 255))  # Fond transparent
                        else:
                            new_data.append(item)
                    else:
                        new_data.append(item)
                img.putdata(new_data)
            else:
                # Traitement normal avec seuil plus strict pour le blanc
                data = img.getdata()
                new_data = []
                for item in data:
                    if len(item) >= 3:
                        # Seuil plus strict : considérer comme fond seulement si très proche du blanc pur
                        if item[0] >= 250 and item[1] >= 250 and item[2] >= 250:
                            # Calculer l'alpha basé sur la distance au blanc pur pour un meilleur anti-aliasing
                            distance_from_white = max(255 - item[0], 255 - item[1], 255 - item[2])
                            if distance_from_white < 5:  # Très proche du blanc
                                alpha = 0  # Complètement transparent
                            else:
                                alpha = min(255, distance_from_white * 50)  # Partiellement transparent
                            new_data.append((item[0], item[1], item[2], alpha))
                        else:
                            # Garder le motif opaque
                            new_data.append(item if len(item) == 4 else item + (255,))
                    else:
                        new_data.append(item)
                img.putdata(new_data)
            
            # Appliquer un léger flou pour réduire les artefacts de bord
            img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
            
            # Coller sur le fond coloré
            final_img.paste(img, (0, 0), img)
            final_img.save('output.png', 'PNG')
        else:
            # Fond blanc : pas de traitement spécial nécessaire
            img_rgb = img.convert('RGB')
            img_rgb.save('output.png', 'PNG')
        
    except Exception as e:
        # Fallback : créer une image simple avec fond coloré
        background_color = params.get("background_color", "#ffffff")
        bg_rgb = hex_to_rgb(background_color)
        fallback_img = Image.new('RGB', (500, 500), bg_rgb)
        fallback_img.save('output.png', 'PNG')
    
    finally:
        # Nettoyer le fichier temporaire
        import os
        if os.path.exists('temp_output.eps'):
            os.remove('temp_output.eps')

if __name__ == "__main__":
    main()
