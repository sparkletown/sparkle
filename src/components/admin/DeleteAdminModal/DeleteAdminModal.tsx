import { removeWorldAdmin } from "api/world";

import { UserWithId } from "types/id";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

import { Modal } from "components/molecules/Modal";

import { Button } from "../Button";

interface DeleteAdminModalProps {
  show: boolean;
  user: UserWithId;
  onHide: () => void;
}

export const DeleteAdminModal: React.FC<DeleteAdminModalProps> = ({
  show,
  user,
  onHide,
}) => {
  const { worldId } = useWorldAndSpaceByParams();

  const removeAdmin = async () => {
    if (!worldId) {
      return;
    }

    await removeWorldAdmin(worldId, user.id);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} autoHide>
      Are you sure you want to remove {user.partyName} from the owners of this
      world?
      <div className="flex flex-row">
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={removeAdmin}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};
