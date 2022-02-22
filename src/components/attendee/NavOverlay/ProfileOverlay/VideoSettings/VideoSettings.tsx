import { Select } from "components/attendee/Select";

import { FormFieldProps } from "types/forms";

type VideoSettingsProps = {
  register: FormFieldProps["register"];
};
export const VideoSettings: React.FC<VideoSettingsProps> = ({ register }) => {
  return (
    <div>
      <div>Video Settings</div>
      <div>
        Camera
        <Select name="videoSource" ref={register()} />
      </div>
    </div>
  );
};
