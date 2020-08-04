import React from "react";
import { useForm, FieldErrors, useFieldArray } from "react-hook-form";
import { AdvancedVenueInput } from "api/admin";

interface AdvancedDetailsProps {
  register: ReturnType<typeof useForm>["register"];
  control: ReturnType<typeof useForm>["control"];
  values: Partial<AdvancedVenueInput>;
  errors: FieldErrors<Partial<AdvancedVenueInput>>;
}

export const AdvancedDetailsForm: React.FC<AdvancedDetailsProps> = (props) => {
  const { register, control } = props;
  const { fields, append, remove } = useFieldArray<
    AdvancedVenueInput["profileQuestions"][number]
  >({
    control,
    name: "profileQuestions",
  });
  return (
    <div className="advanced-container">
      <div className="input-container">
        <div className="input-title">Profile Questions</div>
        <ul>
          {fields.map((item, index) => (
            <li className="question" key={item.id}>
              <div className="question-inputs-container">
                <div className="between-flex">
                  <input
                    className="question-name-input"
                    name={`profileQuestions[${index}].name`}
                    ref={register()}
                    placeholder={`Question ${index + 1} Name`}
                  />
                  <button
                    className="btn delete-btn"
                    type="button"
                    onClick={() => remove(index)}
                  >
                    Delete
                  </button>
                </div>
                <input
                  className="question-text-input"
                  name={`profileQuestions[${index}].text`}
                  ref={register()}
                  placeholder={`Question ${index + 1} Text`}
                />
              </div>
            </li>
          ))}
        </ul>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => append({ name: "", text: "" })}
        >
          Add a question
        </button>
      </div>
    </div>
  );
};
