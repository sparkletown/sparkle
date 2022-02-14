import React from "react";

export interface AddWorldOwnerOutputProps {
  userEmail: string;
}

export const AddWorldOwnerOutput: React.FC<AddWorldOwnerOutputProps> = ({
  userEmail,
}) => {
  return (
    <div>
      <p>{userEmail} was successfully added as a world owner!</p>
    </div>
  );
};
