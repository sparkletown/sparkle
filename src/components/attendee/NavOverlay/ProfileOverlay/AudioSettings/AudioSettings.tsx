import { Select } from "components/attendee/Select";

import { FormFieldProps } from "types/forms";

type AudioSettingsProps = {
  register: FormFieldProps["register"];
};
export const AudioSettings: React.FC<AudioSettingsProps> = ({ register }) => {
  return (
    <div>
      <div>Audio Settings</div>
      <div>
        Speaker
        <Select name="speakerSource" ref={register()} />
      </div>
      <div>
        Microphone
        <Select name="micSource" ref={register()} />
      </div>
    </div>
  );
};
