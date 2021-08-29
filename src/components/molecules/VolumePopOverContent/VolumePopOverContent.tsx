import { useCallback } from "react";
import { useLocalStorage } from "react-use";

import { LS_KEY_IS_AMBIENT_AUDIO_VOCAL } from "settings";

import { setAnimateMapEnvironmentSound } from "store/actions/AnimateMap";

import { animateMapEnvironmentSoundSelector } from "utils/selectors";

import { useDispatch } from "hooks/useDispatch";
import { useSelector } from "hooks/useSelector";
import { useVolumeControl } from "hooks/useVolumeControl";

import { VolumeControl } from "components/atoms/VolumeControl";

import "./VolumePopOverContent.scss";

export const VolumePopOverContent = () => {
  const dispatch = useDispatch();
  const isAmbientAudioVocal = useSelector(animateMapEnvironmentSoundSelector);
  const [, setAmbientAudioVocal] = useLocalStorage(
    LS_KEY_IS_AMBIENT_AUDIO_VOCAL
  );

  const onToggleAmbientAudio = useCallback(() => {
    const toggledValue = !isAmbientAudioVocal;
    setAmbientAudioVocal(toggledValue);
    dispatch(setAnimateMapEnvironmentSound(toggledValue));
  }, [dispatch, isAmbientAudioVocal, setAmbientAudioVocal]);

  // Notifications volume control
  const {
    volume: notificationsVolume,
    // volumeCallback: setNotificationsVolume,
  } = useVolumeControl();

  // Interactions volume control
  const {
    volume: interactionsVolume,
    // volumeCallback: setInteractionsVolume,
  } = useVolumeControl();

  return (
    <>
      <VolumeControl
        className="NavBar__volume-control"
        label="Ambient Noise"
        name="noise"
        muted={isAmbientAudioVocal}
        withMute
        onMute={onToggleAmbientAudio}
      />
      <VolumeControl
        className="NavBar__volume-control NavBar__volume-control--hidden"
        label="Notifications"
        name="notifications"
        volume={notificationsVolume}
      />
      <VolumeControl
        className="NavBar__volume-control NavBar__volume-control--hidden"
        label="Interactions"
        name="interactions"
        volume={interactionsVolume}
      />
    </>
  );
};
