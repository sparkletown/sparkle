export interface FileButtonProps {
  text?: string;
  recommendedSize?: string;
  onChange: (url: string, file: FileList) => void;
}
