export const homeContent = {
  hero: {
    // Define in your HeroSection component
  },

  problem: {
    badge: "¿Quiénes somos, pa donde vamos, por que es luis gay?",
    title: "El problema",
    description: [
      "En Latinoamérica, 1 de cada 4 personas sufre ansiedad o depresión, pero 8 de cada 10 no reciben tratamiento. Mientras la demanda de atención psicológica crece, los profesionales enfrentan otro desafío: la sobrecarga de información.",
      "En Colombia, más de 120,000 psicólogos activos buscan herramientas modernas que realmente apoyen su labor clínica. Pero, aunque existen plataformas para agendar sesiones o hacer videollamadas, ninguna analiza lo que sucede dentro de la sesión."
    ],
    link: {
      text: "Conocer más →",
      href: "/about",
    },
    image: {
      src: "/placeholder.svg?height=400&width=600",
      alt: "Mental health illustration",
    },
  },

  services: {
    badge: "Nuestros servicios",
    title: "GoodHealth, una plataforma web de apoyo clínico impulsada por inteligencia artificial que acompaña al psicólogo en tiempo real.",
    cards: [
      {
        icon: "Bot",
        title: "Asistente de IA en tiempo real",
        description: "Análisis instantáneo de lenguaje, emociones y patrones clínicos durante las sesiones.",
        featured: false,
      },
      {
        icon: "Users",
        title: "Recomendaciones basadas en evidencia",
        description: "Sugerencias clínicas fundamentadas en literatura científica y métodos terapéuticos reconocidos.",
        featured: true,
      },
      {
        icon: "Wrench",
        title: "Resúmenes automáticos y notas clínicas inteligentes",
        description: "Redacción automatizada de notas, con estructura profesional y adaptada al estilo del terapeuta.",
        featured: false,
      },
      {
        icon: "Languages",
        title: "Flujo de trabajo integrado",
        description: "Compatible con prácticas independientes, clínicas y centros educativos.",
        featured: false,
      },
    ],
  },

  stats: {
    cards: [
      {
        icon: "Smile",
        title: "Happy Patients",
        value: "30,00,000+",
        subtitle: "Satisfied customers worldwide",
      },
      {
        icon: "Stethoscope",
        title: "Experienced Doctors",
        value: "409+",
        subtitle: "Professional healthcare providers",
      },
      {
        icon: "Calendar",
        title: "Years of Experience",
        value: "18+",
        subtitle: "Trusted healthcare service",
      },
    ],
  },

  solution: {
    badge: "Our Solution",
    title: "La solución",
    description: [
      "Aquí nace GoodHealth, una plataforma web de apoyo clínico impulsada por inteligencia artificial que acompaña al psicólogo en tiempo real. Nuestro agente de IA actúa como un asistente terapéutico inteligente, capaz de:",
      "• Analizar el lenguaje y tono emocional del paciente",
      "• Detectar patrones de comportamiento", 
      "• Generar insights clínicos basados en evidencia",
      "• Crear resúmenes automáticos al finalizar cada sesión",
      "• Optimizar la toma de decisiones del profesional",
      "GoodHealth no reemplaza al terapeuta: lo potencia. Se convierte en un aliado clínico que hace cada encuentro más profundo, preciso y humano."
    ],
    link: {
      text: "Conocer más  →",
      href: "/faq",
    },
    image: {
      src: "/placeholder.svg?height=400&width=600",
      alt: "Mental health support",
    },
  },
} as const
