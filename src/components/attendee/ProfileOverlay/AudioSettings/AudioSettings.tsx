import { UseFormRegister } from "react-hook-form";
import { Select } from "components/attendee/Select";

import { UserProfileModalFormData } from "types/profileModal";

type AudioSettingsProps = {
  register: UseFormRegister<UserProfileModalFormData>;
};
export const AudioSettings: React.FC<AudioSettingsProps> = ({ register }) => {
  return (
    <div>
      <div>Audio Settings</div>
      <div>
        Speaker
        <Select name="speakerSource" register={register} />
      </div>
      <div>
        Microphone
        <Select name="micSource" register={register} />
      </div>
    </div>
  );
};
