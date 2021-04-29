export type PosterCategory = {
  title: string;
  color: string;
};

export type Poster = {
  title: string;
  categories: PosterCategory[];
  introVideoUrl: string;
  author: {
    name: string;
    institution: string;
  };
};
