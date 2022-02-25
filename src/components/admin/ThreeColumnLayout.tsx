export const ThreeColumnLayout: React.FC = ({ children }) => (
  <div className="py-10 max-w-10xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-10xl lg:grid-flow-col-dense lg:grid-cols-3">
    {children}
  </div>
);
