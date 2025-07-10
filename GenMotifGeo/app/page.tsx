"use client"
import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Download, ImageIcon, Loader2, Palette, Sun, Moon, Info } from "lucide-react"

const GeometricPatternGenerator = () => {
  const [mode, setMode] = useState<"geometric" | "fractal" | "spiral">("geometric")
  const [fractalType, setFractalType] = useState<"tree" | "koch" | "sierpinski" | "dragon">("tree")
  const [darkMode, setDarkMode] = useState(true)
  const [params, setParams] = useState({
    mode: "geometric",
    fractal_type: "tree",
    sides: 5,
    depth: 10,
    size: 100,
    angle: 20,
    color: "#0070f3",
    // Paramètres fractales
    iterations: 4,
    reduction: 0.7,
    // Paramètres spirales
    turns: 10,
    increment: 5,
    // Nouveaux paramètres pour les effets
    gradient: false,
    gradient_start: "#0070f3",
    gradient_end: "#ff6b6b",
    glow: false,
    glow_intensity: 0.5,
    background_color: "#ffffff", // Blanc par défaut
  })

  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [favorites, setFavorites] = useState<any[]>([])
  const [showFavorites, setShowFavorites] = useState(false)
  const [showSymmetry, setShowSymmetry] = useState(false)
  const [showEffects, setShowEffects] = useState(false)
  const [symmetryOptions, setSymmetryOptions] = useState({
    mirror: false,
    rotation: 1,
    kaleidoscope: false,
  })

  // Gestion du thème
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setDarkMode(savedTheme === "dark")
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light")
    localStorage.setItem("theme", darkMode ? "dark" : "light")
  }, [darkMode])

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  const handleInputChange = (name: string, value: number) => {
    setParams((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleModeChange = (newMode: "geometric" | "fractal" | "spiral") => {
    setMode(newMode)
    setParams((prev) => ({ ...prev, mode: newMode }))
  }

  const handleFractalTypeChange = (newType: "tree" | "koch" | "sierpinski" | "dragon") => {
    setFractalType(newType)
    setParams((prev) => ({ ...prev, fractal_type: newType }))
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams((prev) => ({
      ...prev,
      color: e.target.value,
    }))
  }

  const handleGradientStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams((prev) => ({
      ...prev,
      gradient_start: e.target.value,
    }))
  }

  const handleGradientEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams((prev) => ({
      ...prev,
      gradient_end: e.target.value,
    }))
  }

  const saveFavorite = () => {
    const favorite = {
      id: Date.now(),
      name: `${mode === "geometric" ? "Motif" : mode === "fractal" ? getFractalName() : "Spirale"} ${Date.now()}`,
      params: { ...params },
      mode,
      fractalType: mode === "fractal" ? fractalType : undefined,
      timestamp: new Date().toLocaleString(),
    }

    const updatedFavorites = [...favorites, favorite]
    setFavorites(updatedFavorites)
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
  }

  const loadFavorite = (favorite: any) => {
    setMode(favorite.mode)
    if (favorite.fractalType) {
      setFractalType(favorite.fractalType)
    }
    setParams(favorite.params)
    setShowFavorites(false)
  }

  const deleteFavorite = (id: number) => {
    const updatedFavorites = favorites.filter((f) => f.id !== id)
    setFavorites(updatedFavorites)
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
  }

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    setFavorites(storedFavorites)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setImgSrc(null)
    setLoading(true)

    try {
      const submitParams = {
        ...params,
        symmetry: showSymmetry ? symmetryOptions : undefined,
      }

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
          errorMsg = `Erreur ${response.status}: ${response.statusText}`
        }
        throw new Error(errorMsg)
      }

      const result = await response.json()
      setImgSrc(result.image)

      // Sauvegarder dans le localStorage
      const storedImages = JSON.parse(localStorage.getItem("generatedImages") || "[]")
      storedImages.push(result.image)
      localStorage.setItem("generatedImages", JSON.stringify(storedImages))
    } catch (err: any) {
      setError(err.message || "Échec de la connexion")
    } finally {
      setLoading(false)
    }
  }

  const getFractalName = () => {
    switch (fractalType) {
      case "tree":
        return "Arbre"
      case "koch":
        return "Flocon de Koch"
      case "sierpinski":
        return "Triangle de Sierpinski"
      case "dragon":
        return "Dragon de Heighway"
      default:
        return "Fractale"
    }
  }

  return (
    <div className="min-h-screen bg-gradient p-4">
      <div className="container container-lg">
        <div className="text-center mb-6">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <button
              onClick={toggleTheme}
              className="btn btn-outline p-2"
              title={darkMode ? "Mode clair" : "Mode sombre"}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Générateur de Motifs Géométriques</h1>
          <p className="text-secondary">Créez des motifs géométriques, fractales et spirales avec des effets avancés</p>
        </div>

        <div className="main-grid">
          {/* Panneau de contrôle */}
          <div className="card h-fit">
            <div className="card-header">
              <div className="card-title flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Paramètres de génération
              </div>
              <div className="card-description">Choisissez votre mode et ajustez les paramètres</div>
            </div>
            <div className="card-content">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Sélecteur de mode */}
                <div className="space-y-2">
                  <label className="label">Mode de génération</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleModeChange("geometric")}
                      className={`btn ${mode === "geometric" ? "btn-primary" : "btn-outline"} flex-1 text-xs`}
                    >
                      Géométrique
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModeChange("fractal")}
                      className={`btn ${mode === "fractal" ? "btn-primary" : "btn-outline"} flex-1 text-xs`}
                    >
                      Fractale
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModeChange("spiral")}
                      className={`btn ${mode === "spiral" ? "btn-primary" : "btn-outline"} flex-1 text-xs`}
                    >
                      Spirale
                    </button>
                  </div>
                </div>

                {/* Sélecteur de type de fractale */}
                {mode === "fractal" && (
                  <div className="space-y-2">
                    <label className="label">Type de fractale</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleFractalTypeChange("tree")}
                        className={`btn ${fractalType === "tree" ? "btn-primary" : "btn-outline"} text-xs`}
                      >
                        Arbre
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFractalTypeChange("koch")}
                        className={`btn ${fractalType === "koch" ? "btn-primary" : "btn-outline"} text-xs`}
                      >
                        Koch
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFractalTypeChange("sierpinski")}
                        className={`btn ${fractalType === "sierpinski" ? "btn-primary" : "btn-outline"} text-xs`}
                      >
                        Sierpinski
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFractalTypeChange("dragon")}
                        className={`btn ${fractalType === "dragon" ? "btn-primary" : "btn-outline"} text-xs`}
                      >
                        Dragon
                      </button>
                    </div>
                  </div>
                )}

                <div className="separator"></div>

                {/* Paramètres selon le mode */}
                {mode === "geometric" && (
                  <>
                    <FormField
                      label="Nombre de côtés"
                      description="3-12"
                      value={params.sides}
                      min={3}
                      max={12}
                      onChange={(value) => handleInputChange("sides", value)}
                    />
                    <FormField
                      label="Profondeur"
                      description="1-50"
                      value={params.depth}
                      min={1}
                      max={50}
                      onChange={(value) => handleInputChange("depth", value)}
                    />
                    <FormField
                      label="Taille initiale"
                      description="10-300"
                      value={params.size}
                      min={10}
                      max={300}
                      onChange={(value) => handleInputChange("size", value)}
                    />
                    <FormField
                      label="Angle"
                      description="0-360°"
                      value={params.angle}
                      min={0}
                      max={360}
                      onChange={(value) => handleInputChange("angle", value)}
                      suffix="°"
                    />
                  </>
                )}

                {mode === "fractal" && (
                  <>
                    <FormField
                      label="Itérations"
                      description="1-8"
                      value={params.iterations}
                      min={1}
                      max={8}
                      onChange={(value) => handleInputChange("iterations", value)}
                    />
                    <FormField
                      label="Taille"
                      description="50-300"
                      value={params.size}
                      min={50}
                      max={300}
                      onChange={(value) => handleInputChange("size", value)}
                    />
                    {fractalType === "tree" && (
                      <>
                        <FormField
                          label="Réduction"
                          description="30-90%"
                          value={Math.round(params.reduction * 100)}
                          min={30}
                          max={90}
                          onChange={(value) => handleInputChange("reduction", value / 100)}
                          suffix="%"
                        />
                        <FormField
                          label="Angle"
                          description="0-180°"
                          value={params.angle}
                          min={0}
                          max={180}
                          onChange={(value) => handleInputChange("angle", value)}
                          suffix="°"
                        />
                      </>
                    )}
                  </>
                )}

                {mode === "spiral" && (
                  <>
                    <FormField
                      label="Nombre de tours"
                      description="3-20"
                      value={params.turns}
                      min={3}
                      max={20}
                      onChange={(value) => handleInputChange("turns", value)}
                    />
                    <FormField
                      label="Taille initiale"
                      description="5-50"
                      value={params.size}
                      min={5}
                      max={50}
                      onChange={(value) => handleInputChange("size", value)}
                    />
                    <FormField
                      label="Incrément"
                      description="1-20"
                      value={params.increment}
                      min={1}
                      max={20}
                      onChange={(value) => handleInputChange("increment", value)}
                    />
                    <FormField
                      label="Angle par étape"
                      description="1-45°"
                      value={params.angle}
                      min={1}
                      max={45}
                      onChange={(value) => handleInputChange("angle", value)}
                      suffix="°"
                    />
                  </>
                )}

                <div className="separator"></div>

                {/* Couleurs et effets */}
                <div className="space-y-4">
                  {/* Couleur de base ou dégradé */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="label">Couleurs</label>
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={params.gradient}
                          onChange={(e) => setParams((prev) => ({ ...prev, gradient: e.target.checked }))}
                          className="rounded"
                        />
                        Dégradé
                      </label>
                    </div>

                    {params.gradient ? (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs text-secondary">Début</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={params.gradient_start}
                              onChange={handleGradientStartChange}
                              className="input w-12 h-8 p-1 cursor-pointer"
                            />
                            <div className="badge font-mono text-xs">{params.gradient_start}</div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-secondary">Fin</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={params.gradient_end}
                              onChange={handleGradientEndChange}
                              className="input w-12 h-8 p-1 cursor-pointer"
                            />
                            <div className="badge font-mono text-xs">{params.gradient_end}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={params.color}
                          onChange={handleColorChange}
                          className="input w-16 h-10 p-1 cursor-pointer"
                        />
                        <div className="badge font-mono">{params.color}</div>
                      </div>
                    )}
                  </div>

                  {/* Couleur de fond */}
                  <div className="space-y-2">
                    <label className="label">Couleur de fond</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={params.background_color}
                        onChange={(e) => setParams((prev) => ({ ...prev, background_color: e.target.value }))}
                        className="input w-16 h-10 p-1 cursor-pointer"
                      />
                      <div className="badge font-mono">{params.background_color}</div>
                      <button
                        type="button"
                        onClick={() => setParams((prev) => ({ ...prev, background_color: "#ffffff" }))}
                        className="btn btn-outline text-xs px-2 py-1"
                      >
                        Blanc
                      </button>
                      <button
                        type="button"
                        onClick={() => setParams((prev) => ({ ...prev, background_color: "#000000" }))}
                        className="btn btn-outline text-xs px-2 py-1"
                      >
                        Noir
                      </button>
                    </div>
                  </div>

                  {/* Effet Glow */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="label">Effet lumineux</label>
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={params.glow}
                          onChange={(e) => setParams((prev) => ({ ...prev, glow: e.target.checked }))}
                          className="rounded"
                        />
                        Glow/Néon
                      </label>
                    </div>

                    {params.glow && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-secondary">Intensité</label>
                          <div className="badge text-xs">{Math.round(params.glow_intensity * 100)}%</div>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.1"
                          value={params.glow_intensity}
                          onChange={(e) =>
                            setParams((prev) => ({ ...prev, glow_intensity: Number.parseFloat(e.target.value) }))
                          }
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="separator"></div>

                {/* Boutons d'actions */}
                <div className="flex gap-2">
                  <button type="button" onClick={saveFavorite} className="btn btn-outline flex-1 text-xs">
                    💾 Sauver
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFavorites(!showFavorites)}
                    className="btn btn-outline flex-1 text-xs"
                  >
                    ⭐ Favoris
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSymmetry(!showSymmetry)}
                    className={`btn ${showSymmetry ? "btn-primary" : "btn-outline"} flex-1 text-xs`}
                  >
                    🔄 Symétrie
                  </button>
                </div>

                {/* Panel des favoris */}
                {showFavorites && (
                  <div className="space-y-2">
                    <label className="label">Favoris sauvegardés</label>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {favorites.length === 0 ? (
                        <p className="text-xs text-muted">Aucun favori sauvegardé</p>
                      ) : (
                        favorites.map((fav) => (
                          <div key={fav.id} className="flex items-center gap-2 p-2 bg-secondary/20 rounded">
                            <button
                              type="button"
                              onClick={() => loadFavorite(fav)}
                              className="flex-1 text-left text-xs text-secondary hover:text-primary"
                            >
                              {fav.name}
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteFavorite(fav.id)}
                              className="text-red-400 hover:text-red-300 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Panel des symétries */}
                {showSymmetry && (
                  <div className="space-y-3">
                    <label className="label">Options de symétrie</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={symmetryOptions.mirror}
                          onChange={(e) => setSymmetryOptions((prev) => ({ ...prev, mirror: e.target.checked }))}
                          className="rounded"
                        />
                        Effet miroir
                      </label>
                      <div className="space-y-1">
                        <label className="text-xs">Rotations multiples: {symmetryOptions.rotation}</label>
                        <input
                          type="range"
                          min="1"
                          max="8"
                          value={symmetryOptions.rotation}
                          onChange={(e) =>
                            setSymmetryOptions((prev) => ({ ...prev, rotation: Number.parseInt(e.target.value) }))
                          }
                          className="w-full"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={symmetryOptions.kaleidoscope}
                          onChange={(e) => setSymmetryOptions((prev) => ({ ...prev, kaleidoscope: e.target.checked }))}
                          className="rounded"
                        />
                        Effet kaléidoscope
                      </label>
                    </div>
                  </div>
                )}

                <div className="separator"></div>

                <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Générer {mode === "geometric" ? "le motif" : mode === "fractal" ? getFractalName() : "la spirale"}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Zone d'affichage */}
          <div className="space-y-4">
            {error && (
              <div className="alert alert-destructive">
                <strong>Erreur :</strong> {error}
              </div>
            )}

            {imgSrc && (
              <div className="card">
                <div className="card-header">
                  <div className="card-title">
                    {mode === "geometric" ? "Motif" : mode === "fractal" ? getFractalName() : "Spirale"} généré
                    {mode === "fractal" ? "e" : mode === "spiral" ? "e" : ""}
                  </div>
                  <div className="card-description">Votre création personnalisée</div>
                </div>
                <div className="card-content">
                  <div className="flex justify-center mb-4">
                    <img
                      src={imgSrc || "/placeholder.svg"}
                      alt={`${mode === "geometric" ? "Motif géométrique" : mode === "fractal" ? getFractalName() : "Spirale"}`}
                      className="generated-image img-responsive"
                    />
                  </div>
                  <a
                    href={imgSrc}
                    download={`${mode}-${fractalType || "pattern"}-${Date.now()}.png`}
                    className="btn btn-primary w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger l'image
                  </a>
                </div>
              </div>
            )}

            {!imgSrc && !loading && (
              <div className="card card-dashed">
                <div className="card-content flex flex-col items-center justify-center py-12">
                  <ImageIcon className="h-12 w-12 text-muted mb-4" />
                  <p className="text-muted text-center">
                    Votre {mode === "geometric" ? "motif" : mode === "fractal" ? "fractale" : "spirale"} apparaîtra ici
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center flex gap-4 justify-center">
          <Link href="/bibliotheque" className="nav-link">
            Voir la bibliothèque d'images
          </Link>
          <Link href="/superposition" className="nav-link">
            Superposer des motifs
          </Link>
          <Link href="/informations" className="nav-link">
            <Info className="mr-2 h-4 w-4" />
            Informations & Installation
          </Link>
        </div>
      </div>
    </div>
  )
}

const FormField = ({
  label,
  description,
  value,
  min,
  max,
  onChange,
  suffix = "",
}: {
  label: string
  description: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  suffix?: string
}) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <label className="label">{label}</label>
      <div className="badge">
        {value}
        {suffix}
      </div>
    </div>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      className="input w-full"
      placeholder={`${min}-${max}`}
    />
    <p className="text-xs text-muted">{description}</p>
  </div>
)

export default GeometricPatternGenerator
