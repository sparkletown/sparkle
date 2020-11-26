type NoEdit = {
  showEdit?: false;
  editClickHandler?: () => void;
};

type HasEdit = {
  showEdit?: true;
  editClickHandler: () => void;
};

type EditProps = NoEdit | HasEdit;

export type DetailsPreviewProps = EditProps & {
  bannerImageUrl?: string;
  logoImageUrl?: string;
  name?: string;
  subtitle?: string;
  description?: string;
  large?: boolean;
};
