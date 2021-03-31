export type TPosterCategory = {
  title: string;
  color: string;
};

export type TPoster = {
  title: string;
  pdfUrl: string;
  categories: TPosterCategory[];
  author: {
    name: string;
    institution: string;
  };
};

export type WithPoster<T extends object> = T & { poster: TPoster };
