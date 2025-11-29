"use client"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"
import { PaymentSummary } from "@/components/payment-summary"
import { PaymentForm } from "@/components/payment-form"
import { useRouter } from 'next/navigation'

export default function PaymentPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader showUserMenu />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {success ? (
            <div className="bg-accent/10 border border-accent rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-accent mb-2">¡Pago Exitoso!</h2>
              <p className="text-foreground/70">Tu suscripción ha sido activada correctamente.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Order Summary */}
              <PaymentSummary />

              {/* Right Column - Payment Form */}
              <PaymentForm
                isLoading={isLoading}
                error={error}
                onSuccess={() => { 
                  setSuccess(true);
                  setTimeout(() => { router.push('/chats') }, 3000);
                }}
                onError={setError}
                setIsLoading={setIsLoading}
              />
            </div>
          )}
        </div>
      </main>

      <AppFooter />
    </div>
  )
}
