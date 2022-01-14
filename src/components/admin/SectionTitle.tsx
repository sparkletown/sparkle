interface SectionTitleProps {
  children: React.ReactNode;
}

export const SectionTitle = ({ children }: SectionTitleProps) => (
  <h3 className="text-2xl leading-6 font-medium text-gray-900">{children}</h3>
);
