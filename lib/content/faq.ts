export const faqContent = {
  hero: {
    title: "Preguntas frecuentes",
    description: "Resolvemos las dudas más comunes sobre cómo GoodHealth potencia la práctica psicológica con inteligencia artificial.",
  },

  categories: [
    {
      title: "Sobre la Plataforma",
      questions: [
        {
          question: "¿GoodHealth reemplaza al psicólogo?",
          answer: "No. GoodHealth es un asistente clínico de IA que acompaña el análisis, no toma decisiones por el profesional."
        },
        {
          question: "¿Cómo funciona el análisis en tiempo real?",
          answer: "La IA analiza el lenguaje, el tono emocional y patrones del paciente durante la sesión, generando insights y resúmenes automáticos."
        },
        {
          question: "¿Puedo usar GoodHealth si trabajo como independiente?",
          answer: "Sí. El Plan Profesional está pensado específicamente para psicólogos independientes."
        },
        {
          question: "¿Qué diferencia a GoodHealth de otras plataformas?",
          answer: "Somos la única plataforma colombiana con IA en tiempo real, análisis emocional contextual, soporte en español y precios locales."
        }
      ]
    },
    {
      title: "Seguridad y Privacidad",
      questions: [
        {
          question: "¿La información de mis pacientes es segura?",
          answer: "Sí. Usamos cifrado extremo a extremo, controles de acceso y prácticas alineadas con estándares internacionales."
        },
        {
          question: "¿La IA puede equivocarse?",
          answer: "Sí, como toda herramienta tecnológica. Por eso GoodHealth nunca toma decisiones clínicas; solo ofrece apoyo analítico."
        }
      ]
    },
    {
      title: "Soporte y Disponibilidad",
      questions: [
        {
          question: "¿Puedo probar la plataforma antes de pagar?",
          answer: "Sí. Contamos con un plan Freemium que permite conocer las funciones básicas."
        },
        {
          question: "¿Ofrecen soporte y acompañamiento?",
          answer: "Sí. Brindamos soporte en español, capacitación inicial y acompañamiento para clínicas e instituciones."
        }
      ]
    }
  ],

  support: {
    title: "Still have questions?",
    description: "Can't find the answer you're looking for? Our support team is here to help.",
    buttons: [
      {
        text: "Contact Support",
        type: "primary",
        href: "#contact-support"
      },
      {
        text: "Submit a Ticket", 
        type: "secondary",
        href: "#submit-ticket"
      }
    ]
  }
} as const