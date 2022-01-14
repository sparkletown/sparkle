interface SectionProps {
  children: React.ReactNode;
}

export const Section = ({ children }: SectionProps) => (
  <div className="py-5">{children}</div>
);
