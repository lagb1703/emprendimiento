"use client"

import type React from "react"
import { useState } from "react"
import { CreditCard, Lock } from "lucide-react"

interface PaymentFormProps {
  isLoading: boolean
  error: string | null
  onSuccess: () => void
  onError: (error: string) => void
  setIsLoading: (loading: boolean) => void
}

export function PaymentForm({ isLoading, error, onSuccess, onError, setIsLoading }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pse">("card")

  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    documentType: "CC",
    documentNumber: "",
    bank: "",
    address: "",
    city: "",
    postalCode: "",
  })

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
    }

    if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d{0,2})/, "$1/$2")
    }

    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4)
    }

    setCardData((prev) => ({ ...prev, [name]: formattedValue }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const paymentPayload = {
        paymentMethod,
        ...formData,
        amount: 5.95,
        planName: "Plan Premium",
        ...(paymentMethod === "card" && {
          cardNumber: cardData.cardNumber.replace(/\s/g, ""),
          cardName: cardData.cardName,
          expiryDate: cardData.expiryDate,
          cvv: cardData.cvv,
        }),
      }

      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentPayload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error en el pago")
      }

      // Redirect to payment gateway if checkout URL provided
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        onSuccess()
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al procesar el pago"
      onError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-card rounded-lg p-8 border border-border">
      <h2 className="text-2xl font-bold mb-6">Información de Pago</h2>

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <label className="font-semibold text-sm mb-3 block">Método de Pago</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`p-3 rounded-lg border-2 transition-colors ${
                paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <CreditCard className="w-5 h-5 mb-2" />
              <div className="text-sm font-medium">Tarjeta</div>
              <div className="text-xs text-foreground/60">Visa, Mastercard</div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("pse")}
              className={`p-3 rounded-lg border-2 transition-colors ${
                paymentMethod === "pse" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <Lock className="w-5 h-5 mb-2" />
              <div className="text-sm font-medium">PSE</div>
              <div className="text-xs text-foreground/60">Débito bancario</div>
            </button>
          </div>
        </div>

        {/* Card Payment Form */}
        {paymentMethod === "card" && (
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4">Detalles de la Tarjeta</h3>

            <div className="mb-4">
              <label className="font-semibold text-sm mb-2 block">Número de Tarjeta</label>
              <input
                type="text"
                name="cardNumber"
                value={cardData.cardNumber}
                onChange={handleCardInputChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              />
            </div>

            <div className="mb-4">
              <label className="font-semibold text-sm mb-2 block">Nombre en la Tarjeta</label>
              <input
                type="text"
                name="cardName"
                value={cardData.cardName}
                onChange={handleCardInputChange}
                placeholder="JUAN PEREZ"
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="font-semibold text-sm mb-2 block">Vencimiento</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={cardData.expiryDate}
                  onChange={handleCardInputChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-sm mb-2 block">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={cardData.cvv}
                  onChange={handleCardInputChange}
                  placeholder="123"
                  maxLength="4"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Payer Information */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-lg mb-4">Información del Pagador</h3>

          <div className="mb-4">
            <label className="font-semibold text-sm mb-2 block">Nombre</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Nombres y Apellidos"
              required
              className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="font-semibold text-sm mb-2 block">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="tu@email.com"
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="font-semibold text-sm mb-2 block">Teléfono</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+57 3XX XXXX XXX"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Document Info */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="font-semibold text-sm mb-2 block">Tipo de Documento</label>
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="NIT">NIT</option>
                <option value="PP">Pasaporte</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-sm mb-2 block">Número de Documento</label>
              <input
                type="text"
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleInputChange}
                placeholder="1234567890"
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Bank Selection for PSE */}
          {paymentMethod === "pse" && (
            <div className="mb-4">
              <label className="font-semibold text-sm mb-2 block">Selecciona tu Banco</label>
              <select
                name="bank"
                value={formData.bank}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecciona un banco</option>
                <option value="001">Banco de Colombia</option>
                <option value="002">Banco de Occidente</option>
                <option value="006">Banco Santander</option>
                <option value="009">Citibank</option>
                <option value="010">Davivienda</option>
                <option value="012">Banco Bogotá</option>
                <option value="019">BBVA Colombia</option>
              </select>
            </div>
          )}

          {/* Address Information */}
          <div className="mb-4">
            <label className="font-semibold text-sm mb-2 block">Dirección</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Calle Principal 123"
              className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-sm mb-2 block">Ciudad</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Bogotá"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="font-semibold text-sm mb-2 block">Código Postal</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="12345"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            required
            className="w-4 h-4 mt-1 rounded border-border accent-primary cursor-pointer"
          />
          <label htmlFor="terms" className="text-sm text-foreground/70">
            Acepto los términos y condiciones
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              Procesando...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Pagar ${paymentMethod === "pse" ? "5.95" : "5.95"}/mes
            </>
          )}
        </button>

        <p className="text-xs text-center text-foreground/50">
          Tus datos serán protegidos con encriptación SSL de 256 bits
        </p>
      </form>
    </div>
  )
}
