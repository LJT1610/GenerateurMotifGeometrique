"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Download, Plus, Trash2, ArrowLeft, Layers, ImageIcon, Settings } from "lucide-react"

const Superposition = () => {
  const [images, setImages] = useState<string[]>([])
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [combinedImage, setCombinedImage] = useState<string | null>(null)
  const [opacity, setOpacity] = useState(0.6)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem("generatedImages") || "[]")
    setImages(storedImages)
  }, [])

  const toggleImageSelection = (imgData: string) => {
    setSelectedImages((prev) => {
      if (prev.includes(imgData)) {
        return prev.filter((img) => img !== imgData)
      } else if (prev.length < 3) {
        // Limite à 3 images pour un meilleur résultat
        return [...prev, imgData]
      }
      return prev
    })
  }

  const combineImages = async () => {
    if (selectedImages.length < 2) return

    setLoading(true)
    try {
      const response = await fetch("http://localhost:8080/api/combine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: selectedImages,
          blendMode: "overlay", // Mode fixé à overlay
          opacity,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setCombinedImage(result.image)

        // Sauvegarder l'image combinée
        const storedImages = JSON.parse(localStorage.getItem("generatedImages") || "[]")
        storedImages.push(result.image)
        localStorage.setItem("generatedImages", JSON.stringify(storedImages))
      } else {
        console.error("Erreur lors de la combinaison")
      }
    } catch (error) {
      console.error("Erreur lors de la combinaison:", error)
    } finally {
      setLoading(false)
    }
  }

  const clearSelection = () => {
    setSelectedImages([])
    setCombinedImage(null)
  }

  const removeFromSelection = (imgData: string) => {
    setSelectedImages((prev) => prev.filter((img) => img !== imgData))
  }

  return (
    <div className="min-h-screen bg-gradient p-4">
      <div className="container container-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Superposition de motifs</h1>
            <p className="text-slate-600">Combinez vos créations avec un effet de superposition élégant</p>
          </div>
          <Link href="/" className="nav-link">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </div>

        {images.length === 0 ? (
          <div className="card">
            <div className="card-content text-center py-12">
              <div className="text-slate-400 text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-slate-300 mb-3">Aucune image disponible</h3>
              <p className="text-slate-500 mb-6">Créez d'abord quelques motifs pour pouvoir les combiner</p>
              <Link href="/" className="btn btn-primary btn-lg">
                Créer des motifs
              </Link>
            </div>
          </div>
        ) : (
          <div className="main-grid">
            {/* Panneau de gauche - Galerie */}
            <div className="space-y-6">
              {/* Galerie d'images */}
              <div className="card h-fit">
                <div className="card-header">
                  <div className="card-title flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Galerie de motifs
                  </div>
                  <div className="card-description">Sélectionnez 2 à 3 images à superposer</div>
                </div>
                <div className="card-content">
                  <div className="grid grid-cols-2 gap-3">
                    {images.map((imgData, index) => (
                      <div
                        key={index}
                        className={`relative group cursor-pointer transition-all duration-300 ${
                          selectedImages.includes(imgData) ? "transform scale-105" : "hover:scale-102"
                        }`}
                        onClick={() => toggleImageSelection(imgData)}
                      >
                        <div
                          className={`card overflow-hidden ${
                            selectedImages.includes(imgData)
                              ? "border-2 border-blue-500 shadow-lg shadow-blue-500/25"
                              : "hover:border-blue-300"
                          }`}
                        >
                          <img
                            src={imgData || "/placeholder.svg"}
                            alt={`Motif ${index + 1}`}
                            className="w-full h-24 object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          {selectedImages.includes(imgData) && (
                            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg animate-fade-in">
                              {selectedImages.indexOf(imgData) + 1}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Images sélectionnées */}
              {selectedImages.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Images sélectionnées ({selectedImages.length}/3)</div>
                  </div>
                  <div className="card-content">
                    <div className="space-y-2">
                      {selectedImages.map((imgData, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-slate-800/50 rounded-lg">
                          <div className="flex-shrink-0">
                            <img
                              src={imgData || "/placeholder.svg"}
                              alt={`Sélection ${index + 1}`}
                              className="w-12 h-12 object-cover rounded border border-slate-600"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-300">Couche {index + 1}</p>
                          </div>
                          <button
                            onClick={() => removeFromSelection(imgData)}
                            className="text-red-400 hover:text-red-300 p-1 rounded"
                            title="Retirer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Panneau de droite - Paramètres et Résultat */}
            <div className="space-y-4">
              {/* Paramètres de superposition */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Paramètres de superposition
                  </div>
                  <div className="card-description">Ajustez l'intensité et créez votre superposition</div>
                </div>
                <div className="card-content space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="label">Intensité de la superposition</label>
                      <div className="badge text-sm font-mono">{Math.round(opacity * 100)}%</div>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="0.9"
                      step="0.1"
                      value={opacity}
                      onChange={(e) => setOpacity(Number.parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Subtil</span>
                      <span>Intense</span>
                    </div>
                  </div>

                  <div className="separator"></div>

                  <div className="flex gap-2">
                    <button
                      onClick={combineImages}
                      disabled={selectedImages.length < 2 || loading}
                      className="btn btn-primary flex-1"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          Création en cours...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Créer la superposition
                        </>
                      )}
                    </button>
                    <button onClick={clearSelection} className="btn btn-outline" title="Effacer tout">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {selectedImages.length < 2 && (
                    <div className="text-center p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-xs text-yellow-400">
                        Sélectionnez au moins 2 images pour créer une superposition
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Résultat de la superposition */}
              {combinedImage ? (
                <div className="card animate-fade-in">
                  <div className="card-header">
                    <div className="card-title">✨ Superposition créée</div>
                    <div className="card-description">Votre création personnalisée</div>
                  </div>
                  <div className="card-content">
                    <div className="flex justify-center mb-4">
                      <img
                        src={combinedImage || "/placeholder.svg"}
                        alt="Superposition créée"
                        className="generated-image img-responsive"
                      />
                    </div>
                    <a
                      href={combinedImage}
                      download={`superposition-${Date.now()}.png`}
                      className="btn btn-primary w-full"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger la superposition
                    </a>
                  </div>
                </div>
              ) : (
                <div className="card card-dashed">
                  <div className="card-content flex flex-col items-center justify-center py-12">
                    <ImageIcon className="h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-400 mb-2">Aperçu de la superposition</h3>
                    <p className="text-slate-500 text-center">
                      Votre création apparaîtra ici une fois les images combinées
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Superposition
