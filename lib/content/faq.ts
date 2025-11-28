export const faqContent = {
  hero: {
    title: "Frequently Asked Questions",
    description: "Find answers to the most common questions about GoodHealth",
  },

  categories: [
    {
      title: "General Questions",
      questions: [
        {
          question: "What is GoodHealth?",
          answer: "GoodHealth is an AI-powered healthcare platform that provides intelligent health consultations, personalized care recommendations, and seamless communication between patients and healthcare providers."
        },
        {
          question: "How does the AI chat system work?",
          answer: "Our AI chat system uses advanced natural language processing to understand your health concerns and provide relevant information. It can help with symptom assessment, health education, and connecting you with appropriate healthcare resources."
        },
        {
          question: "Is my health data secure?",
          answer: "Yes, we take data security very seriously. All health information is encrypted and stored securely according to healthcare data protection standards. We never share your personal health information without your explicit consent."
        }
      ]
    },
    {
      title: "Account & Billing",
      questions: [
        {
          question: "How do I create an account?",
          answer: "You can create an account by clicking the \"Registrarse\" button in the header and filling out the registration form with your basic information. You'll receive a verification email to activate your account."
        },
        {
          question: "What are the pricing plans?",
          answer: "We offer flexible pricing plans to suit different needs. Please visit our pricing page or contact our support team for detailed information about our current plans and features."
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer: "Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period."
        }
      ]
    },
    {
      title: "Technical Support",
      questions: [
        {
          question: "What browsers are supported?",
          answer: "GoodHealth works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated to the latest version for optimal performance."
        },
        {
          question: "Is there a mobile app available?",
          answer: "Currently, GoodHealth is available as a web application that works seamlessly on mobile browsers. We are working on dedicated mobile apps for iOS and Android, which will be available soon."
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