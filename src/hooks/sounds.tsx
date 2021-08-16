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

import Bugsnag from "@bugsnag/js";

import { fetchSoundConfigs } from "api/sounds";

import { SoundConfigMap, SoundConfigReference } from "types/sounds";

import { isDefined } from "utils/types";

import { useUser } from "hooks/useUser";

export type PlaySpriteFunction = (options?: PlaySpriteOptions) => void;
export type PlaySpriteOptions = Omit<PlayOptions, "id">;

export type UseCustomSoundOptions = HookOptions & HowlOptions;

export interface ExposedDataWithPlay extends ExposedData {
  play: PlayFunction;
}

export interface CustomSoundsState {
  soundConfigs: SoundConfigMap;
  isLoading: boolean;
}

export const initialValue: CustomSoundsState = {
  soundConfigs: {},
  isLoading: false,
};

export const CustomSoundsContext = createContext<CustomSoundsState>(
  initialValue
);

export interface CustomSoundsProviderProps {
  waitTillConfigLoaded?: boolean;
  loadingComponent?: React.ReactNode;
}

export const CustomSoundsProvider: React.FC<CustomSoundsProviderProps> = ({
  loadingComponent = "Loading...",
  waitTillConfigLoaded = false,
  children,
}) => {
  const [soundConfigs, setSoundConfigs] = useState<SoundConfigMap>(
    initialValue.soundConfigs
  );
  const [isLoading, setIsLoading] = useState<boolean>(initialValue.isLoading);

  const { user } = useUser();
  const userId = user?.uid;

  // Fetch the sound configs data on first load
  useEffect(() => {
    if (!userId) return;

    setIsLoading(true);
    fetchSoundConfigs()
      .then(setSoundConfigs)
      .finally(() => setIsLoading(false));
  }, [userId]);

  const providerData = useMemo(
    () => ({
      soundConfigs,
      isLoading,
    }),
    [soundConfigs, isLoading]
  );

  return (
    <CustomSoundsContext.Provider value={providerData}>
      {waitTillConfigLoaded && isLoading ? loadingComponent : children}
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

  const { onend } = options ?? {};

  // Fetch all of our loaded sound configs
  const { soundConfigs } = useCustomSoundsContext();

  // Try to access just the one we want here
  const soundConfig = soundConfigs[soundId];

  const sprites = soundConfig?.sprites;

  const hasSoundRef = isDefined(soundRef);
  const hasSoundConfig = isDefined(soundConfig);
  const hasSprites = isDefined(sprites);
  const wantsSprites = isDefined(spriteName);
  // @debt we don't use hasSprites / wantsSprites here as TypeScript then seems to think spriteName can be undefined still
  //   see https://github.com/microsoft/TypeScript/issues/12798#issuecomment-800824801
  const wantedSpriteExists =
    sprites && spriteName ? sprites.hasOwnProperty(spriteName) : false;
  const enableSprites = hasSprites && wantsSprites;

  // We must both haveSprites && wantSprites or not have either for the config to be valid
  const hasValidSpriteConfig =
    (enableSprites && wantedSpriteExists) || (!hasSprites && !wantsSprites);

  // Track when we don't find the soundConfig that corresponds to soundRef. This will probably
  // just mean that there is some stale/broken reference in our firestore DB. The app shouldn't
  // break, as we should gracefully fall back to not playing any sound here in this case.
  useEffect(() => {
    if (hasSoundRef && !hasSoundConfig) {
      const msg = "[useCustomSound] Unable to find matching soundConfig";
      const context = {
        location: "hooks::sounds::useCustomSound",
        soundRef,
        soundConfigsKeys: Object.keys(soundConfigs),
      };

      console.warn(msg, context);
      Bugsnag.notify(msg, (event) => {
        event.severity = "warning";
        event.addMetadata("context", context);
      });
    }
  }, [hasSoundConfig, hasSoundRef, soundConfigs, soundRef]);

  // Track when soundConfig.sprites doesn't contain soundRef.spriteName. This will probably
  // just mean that there is some stale/broken reference in our firestore DB. The app shouldn't
  // break, as we should gracefully fall back to not playing any sound here in this case.
  useEffect(() => {
    if (hasSprites && wantsSprites && !wantedSpriteExists) {
      const msg =
        "[useCustomSound] requested sprite missing from soundConfig.sprites";
      const context = {
        location: "hooks::sounds::useCustomSound",
        soundRef,
        spritesKeys: sprites ? Object.keys(sprites) : [],
      };

      console.warn(msg, context);
      Bugsnag.notify(msg, (event) => {
        event.severity = "warning";
        event.addMetadata("context", context);
      });
    }
  }, [
    hasSprites,
    soundRef,
    spriteName,
    sprites,
    wantedSpriteExists,
    wantsSprites,
  ]);

  // Track when "hasSprites but not wantsSprites", or when we "wantsSprites but not hasSprites".
  // This will probably just mean that there is some stale/broken reference in our firestore DB.
  // The app shouldn't break, as we should gracefully fall back to not playing any sound here in this case.
  //
  // @debt we don't use hasSoundRef / hasSoundConfig here as TypeScript then seems to think that they can be undefined still
  //   see https://github.com/microsoft/TypeScript/issues/12798#issuecomment-800824801
  useEffect(() => {
    if (
      isDefined(soundRef) &&
      isDefined(soundConfig) &&
      !hasValidSpriteConfig
    ) {
      const msg = "[useCustomSound] invalid sprite configuration";
      const context = {
        location: "hooks::sounds::useCustomSound",
        soundRef,
        sprites,
        hasSprites,
        wantsSprites,
      };

      console.warn(msg, context);
      Bugsnag.notify(msg, (event) => {
        event.severity = "warning";
        event.addMetadata("context", context);
      });
    }
  }, [
    hasSprites,
    hasValidSpriteConfig,
    soundConfig,
    soundRef,
    sprites,
    wantsSprites,
  ]);

  const soundUrl = hasValidSpriteConfig
    ? soundConfig?.url ?? USE_SOUND_DISABLED_URL
    : USE_SOUND_DISABLED_URL;

  const optionsWithSprites: UseCustomSoundOptions = {
    ...options,
    // Only define the sprites when we're requesting to play a sprite (works around a Howler error)
    sprite: enableSprites ? soundConfig?.sprites : undefined,
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
    (options = {}) => {
      play({ ...options, id: spriteName });

      // This works around the fact that onend isn't called when we disable the sound playback,
      // yet it can be useful to use onend to trigger functionality (eg. changing rooms) after
      // the sound playback has finished.
      if (!hasSoundConfig || !hasValidSpriteConfig) {
        onend && onend(-1);
      }
    },
    [play, spriteName, hasSoundConfig, hasValidSpriteConfig, onend]
  );

  return [playSprite, { ...exposedData, play }];
};
