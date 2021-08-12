import React, { useCallback, useState } from "react";
import { Modal } from "react-bootstrap";
import classNames from "classnames";
import { ParseError, ParseMeta } from "papaparse";

import { parseCsv } from "utils/csv";

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
  const [parseData, setParseData] = useState<
    Record<string, string>[] | undefined
  >();
  const [parseMeta, setParseMeta] = useState<ParseMeta | undefined>();
  const [parseErrors, setParseErrors] = useState<ParseError[] | undefined>([]);
  const [isParsing, setIsParsing] = useState<boolean>(false);

  const clear = useCallback(() => {
    setParseData(undefined);
    setParseMeta(undefined);
    setParseErrors(undefined);
  }, []);

  const download = useCallback(() => {
    const link = document.createElement("a");
    link.download = "example.csv";
    link.href = "/csv/import-events-example.csv";
    link.click();
    link.remove();
  }, []);

  const onSelect = useCallback(
    async ({ file }: FileButtonOnChangeData) => {
      try {
        if (!file) return;

        setIsParsing(true);
        clear();
        const { meta, data } = await parseCsv(file);
        setParseMeta(meta);
        setParseData(data);
      } catch (errors) {
        setParseErrors(errors);
      } finally {
        setIsParsing(false);
      }
    },
    [clear]
  );

  const hasError = parseErrors && parseErrors.length > 0;

  const dialogClassName = classNames({
    "CsvImportModal CsvImportModal__dialog": true,
    "CsvImportModal--with-data": parseData,
    "CsvImportModal--with-error": hasError,
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
        {hasError && parseErrors?.length === 1 && (
          <div className="CsvImportModal__error CsvImportModal__error--single">
            <span className="CsvImportModal__error-static">
              There has been an error parsing the CSV file. Please make sure
              everything is OK before proceeding. Error:
            </span>
            <br />
            <span className="CsvImportModal__error-generated">
              {parseErrors[0].message}
            </span>
          </div>
        )}
        {hasError && parseErrors && parseErrors?.length > 1 && (
          <div className="CsvImportModal__error CsvImportModal__error--multiple">
            <span className="CsvImportModal__error-static">
              There have been multiple errors parsing the CSV file. Please make
              sure everything is OK before proceeding. Errors:
            </span>
            <br />
            <span className="CsvImportModal__error-generated">
              {parseErrors.map((e) => e.message).join(". ")}
            </span>
          </div>
        )}
        <div className="CsvImportModal__wrapper">
          {!parseData && (
            <span className="CsvImportModal__description">
              The result of parsing the CSV file will be displayed here. You can
              download an example to get you started
            </span>
          )}
          {parseData && (
            <table className="CsvImportModal__table">
              <tr>
                {parseMeta?.fields?.map((heading) => (
                  <th key={heading}>{heading}</th>
                ))}
              </tr>
              {parseData.map((row, key) => (
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
          onClick={download}
        >
          Download example CSV
        </ButtonNG>
        <FileButton
          className="CsvImportModal__select CsvImportModal__button"
          onChange={onSelect}
          loading={isParsing}
          disabled={isParsing}
        >
          Select CSV file...
        </FileButton>
        <ButtonNG
          className="CsvImportModal__clear CsvImportModal__button"
          onClick={clear}
          disabled={isParsing}
        >
          Clear
        </ButtonNG>
        <ButtonNG
          className="CsvImportModal__import CsvImportModal__button"
          title="Upload the selected events"
          type="submit"
          onClick={onAdd}
          variant="primary"
          disabled={isParsing}
        >
          Import
        </ButtonNG>
      </Modal.Footer>
    </Modal>
  );
};
