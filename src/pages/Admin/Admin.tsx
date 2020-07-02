import React from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import "./Admin.scss";
import { useFirebase } from "react-redux-firebase";

const ALLOWED_UIDS = [
  "5ZygmvSesvRoacDLhvtrSlFk7X42",
  "0eQgusXEyDf0fE2x1TGufLdy2iJ3",
  "mrTdJgmhKIgvycGlyNDV5Cphtt72",
];

interface FAQFormData {
  category: string;
  question: string;
  answer: string;
}

const Admin = () => {
  const { user } = useSelector((state: any) => ({
    user: state.user,
  }));

  const { register, handleSubmit, setValue } = useForm<FAQFormData>();

  const firebase = useFirebase();

  const onSubmit = async (data: FAQFormData) => {
    await firebase.firestore().collection("faq").add(data);
    setValue("category", "");
    setValue("question", "");
    setValue("answer", "");
  };

  if (user && !ALLOWED_UIDS.includes(user.uid)) {
    return <>You're not authorized to see this content</>;
  }

  return (
    <div className="container admin-container">
      <h1>Add a FAQ item</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <input
            name="category"
            className="input-block input-centered"
            placeholder="Category"
            ref={register({
              required: true,
            })}
          />
          <textarea
            name="question"
            className="input-block input-centered"
            placeholder="Question"
            ref={register({
              required: true,
            })}
          />
          <textarea
            name="answer"
            className="input-block input-centered"
            placeholder="Answer"
            ref={register({
              required: true,
            })}
          />
          <input
            type="submit"
            value="Submit"
            className="btn btn-primary btn-block btn-centered"
          />
        </div>
      </form>
    </div>
  );
};

export default Admin;
