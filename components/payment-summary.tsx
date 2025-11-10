"use client"

import { Check } from "lucide-react"

const PLAN_DETAILS = {
  name: "Plan Premium",
  description: "Acceso completo a profesionales y herramientas avanzadas",
  price: 5.0,
  tax: 0.95,
  features: [
    "Chat ilimitado con la especializada",
    "Descargas limitadas en psicologos",
    "Videoconsultas con profesionales",
    "Planes de tratamiento personalizados",
    "Seguimiento de progreso detallado",
  ],
}

export function PaymentSummary() {
  const total = PLAN_DETAILS.price + PLAN_DETAILS.tax

  return (
    <div className="bg-card rounded-lg p-8 border border-border">
      <h2 className="text-2xl font-bold mb-6">Resumen del Pedido</h2>

      {/* Plan Card */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg">{PLAN_DETAILS.name}</h3>
            <p className="text-sm text-foreground/60">{PLAN_DETAILS.description}</p>
          </div>
          <span className="bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">Más Popular</span>
        </div>

        {/* Features */}
        <ul className="space-y-2 mb-6">
          {PLAN_DETAILS.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-foreground/70">
              <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pricing Breakdown */}
      <div className="bg-muted/30 rounded p-4 space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-foreground/70">Subtotal</span>
          <span className="font-medium">${PLAN_DETAILS.price.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground/70">Impuestos</span>
          <span className="font-medium">${PLAN_DETAILS.tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-border pt-2 flex justify-between font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}/mes</span>
        </div>
      </div>

      {/* Guarantee */}
      <p className="text-xs text-foreground/50 text-center">
        Garantía de 30 días. Si no estás completamente satisfecho, te reembolsaremos el 100% de tu dinero.
      </p>
    </div>
  )
}
