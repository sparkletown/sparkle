/*
 * This is a series of components for what is called a "TablePanel". It looks
 * like the standard panel used everywhere and is divided into rows.
 *
 * Essentially, it's a HTML table, but, with some styles applied.
 */
const Panel: React.FC = ({ children }) => (
  <div className="flex flex-col">
    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            {children}
          </table>
        </div>
      </div>
    </div>
  </div>
);

const Body: React.FC = ({ children }) => (
  <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
);

const Row: React.FC = ({ children }) => <tr>{children}</tr>;

const Cell: React.FC = ({ children }) => (
  <td className="px-6 py-4">
    <div className="flex items-center">{children}</div>
  </td>
);

const ActionsCell: React.FC = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
    <div className="flex align-center justify-end gap-x-5 flex-row">
      {children}
    </div>
  </td>
);

export const TablePanel = {
  ActionsCell,
  Body,
  Cell,
  Panel,
  Row,
};
