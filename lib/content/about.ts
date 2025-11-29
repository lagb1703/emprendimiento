export const aboutContent = {
  hero: {
    title: "Nosotros",
    description: "GoodHealth, una plataforma web de apoyo clínico impulsada por inteligencia artificial que acompaña al psicólogo en tiempo real.",
  },

  mission: {
    title: "Nuestra Misión",
    description: [
      "Convertirnos en la plataforma líder de apoyo clínico mediante inteligencia artificial en Latinoamérica, potenciando la práctica psicológica con herramientas que permitan ofrecer una atención más humana, precisa y accesible para todos. Queremos ser el puente entre tecnología avanzada y bienestar emocional, transformando la salud mental con innovación ética y empática."
    ],
  },

  vision: {
    title: "Nuestra Visión", 
    description: [
      "Desarrollar soluciones tecnológicas inteligentes que fortalezcan el trabajo de los psicólogos, optimicen sus procesos clínicos y mejoren la calidad de vida de pacientes y profesionales. Nuestro propósito es integrar ciencia, IA y experiencia terapéutica para brindar análisis en tiempo real, información basada en evidencia y herramientas que faciliten una práctica más eficiente, profunda y centrada en la persona."
    ],
  },

  values: {
    title: "Valores corporativos",
    cards: [
      {
        title: "Empatía",
        description: "Colocamos al ser humano en el centro. La tecnología existe para apoyar al psicólogo y mejorar el bienestar de sus pacientes."
      },
      {
        title: "Ética y responsabilidad", 
        description: "Desarrollamos IA segura y transparente, protegemos la confidencialidad de la información y cumplimos estándares de privacidad rigurosos."
      },
      {
        title: "Humanización",
        description: "La IA no reemplaza al terapeuta; lo acompaña. Nuestro propósito es amplificar su impacto, no automatizar su rol."
      },
      {
        title: "Accesibilidad",
        description: "Tecnología de alto valor clínico, disponible en español y con precios justos para profesionales e instituciones de la región."
      }
    ],
  },

  team: {
    title: "Nuestro Equipo",
    description: [
      "GoodHealth está construido por un equipo con experiencia en estrategia, arquitectura de software e inteligencia artificial:"
    ],
    members: [
      {
        name: "Juan Camilo Galvis Agudelo",
        role: "Director General y Estrategia",
        description: "Responsable de la visión del producto, el crecimiento de la empresa y la articulación con el sector clínico.",
        image: "/fotoGalvis.png"
      },
      {
        name: "Luis Alejandro Giraldo  Bolaños",
        role: "Líder de Desarrollo y Arquitectura de Software", 
        description: "Encargado de la construcción técnica de la plataforma, escalabilidad, seguridad y experiencia de usuario.",
        image: "/fotoLuis.png"
      },
      {
        name: "Stiven Castro Soto",
        role: "Especialista en Inteligencia Artificial",
        description: "Diseña los modelos de IA que permiten el análisis emocional, lingüístico y contextual dentro de las sesiones.", 
        image: "/fotoStiven.png"
      }
    ]
  }
} as const