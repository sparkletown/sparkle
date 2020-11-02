export type ButtonProps = {
  customClass?: string;
  loading?: boolean;
  onClick?: () => {};
  text: string;
  type?: 'button' | 'reset' | 'submit';
}
