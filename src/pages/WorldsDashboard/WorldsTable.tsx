import { TablePanel } from "components/admin/TablePanel";

import { World } from "api/world";

import { WithId } from "utils/id";

import { WorldCard } from "components/molecules/WorldCard";

interface WorldsTableProps {
  worlds: WithId<World>[];
}

export const WorldsTable: React.FC<WorldsTableProps> = ({ worlds }) => (
  <TablePanel.Panel>
    <TablePanel.Body>
      {worlds.map((world) => (
        <WorldCard key={world.id} world={world} />
      ))}
    </TablePanel.Body>
  </TablePanel.Panel>
);
