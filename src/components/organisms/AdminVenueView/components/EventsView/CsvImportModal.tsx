import React, { useCallback, useState } from "react";
import { Modal } from "react-bootstrap";
import { useAsyncFn } from "react-use";
import classNames from "classnames";
import { ParseError, ParseMeta } from "papaparse";

import { importEventsBatch, ImportEventsBatchResult } from "api/events";

import { parseCsv, ParseData, transformImportToEvents } from "utils/csv";

import { ButtonNG } from "components/atoms/ButtonNG/ButtonNG";
import {
  FileButton,
  FileButtonOnChangeData,
} from "components/atoms/FileButton/FileButton";

import "./CsvImportModal.scss";

export interface CsvImportModalProps {
  onHide: () => void;
  show: boolean;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  onHide,
  show,
}) => {
  const [parsedData, setParsedData] = useState<ParseData[] | undefined>();
  const [parsedMeta, setParsedMeta] = useState<ParseMeta | undefined>();
  const [parsedErrors, setParsedErrors] = useState<ParseError[] | undefined>();
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [importResult, setImportResult] = useState<ImportEventsBatchResult>();

  const clearParsed = useCallback(() => {
    setParsedData(undefined);
    setParsedMeta(undefined);
    setParsedErrors(undefined);
    setImportResult(undefined);
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

    setImportResult(undefined);
    const result = await importEventsBatch(transformImportToEvents(parsedData));
    setImportResult(result);
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
        {importResult && (
          <div className="CsvImportModal__result">
            <div className="CsvImportModal__result-count">
              The number of new events is {importResult.updateCount}.
            </div>
            {importResult.errors.length > 0 && (
              <div className="CsvImportModal__result-errors">
                Some events weren&apos;t addded due to invalid data. Please
                check lines:
                {" " +
                  importResult.errors
                    .map(({ index, reason }) => `#${index + 1} (${reason})`)
                    .join(", ")}
                .
              </div>
            )}
          </div>
        )}
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
                <th>#</th>
                {parsedMeta?.fields?.map((heading) => (
                  <th key={heading}>{heading}</th>
                ))}
              </tr>
              {parsedData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{rowIndex + 1}</td>
                  {Object.values(row).map((value, cellIndex) => (
                    <td key={cellIndex}>{value}</td>
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
