import { useState } from "react";
import {
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react";

import { askReality } from "../../services/analysisService";

export default function AskReality({
  analysis,
}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

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

        <button onClick={ask}>
          <Send size={17} />
        </button>
      </div>

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
        </div>
      )}
    </div>
  );
}
