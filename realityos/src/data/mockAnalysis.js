export const mockAnalysis = {
  object: {
    name: "Electricity Bill",
    type: "Utility document",
    confidence: 97,
  },

  score: 94,

  summary:
    "This is an electricity bill containing an outstanding amount, a payment deadline, and account information. The due date is approaching and a reminder is recommended.",

  insights: [
    {
      id: 1,
      label: "Amount Due",
      value: "₹2,480",
      type: "currency",
      confidence: 98,
      verified: true,
      evidence: "Total amount payable: ₹2,480",
    },
    {
      id: 2,
      label: "Due Date",
      value: "31 Aug 2026",
      type: "date",
      confidence: 99,
      verified: true,
      evidence: "Due date: 31/08/2026",
    },
    {
      id: 3,
      label: "Provider",
      value: "City Power",
      type: "text",
      confidence: 93,
      verified: true,
      evidence: "City Power Electricity Services",
    },
    {
      id: 4,
      label: "Account",
      value: "AC-204891",
      type: "text",
      confidence: 82,
      verified: false,
      evidence: "Consumer No: AC-204891",
    },
  ],

  warnings: [
    {
      title: "Payment approaching",
      description:
        "The bill is due within the next few days. Consider creating a reminder.",
      severity: "medium",
    },
  ],

  objects: [
    {
      id: 1,
      name: "Electricity bill",
      confidence: 97,
    },
    {
      id: 2,
      name: "Payment amount",
      confidence: 98,
    },
    {
      id: 3,
      name: "Due date",
      confidence: 99,
    },
  ],

  suggestedActions: [
    {
      id: "reminder",
      title: "Set payment reminder",
      description: "Remind me before the bill is due",
      priority: "HIGH",
    },
    {
      id: "task",
      title: "Create payment task",
      description: "Add this bill to my tasks",
      priority: "MEDIUM",
    },
    {
      id: "navigate",
      title: "Find payment center",
      description: "Find nearby places to pay",
      priority: "LOW",
    },
  ],
};