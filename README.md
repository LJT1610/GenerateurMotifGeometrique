# 🎨 Générateur de Motifs Géométriques

Bienvenue dans le générateur de motifs géométriques !  
Ce projet open source permet de créer des motifs personnalisés, fractales, et effets visuels avancés via une interface web moderne.

## 🚀 Démo rapide

- **Frontend** : [Next.js (React)]  
- **Backend** : Python (Flask)  
- **Code source** :  
  [github.com/LJT1610/GenerateurMotifGeometrique.git](https://github.com/LJT1610/GenerateurMotifGeometrique.git)

## 🛠️ Prérequis

### Backend (Python)
- Python 3.8 ou supérieur
- pip
- Ghostscript (conversion EPS)

### Frontend (Next.js)
- Node.js 18 ou supérieur
- npm ou yarn

## ⚙️ Installation

### 1. Cloner le projet

```bash
git clone https://github.com/LJT1610/GenerateurMotifGeometrique.git
cd GenerateurMotifGeometrique
```

### 2. Installer Ghostscript

**Obligatoire pour la conversion EPS → PNG**

- **Windows** :  
  Téléchargez et installez depuis le site officiel.
- **macOS** :  
  ```bash
  brew install ghostscript
  ```
- **Ubuntu/Debian** :  
  ```bash
  sudo apt-get install ghostscript
  ```

### 3. Installer les dépendances Python (Backend)

```bash
cd server
pip install flask flask-cors pillow
```
*Activez votre environnement virtuel si besoin avant cette étape.*

### 4. Installer les dépendances Node.js (Frontend)

```bash
cd ..
npm install
# ou
yarn install
```

### 5. Lancer l'application

- **Terminal 1** : Backend Python
  ```bash
  cd server
  python server.py
  ```
- **Terminal 2** : Frontend Next.js
  ```bash
  cd ..
  npm run dev
  # ou
  yarn dev
  ```

## 🌐 Accès à l'application

- **Interface web** : [http://localhost:3000](http://localhost:3000)
- **API Backend** : [http://localhost:8080](http://localhost:8080)

## 🧩 Fonctionnalités principales

- **Génération de motifs** :  
  Motifs géométriques paramétrables, fractales (Arbre, Koch, Sierpinski, Dragon), spirales.
- **Effets visuels** :  
  Dégradés, glow/néon, fonds personnalisés, mode sombre/clair.
- **Avancées** :  
  Symétrie, superposition, bibliothèque de créations, favoris.
- **Export** :  
  Téléchargement PNG, sauvegarde automatique, haute qualité.

## 🆘 Dépannage

- **Port déjà utilisé**  
  Arrêtez l’application qui occupe le port ou modifiez la configuration.
- **Erreur dépendances Python**  
  ```bash
  pip install --upgrade pip
  ```
- **Erreur CORS**  
  Vérifiez que le backend tourne bien sur le port 8080.
- **Erreur Ghostscript**  
  - Vérifiez l’installation : `gs --version`
  - Redémarrez le terminal après installation
  - Sous Windows, ajoutez Ghostscript au PATH si besoin

## 🏗️ Architecture du projet

### Vue d'ensemble

| Frontend (Next.js)         | Backend (Flask/Python)     |
|----------------------------|----------------------------|
| React UI                   | API REST                   |
| Formulaires de paramètres  | Génération Turtle          |
| Affichage d’images         | Traitement PIL             |
| localStorage               | Conversion EPS → PNG       |
| API REST                   | Effets visuels             |

## 🔄 Flux de génération

1. **Interface React** : Saisie des paramètres
2. **Envoi JSON → Backend Flask**
3. **Validation & génération Turtle**
4. **Conversion EPS → PNG (Ghostscript + Pillow)**
5. **Application des effets (dégradé, glow, symétrie, etc.)**
6. **Image encodée en base64 → Frontend**
7. **Affichage instantané dans le navigateur**

## 🧑‍💻 Exemples de code

### Endpoint principal (Backend)

```python
@app.route("/api/generate", methods=['POST'])
def generate_endpoint():
    # ...validation des paramètres...
    # ...génération de l'image...
    # ...encodage base64...
    return jsonify({
        "image": f"data:image/png;base64,{img_base64}",
        "params": params
    })
```

### Dessin d’un motif géométrique

```python
def draw_geometric_pattern(t, params):
    for i in range(params["depth"]):
        # Dégradé de couleur
        # ...
        for _ in range(params["sides"]):
            t.forward(params["size"])
            t.right(360 / params["sides"])
        t.right(params["angle"])
        params["size"] *= 0.95
```

### Effet Glow/Néon

```python
def apply_glow_effect(img, intensity=0.5):
    # Application de plusieurs couches de flou gaussien et de luminosité
    # ...
    return result
```

## 🔗 Communication Frontend ↔ Backend

**Exemple de requête**

```json
{
  "mode": "geometric",
  "sides": 6,
  "depth": 15,
  "size": 120,
  "angle": 30,
  "color": "#ff6b6b",
  "background_color": "#000000",
  "gradient": true,
  "gradient_start": "#ff6b6b",
  "gradient_end": "#4ecdc4",
  "glow": true,
  "glow_intensity": 0.7,
  "symmetry": { "mirror": false, "rotation": 4, "kaleidoscope": false }
}
```

**Exemple de réponse**

```json
{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "params": { ... }
}
```

## ✨ Bonnes créations !

N’hésitez pas à contribuer, proposer des améliorations ou signaler des bugs via le dépôt GitHub.  
Amusez-vous à explorer les motifs et à inventer vos propres designs !
