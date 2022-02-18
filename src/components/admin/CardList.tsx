interface CardListProps {
  children: React.ReactNode;
}

export const CardList: React.FC<CardListProps> = ({ children }) => (
  <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {children}
  </ul>
);
