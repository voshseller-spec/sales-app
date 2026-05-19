// Hand-authored products. Each has a sell sheet shown to the player and a
// buyer persona used to build the AI buyer's system prompt.
export const products = [
  {
    id: "brewbright",
    name: "BrewBright Office Coffee Subscription",
    tagline: "Freshly roasted beans delivered to the office every two weeks.",
    price: "$89 / month",
    sellingPoints: [
      "Roasted-to-order beans, shipped within 48 hours of roasting.",
      "Flexible plan — pause, skip, or cancel any time, no contract.",
      "Includes free loaner grinder and a 30-day money-back guarantee.",
      "Saves a typical 20-person office ~$60/month vs. coffee-shop runs."
    ],
    buyer: {
      name: "Dana Whitfield",
      role: "Office Manager at a 25-person design studio",
      persona:
        "You already buy cheap pre-ground coffee from a wholesale store and think it is 'fine.' You are budget-conscious and suspicious of subscriptions because the last one was a pain to cancel. You can be won over by a clear cost comparison and the no-contract flexibility."
    }
  },
  {
    id: "shiftpilot",
    name: "ShiftPilot Staff Scheduling App",
    tagline: "Drag-and-drop scheduling that cuts no-shows and overtime.",
    price: "$4 per employee / month",
    sellingPoints: [
      "Auto-fills shifts based on availability and labor-law rules.",
      "Employees swap shifts in-app — managers just approve.",
      "Reduces overtime spend by ~12% on average in the first quarter.",
      "Free 14-day trial, imports your current spreadsheet in minutes."
    ],
    buyer: {
      name: "Marcus Reyes",
      role: "Owner of three busy coffee shops",
      persona:
        "You currently schedule staff with a shared spreadsheet and feel it works 'well enough.' You are short on time, skeptical of paying per-employee, and worried your staff won't adopt a new app. You respond well to concrete time savings and the free trial."
    }
  },
  {
    id: "ledgerlens",
    name: "LedgerLens Expense Tracking",
    tagline: "Snap a receipt, and expenses categorize themselves.",
    price: "$15 / month for small teams",
    sellingPoints: [
      "Photo receipts are read and categorized automatically.",
      "Syncs with major accounting software in one click.",
      "Flags duplicate and out-of-policy expenses before they post.",
      "Most customers save 5+ hours per month on expense admin."
    ],
    buyer: {
      name: "Priya Anand",
      role: "Founder of a 10-person marketing agency",
      persona:
        "You handle expenses yourself with a shoebox of receipts and a spreadsheet. You are privacy-conscious about financial data and have been burned by software that promised easy accounting-software sync and failed. You can be convinced by reassurance on data security and the time savings."
    }
  }
];
