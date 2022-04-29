import React, { useCallback, useMemo } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useAsyncFn } from "react-use";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { Section } from "components/admin/Section";
import { SectionHeading } from "components/admin/SectionHeading";
import { SectionTitle } from "components/admin/SectionTitle";
import { parse } from "csv-parse/browser/esm/sync";
import * as Yup from "yup";

import { ADMIN_IA_SPACE_EDIT_PARAM_URL } from "settings";

import { PosterDetails, uploadPosters } from "api/admin";

import { SpaceWithId, WorldId } from "types/id";

import { generateUrl } from "utils/url";

import { useManagedSpaces } from "hooks/spaces/useManagedSpaces";
import { useWorldParams } from "hooks/worlds/useWorldParams";

import { Button } from "../Button";
import { Input } from "../Input";
import { InputGroup } from "../InputGroup";
import { TablePanel } from "../TablePanel";

const csvUploadSchema = Yup.object().shape({
  csvFile: Yup.mixed().required("File is required"),
});

interface ChannelConfigurationProps {
  space: SpaceWithId;
}

export const PosterConfiguration: React.FC<ChannelConfigurationProps> = ({
  space,
}) => {
  const { worldSlug } = useWorldParams();
  const history = useHistory();
  const { register, handleSubmit, control } = useForm({
    reValidateMode: "onChange",
    resolver: yupResolver(csvUploadSchema),
  });
  const { errors } = useFormState({ control });
  const { managedSpaces, isLoading: isLoadingSpaces } = useManagedSpaces({
    worldId: space.worldId as WorldId,
    spaceId: space.id,
  });

  const [
    { loading: isUpdating, error: updateError, value: result },
    updatePosters,
  ] = useAsyncFn(async (data) => {
    const csvFiles = data.csvFile;
    if (!csvFiles.length) {
      throw new Error("Must provide a file to upload");
    }
    const fileContents = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = reject;

      reader.readAsText(data.csvFile[0]);
    });

    const posterRecords: PosterDetails[] = parse(fileContents, {
      columns: (header) =>
        header.map(
          (column: unknown) =>
            ({
              NAME: "name",
              THUMBNAIL: "thumbnailUrl",
              DESCRIPTION: "description",
              "EMBED URL": "embedUrl",
              "POSTER ID": "posterId",
            }[String(column).toUpperCase()])
        ),
      skip_empty_lines: true,
    });

    posterRecords.forEach((posterRecord, idx) => {
      if (!posterRecord.posterId || !posterRecord.posterId.length) {
        throw new Error(
          `Poster ID not specified at row ${idx} starting from 0`
        );
      }
      if (!posterRecord.name) {
        throw new Error(`Name not specified at row ${idx} starting from 0`);
      }
      if (!posterRecord.thumbnailUrl) {
        throw new Error(
          `Thumbnail URL not specified at row ${idx} starting from 0`
        );
      }
      if (!posterRecord.embedUrl) {
        throw new Error(
          `Embed URL not specified at row ${idx} starting from 0`
        );
      }
    });

    return await uploadPosters({
      posters: posterRecords,
      ownerSpaceId: space.id,
    });
  });

  const gotoSpace = useCallback(
    (space: SpaceWithId) => {
      const url = generateUrl({
        route: ADMIN_IA_SPACE_EDIT_PARAM_URL,
        required: ["worldSlug", "spaceSlug"],
        params: {
          worldSlug,
          spaceSlug: space.slug,
        },
      });
      history.push(url);
    },
    [history, worldSlug]
  );

  const spaceRows = useMemo(
    () =>
      managedSpaces.map((managedSpace) => (
        <TablePanel.Row key={managedSpace.id}>
          <TablePanel.Cell>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {managedSpace.name}
              </div>
            </div>
          </TablePanel.Cell>
          <TablePanel.ActionsCell>
            <div
              className="flex items-center flex-row cursor-pointer"
              onClick={() => gotoSpace(managedSpace)}
            >
              <FontAwesomeIcon
                icon={faPen}
                className="flex-shrink-0 mr-1.5 h-5 w-5 text-black"
              />
              <span className="text-black text-sm hover:text-indigo-900">
                Edit
              </span>
            </div>
          </TablePanel.ActionsCell>
        </TablePanel.Row>
      )),
    [gotoSpace, managedSpaces]
  );

  return (
    <>
      <Section>
        <SectionHeading>
          <SectionTitle>Upload Posters</SectionTitle>
        </SectionHeading>
        <h4>Upload CSV</h4>
        <p>
          This CSV must contain the following columns with the exact column
          title as below:
        </p>
        <ul className="list-disc list-inside">
          <li>Name - The name of the poster</li>
          <li>
            Thumbnail - A link to an image to use as a thumbnail for the poster
          </li>
          <li>Embed URL - The URL to embed inside the poster</li>
          <li>Description - Description of the poster</li>
          <li>
            Poster ID - Numeric ID for the poster. This is so that repeating
            uploads will update the existing poster rather than create a new one
          </li>
        </ul>
        <p className="text-red-700">
          {/* https://stackoverflow.com/questions/62401911/can-a-file-be-changed-after-it-has-already-been-selected-in-input-type-file */}
          If you save the file you MUST select a different file and then select
          the once you want again. This is due to a flaw in how browsers work.
        </p>
        <form onSubmit={handleSubmit(updatePosters)}>
          <InputGroup
            title="CSV file"
            subtitle="See note above on format"
            isRequired
            withLabel
          >
            <Input
              placeholder="Space Name"
              register={register}
              name="csvFile"
              errors={errors}
              required
              type="file"
            />
          </InputGroup>
          <Button
            type="submit"
            variant="primary"
            loading={isUpdating}
            disabled={isUpdating}
          >
            {isUpdating ? "Uploading..." : "Upload"}
          </Button>
          {updateError && (
            <p className="text-red-700">
              There was an error uploading: {updateError.message}
            </p>
          )}
          {result && (
            <p>
              Created: {result.data.created}, updated: {result.data.updated},
              deleted: {result.data.deleted}
            </p>
          )}
        </form>
      </Section>
      {!isLoadingSpaces && (
        <Section>
          <SectionHeading>
            <SectionTitle>Posters</SectionTitle>
          </SectionHeading>
          <TablePanel.Panel>
            <TablePanel.Body>{spaceRows}</TablePanel.Body>
          </TablePanel.Panel>
        </Section>
      )}
    </>
  );
};
