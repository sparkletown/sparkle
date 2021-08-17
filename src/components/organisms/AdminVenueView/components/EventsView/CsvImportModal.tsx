import React, { useCallback, useMemo, useState } from "react";
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

  const [{ loading: isParsing }, selectFile] = useAsyncFn(
    async ({ file }: FileButtonOnChangeData) => {
      if (!file) return;

      clearParsed();
      const parsePromise = parseCsv(file);

      // regrettably, useAsyncFn doesn't consider rejection reason as anything but Error | undefined
      parsePromise.catch(setParsedErrors);

      const { meta, data } = await parsePromise;
      setParsedMeta(meta);
      setParsedData(data);
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

  const renderedHeaders = useMemo(
    () =>
      parsedMeta?.fields?.map((heading) => <th key={heading}>{heading}</th>),
    [parsedMeta]
  );

  const renderedRows = useMemo(
    () =>
      parsedData?.map((row, rowIndex) => (
        <tr key={rowIndex}>
          <td>{rowIndex + 1}</td>
          {Object.values(row).map((value, cellIndex) => (
            <td key={cellIndex}>{value}</td>
          ))}
        </tr>
      )),
    [parsedData]
  );

  const renderedImportResult = useMemo(
    () =>
      importResult && (
        <div className="CsvImportModal__result">
          <div className="CsvImportModal__result-count">
            The number of new events is {importResult.addedEventsCount}.
          </div>
          {importResult.errors.length > 0 && (
            <div className="CsvImportModal__result-errors">
              Some events weren&apos;t addded due to invalid data. Please check
              lines:
              {" " +
                importResult.errors
                  .map(({ index, reason }) => `#${index + 1} (${reason})`)
                  .join(", ")}
              .
            </div>
          )}
        </div>
      ),
    [importResult]
  );

  const renderedParseErrors = useMemo(
    () =>
      parsedErrors &&
      parsedErrors.length > 0 && (
        <div className="CsvImportModal__error">
          <span className="CsvImportModal__error-static">
            There {parsedErrors.length > 1 ? "have" : "has"} been
            {parsedErrors.length > 1 ? " multiple errors " : " an error "}
            parsing the CSV file. Please make sure everything is OK before
            proceeding.
            {parsedErrors.length > 1 ? " Errors" : " Error"}:
          </span>
          <br />
          <span className="CsvImportModal__error-generated">
            {parsedErrors.map((e) => e.message).join(". ")}
          </span>
        </div>
      ),
    [parsedErrors]
  );

  const isImportDisabled = isParsing || isImporting || !parsedData?.length;

  const dialogClassName = classNames({
    "CsvImportModal CsvImportModal__dialog": true,
    "CsvImportModal--with-data": parsedData,
    "CsvImportModal--with-error":
      (parsedErrors && parsedErrors.length > 0) || importError,
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
        {renderedImportResult}
        {importError && (
          <div className="CsvImportModal__error CsvImportModal__error--import">
            <span className="CsvImportModal__error-static">
              There has been an error importing the data. Error:
            </span>
            <br />
            <span className="CsvImportModal__error-generated">
              {`${importError.message}`}
            </span>
          </div>
        )}
        {renderedParseErrors}
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
                {renderedHeaders}
              </tr>
              {renderedRows}
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
          accept=".csv"
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
          disabled={isImportDisabled}
        >
          Import
        </ButtonNG>
      </Modal.Footer>
    </Modal>
  );
};
