import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

interface PaymentRequest {
  paymentMethod: "card" | "pse"
  fullName: string
  email: string
  phone: string
  documentType: string
  documentNumber: string
  bank?: string
  address: string
  city: string
  postalCode: string
  amount: number
  planName: string
  cardNumber?: string
  cardName?: string
  expiryDate?: string
  cvv?: string
}

function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, "")
  // Luhn algorithm validation
  let sum = 0
  let isEven = false
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(cleaned[i], 10)
    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    isEven = !isEven
  }
  return sum % 10 === 0
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PaymentRequest

    if (body.paymentMethod === "card") {
      if (!body.cardNumber || !body.cardName || !body.expiryDate || !body.cvv) {
        return NextResponse.json({ error: "Datos de tarjeta incompletos" }, { status: 400 })
      }

      if (!validateCardNumber(body.cardNumber)) {
        return NextResponse.json({ error: "Número de tarjeta inválido" }, { status: 400 })
      }

      // Validate expiry date format
      const [month, year] = body.expiryDate.split("/")
      const now = new Date()
      const currentYear = now.getFullYear() % 100
      const currentMonth = now.getMonth() + 1

      if (
        !month ||
        !year ||
        Number.parseInt(year, 10) < currentYear ||
        (Number.parseInt(year, 10) === currentYear && Number.parseInt(month, 10) < currentMonth)
      ) {
        return NextResponse.json({ error: "Tarjeta expirada o fecha inválida" }, { status: 400 })
      }

      if (Number.parseInt(month, 10) < 1 || Number.parseInt(month, 10) > 12) {
        return NextResponse.json({ error: "Mes de vencimiento inválido" }, { status: 400 })
      }
    }

    const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

    // TODO: Get actual user_id from session/auth
    const userId = "temporary-user-id"

    // Store payment record in database
    const result = await sql(
      `INSERT INTO payments (
        user_id, plan_name, amount, currency, status, payment_method,
        payer_name, payer_email, payer_phone, payer_document_type,
        payer_document_number, payer_address, payer_city, payer_postal_code
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      ) RETURNING id`,
      [
        userId,
        body.planName,
        body.amount,
        "COP",
        "pending",
        body.paymentMethod,
        body.fullName,
        body.email,
        body.phone,
        body.documentType,
        body.documentNumber,
        body.address,
        body.city,
        body.postalCode,
      ],
    )

    const paymentId = result[0]?.id

    if (body.paymentMethod === "card") {
      try {
        const wompy_response = await fetch("https://api.wompy.com/v1/transactions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.WOMPY_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reference: paymentId,
            amount_in_cents: Math.round(body.amount * 100),
            currency: "COP",
            customer: {
              phone_number: body.phone,
              full_name: body.fullName,
              legal_id: body.documentNumber,
              legal_id_type: body.documentType,
              email: body.email,
            },
            payment_method: {
              type: "CARD",
              card: {
                number: body.cardNumber?.replace(/\s/g, ""),
                name: body.cardName,
                exp_month: body.expiryDate?.split("/")[0],
                exp_year: body.expiryDate?.split("/")[1],
                cvc: body.cvv,
              },
            },
            shipping_address: {
              address_line_1: body.address,
              country: "CO",
              region: body.city,
              postal_code: body.postalCode,
            },
            redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?paymentId=${paymentId}`,
            webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`,
          }),
        })

        const wompy_data = await wompy_response.json()

        if (wompy_response.ok && wompy_data.data?.id) {
          // Update payment with Wompy reference
          await sql("UPDATE payments SET wompy_reference = $1, status = $2 WHERE id = $3", [
            wompy_data.data.id,
            "processing",
            paymentId,
          ])

          return NextResponse.json({
            success: true,
            paymentId,
            wompy_reference: wompy_data.data.id,
            checkoutUrl: wompy_data.data.checkout_url,
          })
        } else {
          throw new Error(wompy_data.error?.message || "Error en Wompy API")
        }
      } catch (wompy_error) {
        console.error("Wompy API error:", wompy_error)
        // Still return payment created, but mark as failed
        await sql("UPDATE payments SET status = $1 WHERE id = $2", ["failed", paymentId])
        return NextResponse.json(
          { error: "Error al procesar la tarjeta. Por favor intenta de nuevo." },
          { status: 500 },
        )
      }
    }

    if (body.paymentMethod === "pse") {
      try {
        const wompy_response = await fetch("https://api.wompy.com/v1/transactions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.WOMPY_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reference: paymentId,
            amount_in_cents: Math.round(body.amount * 100),
            currency: "COP",
            customer: {
              phone_number: body.phone,
              full_name: body.fullName,
              legal_id: body.documentNumber,
              legal_id_type: body.documentType,
              email: body.email,
            },
            payment_method: {
              type: "PSE",
              bank_code: body.bank,
            },
            shipping_address: {
              address_line_1: body.address,
              country: "CO",
              region: body.city,
              postal_code: body.postalCode,
            },
            redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?paymentId=${paymentId}`,
            webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`,
          }),
        })

        const wompy_data = await wompy_response.json()

        if (wompy_response.ok && wompy_data.data?.id) {
          await sql("UPDATE payments SET wompy_reference = $1, status = $2 WHERE id = $3", [
            wompy_data.data.id,
            "processing",
            paymentId,
          ])

          return NextResponse.json({
            success: true,
            paymentId,
            wompy_reference: wompy_data.data.id,
            checkoutUrl: wompy_data.data.checkout_url,
          })
        } else {
          throw new Error(wompy_data.error?.message || "Error en Wompy API")
        }
      } catch (pse_error) {
        console.error("PSE payment error:", pse_error)
        await sql("UPDATE payments SET status = $1 WHERE id = $2", ["failed", paymentId])
        return NextResponse.json(
          { error: "Error al procesar el pago PSE. Por favor intenta de nuevo." },
          { status: 500 },
        )
      }
    }

    return NextResponse.json({
      success: true,
      paymentId,
      message: "Payment initialized",
    })
  } catch (error) {
    console.error("Payment creation error:", error)
    return NextResponse.json({ error: "Error al procesar el pago" }, { status: 500 })
  }
}
