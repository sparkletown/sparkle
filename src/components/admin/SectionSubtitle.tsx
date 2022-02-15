interface SectionSubtitleProps {
  children: React.ReactNode;
}

export const SectionSubtitle = ({ children }: SectionSubtitleProps) => (
  <h3 className="text-lg leading-6 font-medium text-gray-900 pb-5">
    {children}
  </h3>
);
