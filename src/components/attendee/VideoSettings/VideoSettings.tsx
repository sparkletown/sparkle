import { UseFormRegister } from "react-hook-form";
import { Select } from "components/attendee/Select";

import { UserProfileModalFormData } from "types/profileModal";

type VideoSettingsProps = {
  register: UseFormRegister<UserProfileModalFormData>;
};
export const VideoSettings: React.FC<VideoSettingsProps> = ({ register }) => {
  return (
    <div>
      <div>Video Settings</div>
      <div>
        Camera
        <Select name="videoSource" register={register} />
      </div>
    </div>
  );
};
