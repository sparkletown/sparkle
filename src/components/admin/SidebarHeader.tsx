export const SidebarHeader: React.FC = ({ children }) => {
  return (
    <p className="SidebarHeader -mx-6 -mt-5 mb-6 py-6 px-6 mb-2 bg-gray-50 divide-y rounded-t-md divide-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {children}
    </p>
  );
};
