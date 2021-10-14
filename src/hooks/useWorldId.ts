import { useParams } from "react-router-dom";

interface ParamsTypes {
  worldId?: string;
}

/**
 * Retrieve the worldId from the URL path (/:worldId/)
 *
 * @see https://reactrouter.com/web/api/Hooks/useparams
 */
export const useWorldId: () => string | undefined = () => {
  const { worldId } = useParams() as ParamsTypes;

  return worldId ?? undefined;
};
