import { World } from "api/world";

import { WithId } from "utils/id";

import { WorldCard } from "components/molecules/WorldCard";

interface WorldsTableProps {
  worlds: WithId<World>[];
}

export const WorldsTable: React.FC<WorldsTableProps> = ({ worlds }) => (
  <div className="flex flex-col">
    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {worlds.map((world) => (
                <WorldCard key={world.id} world={world} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);
