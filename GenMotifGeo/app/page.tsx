"use client"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Download, ImageIcon, Loader2, Palette } from "lucide-react"

const GeometricPatternGenerator = () => {
  const [params, setParams] = useState({
    sides: 5,
    depth: 10,
    size: 100,
    angle: 20,
    color: "#0070f3",
  })

  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (name: string, value: number) => {
    setParams((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams((prev) => ({
      ...prev,
      color: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setImgSrc(null)
    setLoading(true)

    try {
      const response = await fetch("http://localhost:8080/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
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

  return (
    <div className="min-h-screen bg-gradient p-4">
      <div className="container container-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Générateur de Motifs Géométriques</h1>
          <p className="text-slate-600">Créez des motifs géométriques uniques avec des paramètres personnalisables</p>
        </div>

        <div className="main-grid">
          {/* Panneau de contrôle */}
          <div className="card h-fit">
            <div className="card-header">
              <div className="card-title flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Paramètres du motif
              </div>
              <div className="card-description">Ajustez les paramètres pour créer votre motif géométrique</div>
            </div>
            <div className="card-content">
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="space-y-2">
                  <label className="label" htmlFor="color">
                    Couleur
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="color"
                      type="color"
                      value={params.color}
                      onChange={handleColorChange}
                      className="input w-16 h-10 p-1 cursor-pointer"
                    />
                    <div className="badge font-mono">{params.color}</div>
                  </div>
                </div>

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
                      Générer le motif
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
                  <div className="card-title">Motif généré</div>
                  <div className="card-description">Votre motif géométrique personnalisé</div>
                </div>
                <div className="card-content">
                  <div className="flex justify-center mb-4">
                    <img
                      src={imgSrc || "/placeholder.svg"}
                      alt="Motif géométrique"
                      className="generated-image img-responsive"
                    />
                  </div>
                  <a href={imgSrc} download="motif_geometrique.png" className="btn btn-primary w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger l'image
                  </a>
                </div>
              </div>
            )}

            {!imgSrc && !loading && (
              <div className="card card-dashed">
                <div className="card-content flex flex-col items-center justify-center py-12">
                  <ImageIcon className="h-12 w-12 text-slate-400 mb-4" />
                  <p className="text-slate-500 text-center">Votre motif généré apparaîtra ici</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/bibliotheque" className="nav-link">
            Voir la bibliothèque d'images
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
    <p className="text-xs text-slate-500">{description}</p>
  </div>
)

export default GeometricPatternGenerator
