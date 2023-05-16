const SuggestedMessages = ({ onSuggestionClick }) => {
  const suggestions = [
    "How do I add a new parent to the system?",
    "How can I send a welcome email to a parent?",
    "How can I view the message history between the school and a parent?",
  ];

  return (
    <div className="suggested-messages">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className="suggestion"
          onClick={() => onSuggestionClick(suggestion)}
        >
          <p>{suggestion}</p>
        </button>
      ))}
    </div>
  );
};

export default SuggestedMessages;
