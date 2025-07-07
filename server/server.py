from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import json
import os
import logging
import uuid
import base64
import io
import threading
import sys
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Sémaphore pour limiter les générations concurrentes
generation_semaphore = threading.Semaphore(3)

def apply_glow_effect(img, intensity=0.5):
    """Applique un effet glow/néon à l'image"""
    try:
        # Convertir en RGBA si nécessaire
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Créer une copie pour l'effet glow
        glow_img = img.copy()
        
        # Appliquer plusieurs passes de flou avec différentes intensités
        glow_layers = []
        
        # Première couche - flou léger
        glow1 = glow_img.filter(ImageFilter.GaussianBlur(radius=2))
        enhancer1 = ImageEnhance.Brightness(glow1)
        glow1 = enhancer1.enhance(1.2 + intensity * 0.3)
        glow_layers.append(glow1)
        
        # Deuxième couche - flou moyen
        glow2 = glow_img.filter(ImageFilter.GaussianBlur(radius=5))
        enhancer2 = ImageEnhance.Brightness(glow2)
        glow2 = enhancer2.enhance(1.1 + intensity * 0.4)
        glow_layers.append(glow2)
        
        # Troisième couche - flou fort
        glow3 = glow_img.filter(ImageFilter.GaussianBlur(radius=10))
        enhancer3 = ImageEnhance.Brightness(glow3)
        glow3 = enhancer3.enhance(1.0 + intensity * 0.5)
        glow_layers.append(glow3)
        
        # Combiner toutes les couches
        result = img.copy()
        for glow_layer in reversed(glow_layers):  # Commencer par les plus floues
            result = Image.alpha_composite(result, glow_layer)
        
        # Ajouter l'image originale par-dessus
        result = Image.alpha_composite(result, img)
        
        return result
        
    except Exception as e:
        logging.error(f"Erreur lors de l'application de l'effet glow: {str(e)}")
        return img

def generate_pattern_with_params(params):
    """Génère un motif via un sous-processus isolé avec tous les paramètres"""
    try:
        # Créer un fichier temporaire pour les paramètres
        param_file = f"params_{uuid.uuid4()}.json"
        with open(param_file, 'w') as f:
            json.dump(params, f)
        
        # Configuration des flags selon l'OS
        creationflags = 0
        if sys.platform == "win32":
            creationflags = subprocess.CREATE_NO_WINDOW
        
        # Lancer le sous-processus
        result = subprocess.run(
            ['python', 'turtle_worker.py', param_file],
            capture_output=True,
            text=True,
            timeout=30,
            creationflags=creationflags
        )
        
        if result.returncode != 0:
            raise Exception(f"Erreur génération: {result.stderr}")
        
        # Lire l'image générée
        if not os.path.exists('output.png'):
            raise Exception("Fichier de sortie non généré")
        
        # Charger l'image
        img = Image.open('output.png')
        
        # Appliquer la couleur de fond personnalisée
        background_color = params.get('background_color', '#000000')
        if background_color != '#000000':  # Si ce n'est pas noir (défaut)
            # Convertir la couleur hex en RGB
            bg_rgb = tuple(int(background_color.lstrip('#')[i:i+2], 16) for i in (0, 2, 4))
            
            # Convertir l'image en RGBA pour traiter la transparence
            if img.mode != 'RGBA':
                img = img.convert('RGBA')
            
            # Créer une nouvelle image avec le fond coloré
            new_img = Image.new('RGB', img.size, bg_rgb)
            
            # Remplacer le fond blanc par la transparence (pas le noir qui est le motif)
            data = img.getdata()
            new_data = []
            for item in data:
                # Si le pixel est blanc ou très clair (fond), le rendre transparent
                if len(item) >= 3 and item[0] > 240 and item[1] > 240 and item[2] > 240:
                    new_data.append((item[0], item[1], item[2], 0))  # Transparent
                else:
                    new_data.append(item if len(item) == 4 else item + (255,))  # Garder le motif opaque
            
            img.putdata(new_data)
            
            # Coller l'image avec transparence sur le nouveau fond coloré
            new_img.paste(img, (0, 0), img)
            img = new_img
        
        # Appliquer l'effet glow si demandé
        if params.get('glow', False):
            glow_intensity = params.get('glow_intensity', 0.5)
            img = apply_glow_effect(img, glow_intensity)
        
        # Sauvegarder l'image avec effets
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        
        return buffer
            
    except Exception as e:
        logging.error(f"Erreur: {str(e)}")
        raise
    finally:
        # Nettoyage
        if os.path.exists(param_file):
            os.remove(param_file)
        if os.path.exists('output.png'):
            os.remove('output.png')

@app.route("/api/generate", methods=['POST', 'OPTIONS'])
def generate_endpoint():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.json
        mode = data.get("mode", "geometric")
        
        # Paramètres communs
        color = data.get("color", "#0070f3")
        background_color = data.get("background_color", "#000000")
        gradient = data.get("gradient", False)
        gradient_start = data.get("gradient_start", "#0070f3")
        gradient_end = data.get("gradient_end", "#ff6b6b")
        glow = data.get("glow", False)
        glow_intensity = max(0.1, min(1.0, float(data.get("glow_intensity", 0.5))))
        
        # Validation selon le mode
        if mode == "geometric":
            sides = max(3, min(12, int(data.get("sides", 5))))
            depth = max(1, min(50, int(data.get("depth", 10))))
            size = max(10, min(300, int(data.get("size", 100))))
            angle = max(0, min(360, float(data.get("angle", 20))))
            
            params = {
                "mode": mode,
                "sides": sides,
                "depth": depth,
                "size": size,
                "angle": angle,
                "color": color,
                "background_color": background_color,
                "gradient": gradient,
                "gradient_start": gradient_start,
                "gradient_end": gradient_end,
                "glow": glow,
                "glow_intensity": glow_intensity
            }
            
        elif mode == "fractal":
            fractal_type = data.get("fractal_type", "tree")
            iterations = max(1, min(8, int(data.get("iterations", 4))))
            size = max(50, min(300, int(data.get("size", 150))))
            
            params = {
                "mode": mode,
                "fractal_type": fractal_type,
                "iterations": iterations,
                "size": size,
                "color": color,
                "background_color": background_color,
                "gradient": gradient,
                "gradient_start": gradient_start,
                "gradient_end": gradient_end,
                "glow": glow,
                "glow_intensity": glow_intensity
            }
            
            # Paramètres spécifiques à l'arbre fractal
            if fractal_type == "tree":
                reduction = max(0.3, min(0.9, float(data.get("reduction", 0.7))))
                angle = max(0, min(180, float(data.get("angle", 30))))
                params["reduction"] = reduction
                params["angle"] = angle
            
        elif mode == "spiral":
            turns = max(3, min(20, int(data.get("turns", 10))))
            size = max(5, min(50, int(data.get("size", 10))))
            increment = max(1, min(20, int(data.get("increment", 5))))
            angle = max(1, min(45, float(data.get("angle", 10))))
            
            params = {
                "mode": mode,
                "turns": turns,
                "size": size,
                "increment": increment,
                "angle": angle,
                "color": color,
                "background_color": background_color,
                "gradient": gradient,
                "gradient_start": gradient_start,
                "gradient_end": gradient_end,
                "glow": glow,
                "glow_intensity": glow_intensity
            }
        else:
            raise ValueError("Mode non supporté")
        
        # Ajouter les paramètres de symétrie s'ils existent
        symmetry = data.get("symmetry")
        if symmetry:
            params["symmetry"] = symmetry
        
        # Génération de l'image avec limitation de concurrence
        with generation_semaphore:
            img_io = generate_pattern_with_params(params)
        
        # Convertir en base64 pour le frontend
        img_base64 = base64.b64encode(img_io.getvalue()).decode('utf-8')
        return jsonify({
            "image": f"data:image/png;base64,{img_base64}",
            "params": params
        })
        
    except Exception as e:
        logging.error(f"Erreur: {str(e)}")
        return jsonify({"error": str(e)}), 400

@app.route("/api/combine", methods=['POST', 'OPTIONS'])
def combine_endpoint():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.json
        images = data.get("images", [])
        blend_mode = data.get("blendMode", "normal")
        opacity = data.get("opacity", 0.7)
        
        if len(images) < 2:
            raise ValueError("Au moins 2 images requises")
        
        # Décoder les images base64
        pil_images = []
        for img_data in images:
            if img_data.startswith('data:image'):
                img_data = img_data.split(',')[1]
            img_bytes = base64.b64decode(img_data)
            pil_images.append(Image.open(io.BytesIO(img_bytes)))
        
        # Redimensionner toutes les images à la même taille
        size = (500, 500)
        resized_images = [img.resize(size, Image.Resampling.LANCZOS) for img in pil_images]
        
        # Combiner les images
        result = resized_images[0].convert('RGBA')
        for img in resized_images[1:]:
            img_rgba = img.convert('RGBA')
            
            # Appliquer l'opacité
            alpha = img_rgba.split()[-1]
            alpha = alpha.point(lambda p: int(p * opacity))
            img_rgba.putalpha(alpha)
            
            # Modes de fusion basiques
            if blend_mode == "multiply":
                result = Image.blend(result, img_rgba, 0.5)
            elif blend_mode == "screen":
                result = Image.blend(result, img_rgba, 0.7)
            elif blend_mode == "overlay":
                result = Image.alpha_composite(result, img_rgba)
            else:  # normal
                result = Image.alpha_composite(result, img_rgba)
        
        # Convertir en base64
        buffer = io.BytesIO()
        result.convert('RGB').save(buffer, format='PNG')
        img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        
        return jsonify({
            "image": f"data:image/png;base64,{img_base64}"
        })
        
    except Exception as e:
        logging.error(f"Erreur combinaison: {str(e)}")
        return jsonify({"error": str(e)}), 400

@app.route("/api/forme_geo", methods=['GET'])
def home_endpoint():
    return jsonify({
        "message": "Bienvenue sur le générateur de motifs géométriques !",
        "peoples": ["Jean", "Pierre", "Jacques", "Paul"],
    })

if __name__ == "__main__":
    app.run(debug=True, port=8080, threaded=True)
