"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type UserResponse = {
  isPlus?: boolean
  plan?: string
  roles?: string[]
  [key: string]: any
}

export default function PlussBanner(){
  const router = useRouter()
  const [isPlus, setIsPlus] = useState<boolean | null>(null)

  useEffect(() => {
    const ac = new AbortController()

    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/user', { signal: ac.signal })
        console.log('Respuesta de /auth/user:', res)
        if (!res.ok) {
          setIsPlus(false)
          return
        }
        const data: UserResponse = await res.json()

        console.log('Datos del usuario:', data)
        setIsPlus(data.user.isPlus)

        // Determinar si el usuario es "plus" según varias posibles formas en la respuesta
        // if (typeof data.user.isPlus === 'boolean') {
        //   return
        // }
        // if (typeof data.plan === 'string') {
        //   setIsPlus(data.plan.toLowerCase() === 'plus')
        //   return
        // }
        // if (Array.isArray(data.roles)) {
        //   setIsPlus(data.roles.includes('plus'))
        //   return
        // }

        // // Por defecto, asumir que no es plus
        // setIsPlus(false)
      } catch (err) {
        if ((err as any).name === 'AbortError') return
        setIsPlus(false)
      }
    }

    fetchUser()
    return () => ac.abort()
  }, [])

  // Mientras carga, no renderizar nada
  if (isPlus === null) return null
  // Si ya es plus, no renderizar
  if (isPlus) return null

  const goToPayment = () => {
    router.push('/payment')
  }

  return (
    <div
      role="button"
      onClick={goToPayment}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') goToPayment() }}
      tabIndex={0}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#0ea5a4',
        color: 'white',
        padding: '12px 16px',
        borderRadius: 8,
        cursor: 'pointer',
        margin: '12px 0',
      }}
      aria-label="Obtener Pluss — ir a pago"
    >
      <div style={{ fontWeight: 600 }}>
        Activa Pluss y desbloquea funciones premium
      </div>
      <div style={{ background: 'white', color: '#0ea5a4', padding: '6px 10px', borderRadius: 6, fontWeight: 700 }}>
        Hacerme Plus
      </div>
    </div>
  )
}