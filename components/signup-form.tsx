"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ArrowLeft, AlertCircle, Loader2, Upload, Calendar } from "lucide-react"

interface SignupFormData {
  // Stage 1: Personal Info
  fullName: string
  birthDate: string
  // Stage 2: Credentials
  email: string
  username: string
  // Stage 3: Professional
  title: string
  pdfFile: File | null
}

interface FormErrors {
  [key: string]: string
}

export function SignupForm() {
  const router = useRouter()
  const [currentStage, setCurrentStage] = useState(1)
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: "",
    birthDate: "",
    email: "",
    username: "",
    title: "",
    pdfFile: null,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const validateStage = (stage: number): boolean => {
    const newErrors: FormErrors = {}

    if (stage === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "El nombre completo es requerido"
      }
      if (!formData.birthDate) {
        newErrors.birthDate = "La fecha de nacimiento es requerida"
      } else {
        const birthDate = new Date(formData.birthDate)
        const today = new Date()
        if (birthDate >= today) {
          newErrors.birthDate = "La fecha de nacimiento debe ser en el pasado"
        }
      }
    } else if (stage === 2) {
      if (!formData.email.trim()) {
        newErrors.email = "El correo electrónico es requerido"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Por favor ingresa un correo válido"
      }

      if (!formData.username.trim()) {
        newErrors.username = "El nombre de usuario es requerido"
      } else if (formData.username.length < 3) {
        newErrors.username = "El nombre de usuario debe tener al menos 3 caracteres"
      } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
        newErrors.username = "El nombre de usuario solo puede contener letras, números, guiones y guiones bajos"
      }
    } else if (stage === 3) {
      if (!formData.title.trim()) {
        newErrors.title = "El título/grado es requerido"
      }
      if (!formData.pdfFile) {
        newErrors.pdfFile = "Debes cargar un documento PDF"
      } else if (formData.pdfFile.type !== "application/pdf") {
        newErrors.pdfFile = "El archivo debe ser un PDF"
      } else if (formData.pdfFile.size > 5 * 1024 * 1024) {
        // 5MB limit
        newErrors.pdfFile = "El archivo no debe superar 5MB"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({
      ...prev,
      pdfFile: file,
    }))
    if (errors.pdfFile) {
      setErrors((prev) => ({
        ...prev,
        pdfFile: undefined,
      }))
    }
  }

  const handleNext = () => {
    if (validateStage(currentStage)) {
      setCurrentStage(currentStage + 1)
    }
  }

  const handleBack = () => {
    setCurrentStage(currentStage - 1)
    setErrors({})
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateStage(3)) {
      return
    }

    setIsLoading(true)
    setErrors({})
    setSuccessMessage("")

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("fullName", formData.fullName)
      formDataToSend.append("birthDate", formData.birthDate)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("username", formData.username)
      formDataToSend.append("title", formData.title)
      if (formData.pdfFile) {
        formDataToSend.append("pdfFile", formData.pdfFile)
      }

      const response = await fetch("/api/signup", {
        method: "POST",
        body: formDataToSend,
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({
          general: data.message || "Error al registrarse. Por favor intenta de nuevo.",
        })
        return
      }

      setSuccessMessage("¡Registro completado exitosamente!")

      // Store token if provided
      if (data.token) {
        localStorage.setItem("authToken", data.token)
      }

      // Redirect to home after short delay
      setTimeout(() => {
        router.push("/home")
      }, 1500)
    } catch (error) {
      setErrors({
        general: "Error de conexión. Por favor intenta de nuevo.",
      })
      console.error("[v0] Signup error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="border-2 border-dashed border-accent rounded-lg p-8 bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Stage Title */}
          {currentStage === 1 && (
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-foreground mb-2">Nuevo Doctor</h2>
              <p className="text-sm text-muted-foreground">
                Bienvenida a Good Health, antes de iniciar, necesitas rellenar algunos datos.
              </p>
            </div>
          )}
          {currentStage === 2 && (
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-foreground">Credenciales</h2>
            </div>
          )}
          {currentStage === 3 && (
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-foreground">Información Profesional</h2>
            </div>
          )}

          {/* Stage 1: Personal Information */}
          {currentStage === 1 && (
            <>
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Nombres y Apellidos"
                  value={formData.fullName}
                  onChange={handleTextChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground placeholder-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {errors.fullName && (
                  <div className="flex items-center gap-2 text-sm text-destructive mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.fullName}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="birthDate" className="block text-sm font-medium text-foreground">
                  Fecha nacimiento
                </label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleTextChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 pr-10 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground placeholder-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                {errors.birthDate && (
                  <div className="flex items-center gap-2 text-sm text-destructive mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.birthDate}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Stage 2: Credentials */}
          {currentStage === 2 && (
            <>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email de contacto"
                  value={formData.email}
                  onChange={handleTextChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground placeholder-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {errors.email && (
                  <div className="flex items-center gap-2 text-sm text-destructive mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-foreground">
                  nombre de usuario
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Único para la aplicación"
                  value={formData.username}
                  onChange={handleTextChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground placeholder-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {errors.username && (
                  <div className="flex items-center gap-2 text-sm text-destructive mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.username}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Stage 3: Professional Information */}
          {currentStage === 3 && (
            <>
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-foreground">
                  Título
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Debe incluir Grado"
                  value={formData.title}
                  onChange={handleTextChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground placeholder-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {errors.title && (
                  <div className="flex items-center gap-2 text-sm text-destructive mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.title}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="pdfFile" className="block text-sm font-medium text-foreground">
                  Documentos que lo habalen
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="pdfFile"
                    name="pdfFile"
                    accept=".pdf"
                    onChange={handleFileChange}
                    disabled={isLoading}
                    className="hidden"
                  />
                  <label
                    htmlFor="pdfFile"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-accent rounded-lg cursor-pointer hover:bg-accent/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Upload className="w-5 h-5 text-accent" />
                    <span className="text-sm text-foreground font-medium">
                      {formData.pdfFile ? formData.pdfFile.name : "Choose File .pdf"}
                    </span>
                  </label>
                </div>
                {errors.pdfFile && (
                  <div className="flex items-center gap-2 text-sm text-destructive mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.pdfFile}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* General Error Message */}
          {errors.general && (
            <div className="flex items-start gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{errors.general}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="flex items-start gap-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <p className="text-sm text-accent font-medium">{successMessage}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            {currentStage > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={isLoading}
                className="flex-1 py-3 px-4 border-2 border-accent text-accent font-semibold rounded-lg hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Atrás</span>
              </button>
            )}

            {currentStage < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={isLoading}
                className="flex-1 py-3 px-4 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <span>Adelante</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creando...</span>
                  </>
                ) : (
                  <span>Crear</span>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
