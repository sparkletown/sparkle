import React from "react";
import "./FAQPage.scss";
import { useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";

interface FAQuestion {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQPage: React.FunctionComponent = () => {
  useFirestoreConnect("faq");

  const { faq } = useSelector((state: any) => ({
    faq: state.firestore.ordered.faq,
  }));
  return (
    <div className="faq-container">
      <p className="hero-text">This is our continuously updated FAQ section</p>
      {faq &&
        faq.map((question: FAQuestion) => (
          <div key={question.id}>
            <h2>{question.category}</h2>
            <p className="question">{question.question}</p>
            <p className="answer">{question.answer}</p>
          </div>
        ))}
    </div>
  );
};

export default FAQPage;
