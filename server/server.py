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
from PIL import Image

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Sémaphore pour limiter les générations concurrentes
generation_semaphore = threading.Semaphore(3)

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
            
        with open('output.png', 'rb') as img_file:
            return io.BytesIO(img_file.read())
            
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
                "color": color
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
                "color": color
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
                "color": color
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
                result = Image.blend(result, img_rgba, 0.6)
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
