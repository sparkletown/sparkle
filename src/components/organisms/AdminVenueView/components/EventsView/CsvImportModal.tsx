import React, { useCallback, useState } from "react";
import { Modal } from "react-bootstrap";
import { useAsyncFn } from "react-use";
import classNames from "classnames";
import { ParseError, ParseMeta } from "papaparse";

import { importEventsBatch } from "api/events";

import { parseCsv, ParseData, transformImportToEvents } from "utils/csv";

import { ButtonNG } from "components/atoms/ButtonNG/ButtonNG";
import { FileButton } from "components/atoms/FileButton";
import { FileButtonOnChangeData } from "components/atoms/FileButton/FileButton";

import "./CsvImportModal.scss";

export interface CsvImportModalProps {
  onAdd?: () => void;
  onHide: () => void;
  show: boolean;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  onAdd,
  onHide,
  show,
}) => {
  const [parsedData, setParsedData] = useState<ParseData[] | undefined>();
  const [parsedMeta, setParsedMeta] = useState<ParseMeta | undefined>();
  const [parsedErrors, setParsedErrors] = useState<ParseError[] | undefined>();
  const [isParsing, setIsParsing] = useState<boolean>(false);

  const clearParsed = useCallback(() => {
    setParsedData(undefined);
    setParsedMeta(undefined);
    setParsedErrors(undefined);
  }, []);

  const downloadExample = useCallback(() => {
    const link = document.createElement("a");
    link.download = "example.csv";
    link.href = "/csv/import-events-example.csv";
    link.click();
    link.remove();
  }, []);

  const selectFile = useCallback(
    async ({ file }: FileButtonOnChangeData) => {
      try {
        if (!file) return;

        setIsParsing(true);
        clearParsed();
        const { meta, data } = await parseCsv(file);
        setParsedMeta(meta);
        setParsedData(data);
      } catch (errors) {
        setParsedErrors(errors);
      } finally {
        setIsParsing(false);
      }
    },
    [clearParsed]
  );

  const [
    { loading: isImporting, error: importError },
    importEvents,
  ] = useAsyncFn(async () => {
    if (!parsedData) {
      return;
    }
    await importEventsBatch(transformImportToEvents(parsedData));
  }, [parsedData]);

  const hasParseError = parsedErrors && parsedErrors.length > 0;
  const hasImportError = !!importError;

  const dialogClassName = classNames({
    "CsvImportModal CsvImportModal__dialog": true,
    "CsvImportModal--with-data": parsedData,
    "CsvImportModal--with-error": hasParseError || hasImportError,
  });

  return (
    <Modal
      centered
      dialogClassName={dialogClassName}
      onHide={onHide}
      show={show}
    >
      <Modal.Header className="CsvImportModal__header">
        <Modal.Title className="CsvImportModal__title">
          Import from CSV
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="CsvImportModal__body">
        {hasImportError && (
          <div className="CsvImportModal__error CsvImportModal__error--import">
            <span className="CsvImportModal__error-static">
              There has been an error importing the data. Error:
            </span>
            <br />
            <span className="CsvImportModal__error-generated">
              {"" + importError?.message}
            </span>
          </div>
        )}
        {hasParseError && parsedErrors?.length === 1 && (
          <div className="CsvImportModal__error CsvImportModal__error--single">
            <span className="CsvImportModal__error-static">
              There has been an error parsing the CSV file. Please make sure
              everything is OK before proceeding. Error:
            </span>
            <br />
            <span className="CsvImportModal__error-generated">
              {parsedErrors[0].message}
            </span>
          </div>
        )}
        {hasParseError && parsedErrors && parsedErrors?.length > 1 && (
          <div className="CsvImportModal__error CsvImportModal__error--multiple">
            <span className="CsvImportModal__error-static">
              There have been multiple errors parsing the CSV file. Please make
              sure everything is OK before proceeding. Errors:
            </span>
            <br />
            <span className="CsvImportModal__error-generated">
              {parsedErrors.map((e) => e.message).join(". ")}
            </span>
          </div>
        )}
        <div className="CsvImportModal__wrapper">
          {!parsedData && (
            <span className="CsvImportModal__description">
              The result of parsing the CSV file will be displayed here. You can
              download an example to get you started
            </span>
          )}
          {parsedData && (
            <table className="CsvImportModal__table">
              <tr>
                {parsedMeta?.fields?.map((heading) => (
                  <th key={heading}>{heading}</th>
                ))}
              </tr>
              {parsedData.map((row, key) => (
                <tr key={key}>
                  {Object.values(row).map((value, key) => (
                    <td key={key}>{value}</td>
                  ))}
                </tr>
              ))}
            </table>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="CsvImportModal__footer">
        <ButtonNG
          className="CsvImportModal__example CsvImportModal__button"
          onClick={downloadExample}
        >
          Download example CSV
        </ButtonNG>
        <FileButton
          className="CsvImportModal__select CsvImportModal__button"
          onClick={selectFile}
          loading={isParsing}
          disabled={isParsing}
        >
          Select CSV file...
        </FileButton>
        <ButtonNG
          className="CsvImportModal__clear CsvImportModal__button"
          onClick={clearParsed}
          disabled={isParsing}
        >
          Clear
        </ButtonNG>
        <ButtonNG
          className="CsvImportModal__import CsvImportModal__button"
          title="Upload the selected events"
          type="submit"
          onClick={importEvents}
          variant="primary"
          loading={isImporting}
          disabled={isParsing || isImporting || !parsedData?.length}
        >
          Import
        </ButtonNG>
      </Modal.Footer>
    </Modal>
  );
};
