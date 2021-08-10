import { SpriteMap } from "use-sound/dist/types";
import * as Yup from "yup";

import { WithId } from "utils/id";

export interface SoundConfig {
  url: string;
  sprites?: SpriteMap;
}

export interface SoundConfigReference {
  soundId: string;
  spriteName?: string;
}

export type SoundConfigMap = Partial<Record<string, WithId<SoundConfig>>>;

/**
 * SpriteMap validation schema.
 *
 * @see SpriteMap
 */
export const SpriteMapSchema = Yup.lazy<{} | undefined>((data = {}) => {
  const lazyObjectShape: Record<
    string,
    Yup.ArraySchema<number>
  > = Object.entries(data).reduce(
    (acc, [key]) => ({
      ...acc,
      [key]: Yup.array().of(Yup.number().required()).min(2).max(2).required(),
    }),
    {}
  );

  return Yup.object().shape(lazyObjectShape).noUnknown();
});

/**
 * SoundConfig validation schema.
 *
 * @see SoundConfig
 */
export const SoundConfigSchema: Yup.ObjectSchema<SoundConfig> = Yup.object()
  .shape<SoundConfig>({
    url: Yup.string().required(),
    sprites: SpriteMapSchema,
  })
  .noUnknown()
  .required();

/**
 * SoundConfigReference validation schema.
 *
 * @see SoundConfigReference
 */
export const SoundConfigReferenceSchema = Yup.object()
  .shape<SoundConfigReference>({
    soundId: Yup.string().required(),
    spriteName: Yup.string().notRequired(),
  })
  .noUnknown()
  .required();

export const isSoundConfig = (data: {}): data is SoundConfig =>
  SoundConfigSchema.isValidSync(data);

export const isSoundConfigReference = (data: {}): data is SoundConfigReference =>
  SoundConfigReferenceSchema.isValidSync(data);
