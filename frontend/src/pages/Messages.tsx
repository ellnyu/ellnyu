import React, { useState } from "react";
import "./Messages.module.scss";

interface Comment {
  id: number;
  name: string;
  message: string;
}

const Messages: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    const newComment: Comment = {
      id: Date.now(),
      name,
      message,
    };

    setComments([newComment, ...comments]);
    setName("");
    setMessage("");
  };

  return (
    <div className="review-page">
      <h1>Meldiiing</h1>
      <form className="review-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Navn?"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Skriv inn noe her"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Publiser</button>
      </form>

      <div className="comments-list">
        {comments.length === 0 && <p>Ingen meldinger enda men det kan du endre på!!!</p>}
        {comments.map((comment) => (
          <div className="comment" key={comment.id}>
            <h4>{comment.name}</h4>
            <p>{comment.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;

