import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

import { Modal } from "components/molecules/Modal";

import { Button } from "../Button";
import { Input } from "../Input";

export interface InviteAdminModalProps {
  show: boolean;
  onHide: () => void;
}

//@debt This component is not finished yet, algoliaSearch needs to be used for search functionality.
export const InviteAdminModal: React.FC<InviteAdminModalProps> = ({
  show,
  onHide,
}) => {
  const { worldId } = useWorldAndSpaceByParams();

  const defaultValues = useMemo(
    () => ({
      userName: "",
    }),
    []
  );

  const { register } = useForm({
    reValidateMode: "onChange",
    defaultValues,
  });

  const addAdmin = async () => {
    if (!worldId) {
      return;
    }

    // await addWorldAdmin(worldId, "userId placeholder")
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} autoHide>
      <Input placeholder="Search users" name="userName" register={register} />

      <div className="flex flex-row">
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={addAdmin}>
          Add
        </Button>
      </div>
    </Modal>
  );
};
