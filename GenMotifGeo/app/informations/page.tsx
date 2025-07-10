"use client"
import Link from "next/link"
import { ArrowLeft, Github, Terminal, Play, CheckCircle, AlertCircle, Copy, Code, BookOpen } from "lucide-react"
import { useState } from "react"

const Informations = () => {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<"installation" | "code">("installation")

  const copyToClipboard = (text: string, commandId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCommand(commandId)
    setTimeout(() => setCopiedCommand(null), 2000)
  }

  const CommandBlock = ({ command, description, id }: { command: string; description: string; id: string }) => (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-green-400" />
          <span className="text-sm text-slate-300">{description}</span>
        </div>
        <button
          onClick={() => copyToClipboard(command, id)}
          className="btn btn-outline text-xs px-2 py-1"
          title="Copier la commande"
        >
          {copiedCommand === id ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </button>
      </div>
      <code className="text-green-400 font-mono text-sm bg-slate-900/50 p-2 rounded block">{command}</code>
    </div>
  )

  const CodeBlock = ({
    code,
    language,
    title,
    description,
  }: {
    code: string
    language: string
    title: string
    description?: string
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h5 className="font-medium text-slate-200">{title}</h5>
        <button
          onClick={() => copyToClipboard(code, title)}
          className="btn btn-outline text-xs px-2 py-1"
          title="Copier le code"
        >
          {copiedCommand === title ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </button>
      </div>
      {description && <p className="text-sm text-slate-400">{description}</p>}
      <div className="bg-slate-900/70 rounded-lg border border-slate-700 overflow-hidden">
        <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-700">
          <span className="text-xs text-slate-400 font-mono">{language}</span>
        </div>
        <div className="p-4 overflow-x-auto">
          <pre className="text-sm">
            <code className="text-green-400 font-mono whitespace-pre-wrap leading-relaxed">{code}</code>
          </pre>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient p-4">
      <div className="container container-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Documentation du projet</h1>
            <p className="text-slate-600">
              Guide d'installation et explication technique du générateur de motifs géométriques
            </p>
          </div>
          <Link href="/" className="nav-link">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </div>

        {/* Navigation entre sections */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveSection("installation")}
            className={`btn ${activeSection === "installation" ? "btn-primary" : "btn-outline"} flex items-center gap-2`}
          >
            <Terminal className="h-4 w-4" />
            Installation
          </button>
          <button
            onClick={() => setActiveSection("code")}
            className={`btn ${activeSection === "code" ? "btn-primary" : "btn-outline"} flex items-center gap-2`}
          >
            <Code className="h-4 w-4" />
            Code & Architecture
          </button>
        </div>

        {/* Section Installation */}
        {activeSection === "installation" && (
          <div className="grid gap-6">
            {/* Section GitHub */}
            <div className="card">
              <div className="card-header">
                <div className="card-title flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  Repository GitHub
                </div>
                <div className="card-description">Accédez au code source du projet</div>
              </div>
              <div className="card-content">
                <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-600">
                  <Github className="h-6 w-6 text-slate-400" />
                  <div className="flex-1">
                    <p className="font-mono text-sm text-slate-300">
                      https://github.com/LJT1610/GenerateurMotifGeometrique.git
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard("https://github.com/LJT1610/GenerateurMotifGeometrique.git", "repo-url")
                    }
                    className="btn btn-outline text-xs"
                  >
                    {copiedCommand === "repo-url" ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Prérequis */}
            <div className="card">
              <div className="card-header">
                <div className="card-title flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Prérequis
                </div>
                <div className="card-description">Logiciels nécessaires avant l'installation</div>
              </div>
              <div className="card-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-200">Backend (Python)</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        Python 3.8 ou supérieur
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        pip (gestionnaire de paquets Python)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        Ghostscript (pour la conversion EPS)
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-200">Frontend (Next.js)</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        Node.js 18 ou supérieur
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        npm ou yarn
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Installation */}
            <div className="card">
              <div className="card-header">
                <div className="card-title flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Installation étape par étape
                </div>
                <div className="card-description">Suivez ces étapes dans l'ordre</div>
              </div>
              <div className="card-content space-y-6">
                {/* Étape 1 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <h4 className="font-semibold text-slate-200">Cloner le repository</h4>
                  </div>
                  <CommandBlock
                    command="git clone https://github.com/LJT1610/GenerateurMotifGeometrique.git"
                    description="Cloner le projet depuis GitHub"
                    id="git-clone"
                  />
                  <CommandBlock
                    command="cd GenerateurMotifGeometrique"
                    description="Naviguer dans le dossier du projet"
                    id="cd-project"
                  />
                </div>

                {/* Étape 2 - Installation de Ghostscript */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <h4 className="font-semibold text-slate-200">Installation de Ghostscript</h4>
                  </div>

                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-2 mb-3">
                      <AlertCircle className="h-4 w-4 text-orange-400 mt-0.5" />
                      <div className="text-sm text-orange-300">
                        <strong>Obligatoire :</strong> Ghostscript est nécessaire pour convertir les fichiers EPS
                        générés par Turtle.
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-slate-200 mb-2">Windows</h5>
                        <p className="text-sm text-slate-300 mb-2">Téléchargez et installez depuis :</p>
                        <div className="bg-slate-800/50 rounded p-2">
                          <code className="text-green-400 text-sm">
                            https://www.ghostscript.com/download/gsdnld.html
                          </code>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-slate-200 mb-2">macOS</h5>
                        <CommandBlock
                          command="brew install ghostscript"
                          description="Installation via Homebrew"
                          id="brew-ghostscript"
                        />
                      </div>

                      <div>
                        <h5 className="font-medium text-slate-200 mb-2">Ubuntu/Debian</h5>
                        <CommandBlock
                          command="sudo apt-get install ghostscript"
                          description="Installation via apt"
                          id="apt-ghostscript"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Étape 3 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <h4 className="font-semibold text-slate-200">Installation des dépendances Python (Backend)</h4>
                  </div>
                  <CommandBlock command="cd server" description="Naviguer vers le dossier serveur" id="cd-server" />
                  <CommandBlock
                    command="pip install flask flask-cors pillow"
                    description="Installer les dépendances Python"
                    id="pip-install"
                  />
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5" />
                      <div className="text-sm text-yellow-300">
                        <strong>Note :</strong> Si vous utilisez un environnement virtuel Python, activez-le avant
                        d'installer les dépendances.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Étape 4 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <h4 className="font-semibold text-slate-200">Installation des dépendances Next.js (Frontend)</h4>
                  </div>
                  <CommandBlock command="cd .." description="Retourner au dossier racine" id="cd-back" />
                  <CommandBlock
                    command="npm install"
                    description="Installer les dépendances Node.js"
                    id="npm-install"
                  />
                  <div className="text-sm text-slate-400">
                    <strong>Alternative avec Yarn :</strong>{" "}
                    <code className="bg-slate-800 px-2 py-1 rounded">yarn install</code>
                  </div>
                </div>

                {/* Étape 5 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      5
                    </div>
                    <h4 className="font-semibold text-slate-200">Lancement de l'application</h4>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h5 className="font-medium text-blue-300 mb-3">Terminal 1 - Serveur Backend (Python)</h5>
                    <div className="space-y-2">
                      <CommandBlock command="cd server" description="Naviguer vers le serveur" id="cd-server-run" />
                      <CommandBlock
                        command="python server.py"
                        description="Lancer le serveur Flask (port 8080)"
                        id="python-server"
                      />
                    </div>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h5 className="font-medium text-green-300 mb-3">Terminal 2 - Frontend Next.js</h5>
                    <div className="space-y-2">
                      <CommandBlock
                        command="npm run dev"
                        description="Lancer le serveur de développement Next.js (port 3000)"
                        id="npm-dev"
                      />
                    </div>
                    <div className="text-sm text-slate-400 mt-2">
                      <strong>Alternative avec Yarn :</strong>{" "}
                      <code className="bg-slate-800 px-2 py-1 rounded">yarn dev</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accès */}
            <div className="card">
              <div className="card-header">
                <div className="card-title flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Accès à l'application
                </div>
                <div className="card-description">Une fois les serveurs lancés</div>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="font-medium text-green-300">Application principale</p>
                      <p className="text-sm text-slate-300">
                        Ouvrez votre navigateur et allez sur :
                        <code className="ml-2 bg-slate-800 px-2 py-1 rounded">http://localhost:3000</code>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <Terminal className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="font-medium text-blue-300">API Backend</p>
                      <p className="text-sm text-slate-300">
                        Le serveur Python tourne sur :
                        <code className="ml-2 bg-slate-800 px-2 py-1 rounded">http://localhost:8080</code>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dépannage */}
            <div className="card">
              <div className="card-header">
                <div className="card-title flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Dépannage
                </div>
                <div className="card-description">Solutions aux problèmes courants</div>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h5 className="font-medium text-yellow-300 mb-2">Port déjà utilisé</h5>
                    <p className="text-sm text-slate-300 mb-2">
                      Si le port 3000 ou 8080 est déjà utilisé, vous pouvez :
                    </p>
                    <ul className="text-sm text-slate-400 space-y-1">
                      <li>• Arrêter les autres applications utilisant ces ports</li>
                      <li>• Modifier les ports dans les fichiers de configuration</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4">
                    <h5 className="font-medium text-red-300 mb-2">Erreur de dépendances Python</h5>
                    <p className="text-sm text-slate-300 mb-2">Si l'installation des dépendances Python échoue :</p>
                    <CommandBlock
                      command="pip install --upgrade pip"
                      description="Mettre à jour pip"
                      id="pip-upgrade"
                    />
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4">
                    <h5 className="font-medium text-blue-300 mb-2">Problème de CORS</h5>
                    <p className="text-sm text-slate-300">
                      Si vous avez des erreurs CORS, vérifiez que le serveur Python est bien lancé sur le port 8080.
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4">
                    <h5 className="font-medium text-purple-300 mb-2">Erreur Ghostscript</h5>
                    <p className="text-sm text-slate-300 mb-2">
                      Si vous obtenez une erreur liée à EPS ou Ghostscript :
                    </p>
                    <ul className="text-sm text-slate-400 space-y-1">
                      <li>
                        • Vérifiez que Ghostscript est installé :{" "}
                        <code className="bg-slate-800 px-1 rounded">gs --version</code>
                      </li>
                      <li>• Redémarrez votre terminal après l'installation</li>
                      <li>• Sur Windows, ajoutez Ghostscript au PATH si nécessaire</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Fonctionnalités */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Fonctionnalités disponibles</div>
                <div className="card-description">Ce que vous pouvez faire avec l'application</div>
              </div>
              <div className="card-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-medium text-slate-200">Génération de motifs</h5>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• Motifs géométriques personnalisables</li>
                      <li>• Fractales (Arbre, Koch, Sierpinski, Dragon)</li>
                      <li>• Spirales avec paramètres ajustables</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-slate-200">Effets visuels</h5>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• Dégradés de couleurs</li>
                      <li>• Effets glow/néon</li>
                      <li>• Fonds personnalisables</li>
                      <li>• Mode sombre/clair</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-slate-200">Fonctionnalités avancées</h5>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• Effets de symétrie</li>
                      <li>• Superposition d'images</li>
                      <li>• Bibliothèque de créations</li>
                      <li>• Système de favoris</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-slate-200">Export</h5>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• Téléchargement en PNG</li>
                      <li>• Sauvegarde automatique</li>
                      <li>• Haute qualité</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Code & Architecture */}
        {activeSection === "code" && (
          <div className="grid gap-6">
            {/* Architecture générale */}
            <div className="card">
              <div className="card-header">
                <div className="card-title flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Architecture générale
                </div>
                <div className="card-description">Vue d'ensemble du système</div>
              </div>
              <div className="card-content space-y-4">
                <p className="text-sm text-slate-300">
                  L'application suit une architecture <strong>client-serveur</strong> avec deux parties distinctes :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded p-4">
                    <h5 className="font-medium text-blue-300 mb-3">Frontend (Next.js)</h5>
                    <ul className="text-sm text-slate-300 space-y-2">
                      <li>• Interface utilisateur React</li>
                      <li>• Formulaires de paramètres</li>
                      <li>• Affichage des images</li>
                      <li>• Gestion du localStorage</li>
                      <li>• Communication API REST</li>
                    </ul>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded p-4">
                    <h5 className="font-medium text-green-300 mb-3">Backend (Python/Flask)</h5>
                    <ul className="text-sm text-slate-300 space-y-2">
                      <li>• API REST</li>
                      <li>• Génération avec Turtle</li>
                      <li>• Traitement d'images PIL</li>
                      <li>• Conversion EPS → PNG</li>
                      <li>• Effets visuels</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Backend Flask */}
            <div className="card">
              <div className="card-header">
                <div className="card-title flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Backend Flask - API REST
                </div>
                <div className="card-description">Serveur Python qui génère les images</div>
              </div>
              <div className="card-content space-y-6">
                <p className="text-sm text-slate-300">
                  Le serveur Flask expose une API REST qui reçoit les paramètres et génère les images :
                </p>

                <CodeBlock
                  language="Python"
                  title="Endpoint principal de génération"
                  description="Point d'entrée de l'API pour générer les motifs"
                  code={`@app.route("/api/generate", methods=['POST'])
def generate_endpoint():
    data = request.json
    mode = data.get("mode", "geometric")
    
    # Validation des paramètres
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
            "glow": glow
        }
    
    # Génération de l'image avec limitation de concurrence
    with generation_semaphore:
        img_io = generate_pattern_with_params(params)
    
    # Retour en base64
    img_base64 = base64.b64encode(img_io.getvalue()).decode('utf-8')
    return jsonify({
        "image": f"data:image/png;base64,{img_base64}",
        "params": params
    })`}
                />

                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600">
                  <h5 className="font-medium text-slate-200 mb-2">Points clés du backend :</h5>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>
                      • <strong>Validation</strong> : Tous les paramètres sont validés avec des limites min/max
                    </li>
                    <li>
                      • <strong>Sémaphore</strong> : Limite les générations concurrentes (maximum 3)
                    </li>
                    <li>
                      • <strong>Base64</strong> : L'image est encodée pour le transport JSON
                    </li>
                    <li>
                      • <strong>CORS</strong> : Configuration pour permettre les requêtes cross-origin
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Génération Turtle */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Génération avec Turtle - Motifs géométriques</div>
                <div className="card-description">Algorithmes de dessin des motifs</div>
              </div>
              <div className="card-content space-y-6">
                <p className="text-sm text-slate-300">
                  Turtle dessine les motifs géométriques en suivant des algorithmes mathématiques précis :
                </p>

                <CodeBlock
                  language="Python"
                  title="Fonction de dessin géométrique"
                  description="Algorithme principal pour les motifs géométriques"
                  code={`def draw_geometric_pattern(t, params):
    """Dessine un motif géométrique avec dégradé optionnel"""
    sides = params["sides"]
    depth = params["depth"] 
    size = params["size"]
    angle = params["angle"]
    gradient = params.get("gradient", False)
    
    for i in range(depth):
        # Application du dégradé de couleur
        if gradient:
            factor = i / max(1, depth - 1)
            color = interpolate_color(
                params["gradient_start"], 
                params["gradient_end"], 
                factor
            )
            t.color(fix_turtle_color(color))
        
        # Dessiner un polygone régulier
        for _ in range(sides):
            t.forward(size)
            t.right(360 / sides)
        
        # Rotation et réduction pour l'effet spiral
        t.right(angle)
        size *= 0.95  # Réduction progressive de 5%`}
                />

                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600">
                  <h5 className="font-medium text-slate-200 mb-2">Algorithme géométrique :</h5>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>
                      • <strong>Boucle principale</strong> : Répète le motif selon la profondeur définie
                    </li>
                    <li>
                      • <strong>Polygone régulier</strong> : Dessine un polygone avec N côtés (360°/N par côté)
                    </li>
                    <li>
                      • <strong>Rotation</strong> : Tourne d'un angle donné entre chaque itération
                    </li>
                    <li>
                      • <strong>Réduction progressive</strong> : La taille diminue de 5% à chaque itération
                    </li>
                    <li>
                      • <strong>Dégradé</strong> : Interpolation linéaire entre deux couleurs
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Fractales */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Fractales - Récursion mathématique</div>
                <div className="card-description">Algorithmes récursifs pour les fractales</div>
              </div>
              <div className="card-content space-y-6">
                <p className="text-sm text-slate-300">
                  Les fractales utilisent la <strong>récursion</strong> pour créer des motifs auto-similaires :
                </p>

                <CodeBlock
                  language="Python"
                  title="Arbre fractal récursif"
                  description="Algorithme récursif pour générer un arbre fractal"
                  code={`def draw_fractal_tree(t, length, iterations, angle, reduction, params, current_depth=0):
    """Dessine un arbre fractal avec dégradé optionnel"""
    
    # Condition d'arrêt de la récursion
    if iterations == 0:
        return
    
    # Application du dégradé selon la profondeur
    gradient = params.get("gradient", False)
    if gradient:
        max_depth = params.get("iterations", 4)
        factor = current_depth / max(1, max_depth - 1)
        color = interpolate_color(
            params["gradient_start"], 
            params["gradient_end"], 
            factor
        )
        t.color(fix_turtle_color(color))
    
    # Dessiner le tronc/branche actuelle
    t.forward(length)
    
    # Branche droite (récursion)
    t.right(angle)
    draw_fractal_tree(
        t, 
        length * reduction, 
        iterations - 1, 
        angle, 
        reduction, 
        params, 
        current_depth + 1
    )
    
    # Branche gauche (récursion)
    t.left(2 * angle)
    draw_fractal_tree(
        t, 
        length * reduction, 
        iterations - 1, 
        angle, 
        reduction, 
        params, 
        current_depth + 1
    )
    
    # Retour à la position initiale
    t.right(angle)
    t.backward(length)`}
                />

                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600">
                  <h5 className="font-medium text-slate-200 mb-2">Principe récursif :</h5>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>
                      • <strong>Condition d'arrêt</strong> : iterations == 0 pour éviter la récursion infinie
                    </li>
                    <li>
                      • <strong>Auto-appel</strong> : La fonction s'appelle elle-même avec des paramètres modifiés
                    </li>
                    <li>
                      • <strong>Réduction</strong> : Chaque branche est plus petite (facteur de réduction)
                    </li>
                    <li>
                      • <strong>Symétrie</strong> : Création de branches droite et gauche
                    </li>
                    <li>
                      • <strong>Profondeur</strong> : Le niveau de récursion détermine la complexité
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Traitement d'images */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Traitement d'images - PIL & Ghostscript</div>
                <div className="card-description">Conversion et application des effets visuels</div>
              </div>
              <div className="card-content space-y-6">
                <p className="text-sm text-slate-300">
                  Pipeline de traitement : EPS → PNG avec application des effets visuels
                </p>

                <CodeBlock
                  language="Python"
                  title="Pipeline de traitement d'image"
                  description="Conversion EPS vers PNG avec effets"
                  code={`def generate_pattern_with_params(params):
    """Génère un motif via un sous-processus isolé avec tous les paramètres"""
    
    # 1. Génération du motif avec Turtle (subprocess)
    result = subprocess.run(
        ['python', 'turtle_worker.py', param_file],
        capture_output=True,
        text=True,
        timeout=30
    )
    
    # 2. Chargement de l'image EPS générée
    img = Image.open('output.png')
    
    # 3. Application de la couleur de fond personnalisée
    background_color = params.get('background_color', '#000000')
    if background_color != '#000000':
        # Conversion couleur hex vers RGB
        bg_rgb = tuple(int(background_color.lstrip('#')[i:i+2], 16) for i in (0, 2, 4))
        
        # Création du nouveau fond
        new_img = Image.new('RGB', img.size, bg_rgb)
        
        # Traitement de la transparence
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        data = img.getdata()
        new_data = []
        for item in data:
            # Remplacer le fond blanc par la transparence
            if len(item) >= 3 and item[0] > 240 and item[1] > 240 and item[2] > 240:
                new_data.append((item[0], item[1], item[2], 0))  # Transparent
            else:
                new_data.append(item if len(item) == 4 else item + (255,))
        
        img.putdata(new_data)
        new_img.paste(img, (0, 0), img)
        img = new_img
    
    # 4. Application de l'effet glow si demandé
    if params.get('glow', False):
        glow_intensity = params.get('glow_intensity', 0.5)
        img = apply_glow_effect(img, glow_intensity)
    
    return img`}
                />

                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600">
                  <h5 className="font-medium text-slate-200 mb-2">Pipeline de traitement :</h5>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>
                      • <strong>EPS</strong> : Format vectoriel généré par Turtle Graphics
                    </li>
                    <li>
                      • <strong>Ghostscript</strong> : Convertit EPS en image raster (bitmap)
                    </li>
                    <li>
                      • <strong>PIL</strong> : Manipulation d'image Python (Pillow)
                    </li>
                    <li>
                      • <strong>Transparence</strong> : Remplace le fond blanc par la transparence
                    </li>
                    <li>
                      • <strong>Composition</strong> : Colle l'image sur le fond coloré personnalisé
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Effets visuels */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Effets visuels - Glow & Dégradés</div>
                <div className="card-description">Algorithmes d'effets lumineux</div>
              </div>
              <div className="card-content space-y-6">
                <p className="text-sm text-slate-300">
                  Application d'effets lumineux avec plusieurs couches de flou gaussien :
                </p>

                <CodeBlock
                  language="Python"
                  title="Effet Glow/Néon"
                  description="Création d'un effet lumineux avec plusieurs couches"
                  code={`def apply_glow_effect(img, intensity=0.5):
    """Applique un effet glow/néon à l'image"""
    
    # Convertir en RGBA si nécessaire
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Créer une copie pour l'effet glow
    glow_img = img.copy()
    glow_layers = []
    
    # Première couche - flou léger (halo proche)
    glow1 = glow_img.filter(ImageFilter.GaussianBlur(radius=2))
    enhancer1 = ImageEnhance.Brightness(glow1)
    glow1 = enhancer1.enhance(1.2 + intensity * 0.3)
    glow_layers.append(glow1)
    
    # Deuxième couche - flou moyen (halo intermédiaire)
    glow2 = glow_img.filter(ImageFilter.GaussianBlur(radius=5))
    enhancer2 = ImageEnhance.Brightness(glow2)
    glow2 = enhancer2.enhance(1.1 + intensity * 0.4)
    glow_layers.append(glow2)
    
    # Troisième couche - flou fort (halo étendu)
    glow3 = glow_img.filter(ImageFilter.GaussianBlur(radius=10))
    enhancer3 = ImageEnhance.Brightness(glow3)
    glow3 = enhancer3.enhance(1.0 + intensity * 0.5)
    glow_layers.append(glow3)
    
    # Combiner toutes les couches (des plus floues aux plus nettes)
    result = img.copy()
    for glow_layer in reversed(glow_layers):
        result = Image.alpha_composite(result, glow_layer)
    
    # Ajouter l'image originale par-dessus pour la netteté
    result = Image.alpha_composite(result, img)
    
    return result`}
                />

                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600">
                  <h5 className="font-medium text-slate-200 mb-2">Technique du glow :</h5>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>
                      • <strong>Multi-couches</strong> : 3 niveaux de flou différents (2px, 5px, 10px)
                    </li>
                    <li>
                      • <strong>Gaussian Blur</strong> : Flou gaussien pour un effet naturel
                    </li>
                    <li>
                      • <strong>Brightness Enhancement</strong> : Augmente la luminosité selon l'intensité
                    </li>
                    <li>
                      • <strong>Alpha Composite</strong> : Superposition des couches avec transparence
                    </li>
                    <li>
                      • <strong>Intensité variable</strong> : Contrôle de l'effet de 10% à 100%
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Frontend React */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Frontend Next.js - Interface utilisateur</div>
                <div className="card-description">Gestion d'état et communication API</div>
              </div>
              <div className="card-content space-y-6">
                <p className="text-sm text-slate-300">
                  Interface React avec gestion d'état et appels API vers le backend Python :
                </p>

                <CodeBlock
                  language="TypeScript"
                  title="Fonction de génération côté client"
                  description="Gestion de la communication avec l'API backend"
                  code={`const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError(null)
  setImgSrc(null)
  setLoading(true)

  try {
    // Préparation des paramètres avec symétrie optionnelle
    const submitParams = {
      ...params,
      symmetry: showSymmetry ? symmetryOptions : undefined,
    }

    // Appel API vers le backend Python
    const response = await fetch("http://localhost:8080/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submitParams),
    })

    if (!response.ok) {
      let errorMsg = "Erreur serveur"
      try {
        const errorData = await response.json()
        errorMsg = errorData.error || errorMsg
      } catch {
        errorMsg = \`Erreur \${response.status}: \${response.statusText}\`
      }
      throw new Error(errorMsg)
    }

    const result = await response.json()
    setImgSrc(result.image)  // Image en base64

    // Sauvegarde automatique dans le localStorage
    const storedImages = JSON.parse(localStorage.getItem("generatedImages") || "[]")
    storedImages.push(result.image)
    localStorage.setItem("generatedImages", JSON.stringify(storedImages))
    
  } catch (err: any) {
    setError(err.message || "Échec de la connexion")
  } finally {
    setLoading(false)
  }
}`}
                />

                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600">
                  <h5 className="font-medium text-slate-200 mb-2">Fonctionnalités React :</h5>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>
                      • <strong>useState</strong> : Gestion de l'état des paramètres et de l'interface
                    </li>
                    <li>
                      • <strong>Fetch API</strong> : Communication HTTP avec le backend Python
                    </li>
                    <li>
                      • <strong>localStorage</strong> : Sauvegarde persistante des créations
                    </li>
                    <li>
                      • <strong>Base64</strong> : Affichage direct des images sans fichiers temporaires
                    </li>
                    <li>
                      • <strong>Error Handling</strong> : Gestion des erreurs réseau et serveur
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Communication */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Communication Frontend ↔ Backend</div>
                <div className="card-description">Protocole d'échange de données</div>
              </div>
              <div className="card-content space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded p-4">
                    <h5 className="font-medium text-blue-300 mb-3">Requête (Frontend → Backend)</h5>
                    <CodeBlock
                      language="JSON"
                      title="Exemple de requête"
                      code={`{
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
  "symmetry": {
    "mirror": false,
    "rotation": 4,
    "kaleidoscope": false
  }
}`}
                    />
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded p-4">
                    <h5 className="font-medium text-green-300 mb-3">Réponse (Backend → Frontend)</h5>
                    <CodeBlock
                      language="JSON"
                      title="Exemple de réponse"
                      code={`{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "params": {
    "mode": "geometric",
    "sides": 6,
    "depth": 15,
    "size": 120,
    "angle": 30,
    "color": "#ff6b6b",
    "background_color": "#000000",
    "gradient": true,
    "glow": true,
    "glow_intensity": 0.7
  }
}`}
                    />
                  </div>
                </div>

                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600">
                  <h5 className="font-medium text-slate-200 mb-2">Flux de données complet :</h5>
                  <div className="text-sm text-slate-300 font-mono bg-slate-900/50 p-3 rounded">
                    Interface React → JSON → API Flask → Validation → Turtle Graphics → EPS → Ghostscript → PIL → Effets
                    → PNG → Base64 → JSON → React → DOM
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Informations
