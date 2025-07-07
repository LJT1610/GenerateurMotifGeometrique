"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

const Bibliotheque = () => {
  const [images, setImages] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem("generatedImages") || "[]")
    setImages(storedImages)
  }, [])

  const clearLibrary = () => {
    localStorage.removeItem("generatedImages")
    setImages([])
  }

  const openModal = (imgData: string) => {
    setSelectedImage(imgData)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  // Fermer le modal avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal()
      }
    }

    if (selectedImage) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [selectedImage])

  return (
    <div className="min-h-screen bg-gradient p-4">
      <div className="container container-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Bibliothèque d'images</h1>
          <div className="flex gap-3">
            {images.length > 0 && (
              <button onClick={clearLibrary} className="btn btn-outline">
                Vider la bibliothèque
              </button>
            )}
            <Link href="/" className="nav-link">
              Retour à l'accueil
            </Link>
          </div>
        </div>

        {images.length === 0 ? (
          <div className="card">
            <div className="card-content text-center py-8">
              <div className="text-slate-400 text-4xl mb-3">📸</div>
              <p className="text-slate-500 mb-4">Aucune image dans la bibliothèque</p>
              <Link href="/" className="btn btn-primary">
                Créer votre premier motif
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="library-grid">
              {images.map((imgData, index) => (
                <div key={index} className="card library-item" onClick={() => openModal(imgData)}>
                  <div className="relative overflow-hidden">
                    <img
                      src={imgData || "/placeholder.svg"}
                      alt={`Motif ${index + 1}`}
                      className="w-full h-32 object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-2 text-white">
                        <p className="text-xs font-medium">Motif #{index + 1}</p>
                      </div>
                    </div>
                  </div>
                  <div className="card-content p-2">
                    <a
                      href={imgData}
                      download={`motif-${index + 1}.png`}
                      className="btn btn-primary w-full text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Télécharger
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <p className="text-slate-500 text-sm">
                {images.length} motif{images.length > 1 ? "s" : ""} dans votre bibliothèque
              </p>
            </div>
          </>
        )}

        {/* Modal d'agrandissement */}
        {selectedImage && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
              <img src={selectedImage || "/placeholder.svg"} alt="Motif agrandi" className="modal-image" />
              <div className="p-4 bg-gradient-to-t from-black/20 to-transparent">
                <a href={selectedImage} download="motif-agrandi.png" className="btn btn-primary">
                  Télécharger en haute qualité
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Bibliotheque
  