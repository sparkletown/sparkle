import React from "react";
import "./FAQPage.scss";
import { useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";

interface FAQuestion {
  id: string;
  category: string;
  question: string;
  answer: string;
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
            <p>{question.question}</p>
            <p>{question.answer}</p>
          </div>
        ))}
    </div>
  );
};

export default FAQPage;
