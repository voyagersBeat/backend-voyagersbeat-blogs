const tripOptions = [
  {
    id: 0,
    text: "Winter Trip",
    followUp: "Experience the serene beauty of snowy mountains.",
  },
  {
    id: 1,
    text: "Spiti Trip",
    followUp: "Explore the breathtaking landscapes of Spiti Valley.",
  },
  {
    id: 2,
    text: "Adventure Trip",
    followUp: "Embark on an adventure-filled journey.",
  },
];

const getOptions = () => ({
  message: "Please choose one of the following trips:",
  options: tripOptions.map((option) => ({ id: option.id, text: option.text })),
});

const getAnswer = (choice, session) => {
  if (!session.step) {
    session.step = 1; // Initialize step
  }

  console.log("Before processing choice:", { step: session.step, choice });

  if (session.step === 1) {
    const selectedOption = tripOptions.find((opt) => opt.id === choice);
    if (selectedOption) {
      session.step = 2; // Move to the next step
      return {
        messages: [
          { content: selectedOption.followUp }, // First message
          { content: "Would you like to join our next trip?" }, // Second message
        ],
        options: [
          { id: 0, text: "Yes" },
          { id: 1, text: "No" },
        ],
      };
    } else {
      return {
        message: "Invalid choice. Please select a valid option.",
        options: getOptions().options,
      };
    }
  } else if (session.step === 2) {
    if (choice === 0) {
      session.step = 0; // Reset step after the "Yes" response
      return {
        message:
          "Great! You can contact us at +91-123-456-7890 for more details.",
      };
    } else if (choice === 1) {
      session.step = 0; // Reset step after the "No" response
      return {
        message: "Doesn't matter, nice to meet you!",
      };
    } else {
      return {
        message: "Invalid choice. Please select Yes or No.",
        options: [
          { id: 0, text: "Yes" },
          { id: 1, text: "No" },
        ],
      };
    }
  }

  console.log("After processing choice:", { step: session.step, choice });

  return { message: "I'm sorry, I don't understand. Please try again." };
};

module.exports = { getOptions, getAnswer };
