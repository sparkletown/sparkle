import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import useSound from "use-sound";
import {
  ExposedData,
  HookOptions,
  PlayFunction,
  PlayOptions,
} from "use-sound/dist/types";
import { HowlOptions } from "howler";

import { SoundConfigMap, SoundConfigReference } from "types/sounds";

import { fetchSoundConfigs } from "api/sounds";

export type PlaySpriteFunction = (options?: PlaySpriteOptions) => void;
export type PlaySpriteOptions = Omit<PlayOptions, "id">;

export type UseCustomSoundOptions = HookOptions & HowlOptions;

export interface ExposedDataWithPlay extends ExposedData {
  play: PlayFunction;
}

export interface CustomSoundsState {
  soundConfigs: SoundConfigMap;
}

export const initialValue: CustomSoundsState = {
  soundConfigs: {},
};

export const CustomSoundsContext = createContext<CustomSoundsState>(
  initialValue
);

export const CustomSoundsProvider: React.FC = ({ children }) => {
  const [soundConfigs, setSoundConfigs] = useState<SoundConfigMap>(
    initialValue.soundConfigs
  );

  // Fetch the sound configs data on first load
  useEffect(() => {
    fetchSoundConfigs().then((soundConfigs) => {
      setSoundConfigs(soundConfigs);
    });
  }, []);

  const providerData = useMemo(
    () => ({
      soundConfigs,
    }),
    [soundConfigs]
  );

  return (
    <CustomSoundsContext.Provider value={providerData}>
      {children}
    </CustomSoundsContext.Provider>
  );
};

export const useCustomSoundsContext = (): CustomSoundsState =>
  useContext(CustomSoundsContext);

const USE_SOUND_DISABLED_URL = "";
const USE_SOUND_DISABLED_CONFIG = { soundEnabled: false };

/**
 * Load a custom sound using a SoundConfigReference, and expose controls to play it/a sprite within it.
 *
 * @example
 *   const [play] = useCustomSound({ soundId: "ABC123" });
 *
 * @example
 *   const [play] = useCustomSound({
 *     soundId: "ABC123",
 *     spriteName: "somethingSnazzy",
 *   });
 *
 * @param soundRef
 * @param options see use-sound's HookOptions
 *
 * @see https://github.com/joshwcomeau/use-sound
 * @see HookOptions (from use-sound)
 * @see ReturnedValue (from use-sound)
 * @see PlayFunction (from use-sound)
 * @see ExposedData (from use-sound)
 *
 * @see https://github.com/goldfire/howler.js
 * @see HowlOptions
 */
export const useCustomSound = (
  soundRef?: string | SoundConfigReference,
  options?: UseCustomSoundOptions
): [PlaySpriteFunction, ExposedDataWithPlay] => {
  const { soundId, spriteName } = (() => {
    switch (typeof soundRef) {
      case "string":
        return { soundId: soundRef, spriteName: undefined };

      // This case won't actually allow us to play any sounds, and is only here to
      // work around the inability to conditionally render hooks
      case "undefined":
        return { soundId: "", spriteName: undefined };

      default:
        return soundRef;
    }
  })();

  // Fetch all of our loaded sound configs
  const { soundConfigs } = useCustomSoundsContext();

  // Try to access just the one we want here
  const soundConfig = soundConfigs[soundId];

  // TODO: throw some kind of error/tracking/etc when we don't find a valid soundConfig
  // TODO: throw some kind of error/tracking/etc when we don't find soundRef.spriteName in soundConfig
  // TODO: throw some kind of error/tracking/etc when we hasSprites but not wantsSprites, or when we wantsSprites but not hasSprites

  const hasSoundConfig = soundConfig !== undefined;
  const hasSprites = soundConfig?.sprites !== undefined;
  const wantsSprites = spriteName !== undefined;

  // We must both haveSprites && wantSprites or not have either for the config to be valid
  const soundUrl =
    (hasSprites && wantsSprites) || (!hasSprites && !wantsSprites)
      ? soundConfig?.url ?? USE_SOUND_DISABLED_URL
      : USE_SOUND_DISABLED_URL;

  const optionsWithSprites: UseCustomSoundOptions = {
    ...options,
    // Only define the sprites when we're requesting to play a sprite (works around a Howler error)
    sprite: hasSprites && wantsSprites ? soundConfig?.sprites : undefined,
  };

  // If we didn't find a matching sound config then force the sound to be disabled
  const optionsWithExtras: UseCustomSoundOptions = hasSoundConfig
    ? optionsWithSprites
    : USE_SOUND_DISABLED_CONFIG;

  // @debt Figure out a nicer way to handle conditionally calling this hook when we don't have a valid config
  const [play, exposedData] = useSound(soundUrl, optionsWithExtras);

  /**
   * Wrap use-sound's play function so that it plays the SoundConfigReference.spriteId sprite.
   *
   * @param options
   */
  const playSprite: PlaySpriteFunction = useCallback(
    (options = {}) => play({ ...options, id: spriteName }),
    [play, spriteName]
  );

  return [playSprite, { ...exposedData, play }];
};
