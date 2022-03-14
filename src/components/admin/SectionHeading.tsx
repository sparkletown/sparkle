interface SectionHeadingProps {
  children: React.ReactNode;
}

export const SectionHeading = ({ children }: SectionHeadingProps) => (
  <div className="pb-5 flex items-center justify-between">{children}</div>
);
