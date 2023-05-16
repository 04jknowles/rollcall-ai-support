import React, { useState, useRef, Fragment } from "react";
import { useEffect } from "react";
import MessageLoader from "./MessageLoader"; // Importing MessageLoader component

import "./Chat.css"; // Importing CSS for chat
import myImage from "./rollcallscreen.png"; // Importing static image

import SuggestedMessages from "./SuggestedMessages"; // Importing SuggestedMessages component
import { FaBars, FaTimes } from "react-icons/fa"; // Importing icons
import SendTicketButton from "./SendTicketButton";

// Main Home component
function Home() {
  // These are the states and refs used in the component
  const botMessageRef = useRef(null);
  const [wsConnection, setWsConnection] = useState(null);
  const [socket, setSocket] = useState(null);
  const [socketMessage, setSocketMessage] = useState(null);
  const [message, setMessage] = useState("");
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentBot, setCurrentBot] = useState("Clippy");
  const [botMessageSize, setBotMessageSize] = useState({
    width: 400,
    height: 50,
  });
  const [email, setEmail] = useState("john.doe@rollcall.com.au");
  const [subject, setSubject] = useState("");
  const [school, setSchool] = useState("St Johns Grammar");
  const [name, setName] = useState("John Doe");
  const [description, setDescription] = useState("");
  const [ticketType, setTicketType] = useState("General Question");
  const [phoneNumber, setPhoneNumber] = useState("0466987325");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [key, setKey] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle menu open or close
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // UseEffect to calculate the size of bot message box
  useEffect(() => {
    if (botMessageRef.current) {
      const rect = botMessageRef.current.getBoundingClientRect();
      setBotMessageSize({ width: rect.width, height: rect.height });
    }
  }, [messages]);

  // UseEffect to initialize bot with empty message
  useEffect(() => {
    const initiateBot = async () => {
      const response = await fetch("http://localhost:8000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "", role: "system" }),
      });

      const data = await response.json();
      setMessages([{ type: "bot", content: data.message }]);
    };

    initiateBot();

    // Clean up function to remove previous conversations
    return () => {
      setMessages([]);
    };
  }, []);

  // Function to extract bot name from content
  const extractBotName = (content) => {
    const botSwitchPattern = /\[BOT_SWITCH: (.*?)\]/;
    const match = content.match(botSwitchPattern);

    if (match) {
      const botName = match[1];
      const updatedContent = content.replace(
        botSwitchPattern,
        `Switching to ${botName}...`
      );
      return { botName, updatedContent };
    }

    return { botName: null, updatedContent: content };
  };

  // Function to extract image URL from text
  function extractImageUrl(text) {
    const imageUrlPattern1 =
      /Image\sURL:\s(https?:\/\/(?:[a-zA-Z0-9\-_.]+\/)+[\w\-]+\.+(?:jpe?g|gif|png|webp)(?:\?.*)?)/i;
    const imageUrlPattern2 =
      /https?:\/\/(?:[a-zA-Z0-9\-_.]+\/)+[\w\-]+\.+(?:jpe?g|gif|png|webp)(?:\?.*)?/i;

    let match = text.match(imageUrlPattern1);
    if (match) {
      return match[1];
    }

    match = text.match(imageUrlPattern2);
    return match ? match[0] : null;
  }

  // Function to handle when an image is clicked
  const handleImageClick = (imageUrl) => {
    setFullScreenImage(imageUrl);
  };

  // Function to close full screen image
  const closeFullScreenImage = () => {
    setFullScreenImage(null);
  };

  // Function to render form for freshdesk
  const renderForm = (updatedMessages, isSubmitted) => {
    console.log(updatedMessages);
    const userMessages = updatedMessages.filter((msg) => msg.type === "user");

    let mostRecentUserMessage = "";
    let concatenatedMessages = "";

    if (userMessages.length > 0) {
      mostRecentUserMessage = userMessages[userMessages.length - 1].content;
      concatenatedMessages = updatedMessages
        .map(
          (msg) => `${msg.type === "user" ? "User: " : "Bot: "}${msg.content}`
        )
        .join("\n");
    }

    // Add the useEffect hook here
    setSubject(mostRecentUserMessage);
    setDescription(concatenatedMessages);

    console.log(isSubmitted);

    return !isSubmitted ? (
      <form
        onSubmit={handleFreshDeskSubmit}
        key={key}
        style={{ width: "100%" }}
      >
        <div
          style={{
            backgroundColor: "#1D4A79",
            padding: "16px",
            borderRadius: "8px 8px 0 0",
            textAlign: "center",
          }}
        >
          <h2 style={{ margin: 0, color: "white" }}>Submit a Ticket</h2>
        </div>
        <div
          style={{
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "0 0 8px 8px",
          }}
        >
          <div style={{ marginBottom: "12px" }}>
            <label
              htmlFor="name"
              style={{ display: "block", marginBottom: "4px" }}
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "98%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #E5E7EB",
              }}
            />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label
              htmlFor="email"
              style={{ display: "block", marginBottom: "4px" }}
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "98%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #E5E7EB",
              }}
            />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label
              htmlFor="school"
              style={{ display: "block", marginBottom: "4px" }}
            >
              School:
            </label>
            <input
              type="text"
              id="school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              required
              style={{
                width: "98%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #E5E7EB",
              }}
            />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label
              htmlFor="subject"
              style={{ display: "block", marginBottom: "4px" }}
            >
              Subject:
            </label>
            <input
              type="text"
              id="subject"
              value={subject || mostRecentUserMessage}
              onChange={(e) => setSubject(e.target.value)}
              required
              style={{
                width: "98%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #E5E7EB",
              }}
            />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label
              htmlFor="description"
              style={{ display: "block", marginBottom: "4px" }}
            >
              Description:
            </label>
            <textarea
              id="description"
              value={description || concatenatedMessages}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="5"
              style={{
                width: "100%",
                padding: "12px 20px",
                boxSizing: "border-box",
                border: "2px solid #ccc",
                borderRadius: "4px",
                resize: "vertical",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <button
              type="submit"
              style={{
                backgroundColor: "#1D4A79",
                color: "white",
                padding: "15px 20px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                width: "80%",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#16324F";
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#1D4A79";
                e.target.style.transform = "scale(1)";
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    ) : (
      <div
        style={{
          backgroundColor: "white",
          padding: "16px",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <h2>Thank you for submitting a ticket to our support desk.</h2>
        <p>One of our team will be in contact with you shortly.</p>
      </div>
    );
  };

  useEffect(() => {
    const connection = new WebSocket("ws://localhost:8000/ws/chat/");

    connection.onopen = () => {
      console.log("Connected to ws://localhost:8000/ws/chat/");
      connection.send(JSON.stringify({ message: "", role: "system" }));
    };

    connection.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "bot", content: data.message },
      ]);
    };

    setWsConnection(connection);

    return () => {
      connection.close();
      setMessages([]);
    };
  }, []);

  // Listen for messages
  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      console.log("Received:", event.data);
      setSocketMessage(event.data);
    };

    socket.onclose = (event) => {
      console.log("WebSocket closed", event);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }, [socket]);

  const handleSubmit = async (e, msg = null) => {
    if (e) {
      e.preventDefault();
    }

    const userMessage = msg || message;
    setLoading(true);
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setMessage("");

    // Add a temporary bot message with the loading indicator
    const temporaryBotMessage = {
      type: "bot",
      content: <MessageLoader />,
      isTemporary: true,
    };
    setMessages((prev) => [...prev, temporaryBotMessage]);

    // Use fetch to send a POST request
    const response = await fetch("http://localhost:8000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        role: "user",
      }),
    });
    // const responseData = await response.text();

    // Handle the server's response here. For example, you might add it to the chat history:
    // setMessages((prev) => [...prev, { type: "bot", content: responseData }]);
  };
  useEffect(() => {
    if (!wsConnection) return;

    let tempMessage = null; // Variable to store the temporary message object

    wsConnection.onmessage = function (e) {
      const data = JSON.parse(e.data);

      // Check if the message indicates the end of the stream
      let message;
      try {
        message = JSON.parse(data.message);
      } catch (error) {
        // If parsing throws an error, we assume it's not the stream_end message
      }

      if (message && message.stream_end) {
        const imageUrl = extractImageUrl(tempMessage.content);
        const botSwitch = extractBotName(tempMessage.content);

        if (imageUrl) {
          tempMessage.content = tempMessage.content
            .replace(imageUrl, "")
            .trim();
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              content: (
                <img
                  src={imageUrl}
                  alt="RollCall"
                  onClick={() => handleImageClick(imageUrl)}
                  style={{ cursor: "pointer", maxHeight: "400px" }}
                />
              ),
            },
          ]);
        }

        if (botSwitch.botName) {
          tempMessage.content = botSwitch.updatedContent;
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              content: renderForm(prev, false),
            },
          ]);
        }

        tempMessage = null; // Reset tempMessage to start fresh for the next message
        return;
      }

      const { botName, updatedContent } = extractBotName(data.message);

      if (botName) {
        setCurrentBot(botName);
      }

      if (!tempMessage) {
        // Create a new message object for the first onmessage
        setLoading(false);
        setMessages((prev) => prev.filter((msg) => !msg.isTemporary));

        tempMessage = { type: "bot", content: updatedContent };
        setMessages((prev) => [...prev, tempMessage]);
      } else {
        // Concatenate the updatedContent with the existing content in tempMessage
        tempMessage.content += updatedContent;
        setMessages((prev) => [...prev]); // Trigger re-render
      }

      setLoading(false);
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      wsConnection.close();
    };
  }, [wsConnection]);

  const formatBotMessage = (content) => {
    if (typeof content !== "string") {
      return content;
    }

    const lines = content.split("\n");
    let listItems = [];
    const elements = [];
    let isListing = false; // add a flag to determine if we're in a list or not

    lines.forEach((line, index) => {
      const match = line.match(/^(\d+)\.\s(.*)$/);

      if (match) {
        const [, , text] = match;
        listItems.push(<li key={`li-${index}`}>{text}</li>);
        isListing = true;
      } else {
        if (listItems.length > 0 && isListing) {
          elements.push(<ul key={`ul-${elements.length}`}>{listItems}</ul>);
          listItems = [];
        }
        elements.push(<p key={`p-${index}`}>{line}</p>);
        isListing = false;
      }
    });

    if (listItems.length > 0) {
      elements.push(<ul key={`ul-${elements.length}`}>{listItems}</ul>);
    }

    return <div>{elements}</div>;
  };

  const handleSuggestionClick = (suggestion) => {
    handleSubmit(null, suggestion); // Pass the suggestion as the second argument
  };

  const handleFreshDeskSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const subjectValue = form.subject.value;
    const descriptionValue = form.description.value;

    console.log(messages);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/freshdesk/create-ticket`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            subject: subjectValue,
            description: descriptionValue,
            ticketType,
            school, // Add this field
            phoneNumber, // Add this field
          }),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        console.log("Ticket created successfully:", responseData);
        setIsSubmitted(true);
        setKey((prevKey) => prevKey + 1); // Update the key value
      } else {
        console.error("Error creating ticket:", responseData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSendTicket = () => {
    setMessages((prev) => [
      ...prev,
      {
        type: "bot",
        content: renderForm(prev, false),
      },
    ]);
  };

  return (
    <div className="flex-container">
      <div className="main-screen" style={{ width: isOpen ? "67vw" : "100vw" }}>
        <img src={myImage} alt="RollCallScreen" />

        <div
          style={{
            position: "absolute",
            top: "2%",
            left: isOpen ? "65%" : "97%",
          }}
        >
          {isOpen ? (
            <FaTimes onClick={toggleMenu} style={{ fontSize: "1.5rem" }} />
          ) : (
            <FaBars onClick={toggleMenu} style={{ fontSize: "1.5rem" }} />
          )}
        </div>
      </div>
      <div className="chat-container">
        {fullScreenImage && (
          <div
            className="full-screen-image-container"
            onClick={closeFullScreenImage}
          >
            <img src={fullScreenImage} alt="full-screen" />
          </div>
        )}
        <nav className="navbar">
          <div className="nav-tabs">
            <SendTicketButton onClick={handleSendTicket} />
          </div>
          <a href="/" className="logo">
            <img
              src="https://rollcall.com.au/wp-content/uploads/2018/08/cropped-RollCall-logo-sml-02.png"
              alt="Your Logo"
              style={{ width: "100px" }}
            />
          </a>
        </nav>
        <div className="chat-window">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message-wrapper ${
                msg.type === "user"
                  ? "user-message-wrapper"
                  : "bot-message-wrapper"
              }`}
            >
              <div
                className={`${msg.type === "user" ? "user-name" : "bot-name"}`}
              >
                {msg.type === "user" ? "John" : "RollCall"}
              </div>
              <div
                ref={botMessageRef}
                className={`message ${
                  msg.type === "user" ? "user-message" : "bot-message"
                }`}
              >
                {msg.type === "user" ? (
                  msg.content
                ) : msg.isLoading ? (
                  <MessageLoader
                    width={botMessageSize.width}
                    height={botMessageSize.height}
                    botMessageSize={botMessageSize}
                  />
                ) : (
                  formatBotMessage(msg.content)
                )}
              </div>
            </div>
          ))}
        </div>
        <SuggestedMessages onSuggestionClick={handleSuggestionClick} />

        <form onSubmit={handleSubmit} className="form-container">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="message-input"
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          ></textarea>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? <div className="loader"></div> : "Send"}
          </button>
          {loading && (
            <div className="typing-bubble">RollCall is typing...</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Home;
