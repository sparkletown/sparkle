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

import { SoundConfigMap, SoundConfigReference } from "types/sounds";

import { fetchSoundConfigs } from "api/sounds";

export type PlaySpriteFunction = (options?: PlaySpriteOptions) => void;
export type PlaySpriteOptions = Omit<PlayOptions, "id">;

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
 */
export const useCustomSound = (
  soundRef?: string | SoundConfigReference,
  options?: HookOptions
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

  const optionsWithSprites: HookOptions = {
    ...options,
    sprite: soundConfig?.sprites,
  };

  // If we didn't find a matching sound config then force the sound to be disabled
  const optionsWithExtras =
    soundConfig !== undefined
      ? optionsWithSprites
      : { ...optionsWithSprites, soundEnabled: false };

  // @debt Figure out a nicer way to handle conditionally calling this hook when we don't have a valid config
  const [play, exposedData] = useSound(
    soundConfig?.url ?? "",
    optionsWithExtras
  );

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
