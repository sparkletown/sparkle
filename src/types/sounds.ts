import * as Yup from "yup";
import { SpriteMap } from "use-sound/dist/types";

export type SoundConfig = {
  url: string;
  sprites?: SpriteMap;
};

export const SpriteMapSchema: Yup.Lazy = Yup.lazy<SpriteMap>((data) => {
  const schemaEntries = Object.entries(data).map(([key]) => [
    key,
    Yup.array().of(Yup.number()).min(2).max(2).required(),
  ]);

  return Object.fromEntries(schemaEntries);
});

export const SoundConfigSchema: Yup.ObjectSchema<SoundConfig> = Yup.object()
  .shape<SoundConfig>({
    url: Yup.string().required(),
    sprites: SpriteMapSchema,
  })
  .noUnknown()
  .required();

export const isSoundConfig = (data: {}): data is SoundConfig =>
  SoundConfigSchema.isValidSync(data);
