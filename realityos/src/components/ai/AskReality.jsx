import { useEffect, useState } from "react";
import {
  MessageCircle,
  Mic,
  Send,
  Sparkles,
  Volume2,
  Square,
} from "lucide-react";

import { askReality } from "../../services/analysisService";

export default function AskReality({
  analysis,
}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const toggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("Voice input is not supported in this browser.");
      return;
    }

    if (listening) {
      window.realitySpeechRecognition?.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    window.realitySpeechRecognition = recognition;
    recognition.lang = navigator.language || "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      setVoiceError("");
      setListening(true);
    };
    recognition.onresult = (event) => setQuestion(event.results[0][0].transcript);
    recognition.onerror = () => setVoiceError("I couldn't hear that. Try again or type your question.");
    recognition.onend = () => {
      setListening(false);
      window.realitySpeechRecognition = null;
    };
    recognition.start();
  };

  const toggleReadAloud = () => {
    if (!("speechSynthesis" in window)) {
      setVoiceError("Read aloud is not supported in this browser.");
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(answer);
    utterance.rate = 0.98;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const ask = async () => {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const result = await askReality(
        question,
        analysis
      );

      setAnswer(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ask-page">
      <div className="page-intro">
        <div className="ai-large-icon">
          <Sparkles size={24} />
        </div>

        <span className="eyebrow">
          CONTEXTUAL AI
        </span>

        <h2>Ask RealityOS</h2>

        <p>
          Ask questions about what you just
          captured.
        </p>
      </div>

      <div className="ask-box">
        <MessageCircle size={19} />

        <input
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") ask();
          }}
          placeholder="What should I know about this?"
        />

        <button className={`voice-button ${listening ? "active" : ""}`} onClick={toggleVoice} aria-label={listening ? "Stop voice input" : "Ask by voice"} aria-pressed={listening}>
          <Mic size={16} />
        </button>

        <button onClick={ask}>
          <Send size={17} />
        </button>
      </div>

      {voiceError && <p className="voice-error" role="alert">{voiceError}</p>}

      <div className="suggestion-row">
        {[
          "What is this?",
          "Is this due soon?",
          "What should I do?",
        ].map((item) => (
          <button
            key={item}
            onClick={() => {
              setQuestion(item);
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {loading && (
        <div className="ai-answer">
          <div className="typing">
            <span />
            <span />
            <span />
          </div>

          Understanding...
        </div>
      )}

      {answer && !loading && (
        <div className="ai-answer">
          <div className="answer-icon">
            <Sparkles size={18} />
          </div>

          <div>
            <span>RealityOS</span>
            <p>{answer}</p>
          </div>

          <button className={`read-aloud-button ${speaking ? "active" : ""}`} onClick={toggleReadAloud} aria-label={speaking ? "Stop reading answer" : "Read answer aloud"} title={speaking ? "Stop reading" : "Read aloud"}>
            {speaking ? <Square size={14} /> : <Volume2 size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}
