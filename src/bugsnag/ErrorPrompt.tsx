// NOTE: do not include any other files here, try to keep this component separate from the rest

import React from "react";

import "./ErrorPrompt.scss";

const CHUNK_NOT_IN_CACHE = /Loading chunk [\d]+ failed/;

const LOAD_ERROR_TITLE = "Loading Error";
const LOAD_ERROR_MESSAGE = `
Apologies for the interruption.
There seems to be a problem loading necessary file for the proper functioning of this app.

This can happen if there has been an update.
Please try reloading the page to get the newer version.

In case the problem persists, please contact \u2728 Sparkle and provide the error details.
`;

const UNEXPECTED_ERROR_TITLE = "Unexpected Error";
const UNEXPECTED_ERROR_MESSAGE = `
You can try clearing the error in hope the app will keep working as expected
or if that doesn't help - reload the page.

In case the problem persists, please contact \u2728 Sparkle and provide the error details.
`;

interface ChunkLoadError extends Error {
  type?: string;
  request?: string;
}

export interface FallbackComponentProps {
  error: Error | ChunkLoadError;
  info: React.ErrorInfo;
  clearError: () => void;
}

export const isChunkLoadError = (error?: unknown): error is ChunkLoadError =>
  error instanceof Error && error.name === "ChunkLoadError";

export const ErrorPrompt: React.FC<FallbackComponentProps> = ({
  error,
  info,
  clearError,
}) => {
  const chunkLoadError = isChunkLoadError(error) ? error : undefined;

  // To avoid reload on syntax error, check the file is not in browser cache as well
  // @see https://github.com/webpack/webpack.js.org/issues/4479#issuecomment-649416798
  const isMissingInCache = CHUNK_NOT_IN_CACHE.test(error.message);

  const title =
    chunkLoadError && isMissingInCache
      ? LOAD_ERROR_TITLE
      : UNEXPECTED_ERROR_TITLE;

  const messageLines = (isMissingInCache
    ? LOAD_ERROR_MESSAGE
    : UNEXPECTED_ERROR_MESSAGE
  )
    .split("\n\n")
    .map((line, key) => <p key={key}>{line}</p>);

  return (
    <div className="ErrorPrompt">
      <div className="ErrorPrompt__modal">
        <h4 className="ErrorPrompt__title">{title}</h4>
        <div className="ErrorPrompt__row--vertical ErrorPrompt__message">
          {messageLines}
        </div>
        <div className="ErrorPrompt__row ErrorPrompt__buttons">
          {!isMissingInCache && (
            <button
              className="ErrorPrompt__button ErrorPrompt__button--normal"
              type="button"
              onClick={clearError}
            >
              Clear Error
            </button>
          )}

          <button
            className="ErrorPrompt__button ErrorPrompt__button--primary"
            type="button"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>

        {!isMissingInCache && (
          <div className="ErrorPrompt__row">
            <span className="ErrorPrompt__name">Error Description:</span>
            <span className="ErrorPrompt__value--inline">{error.message}</span>
          </div>
        )}
        {isMissingInCache && chunkLoadError && (
          <div className="ErrorPrompt__row">
            <span className="ErrorPrompt__name">Missing File:</span>
            <span className="ErrorPrompt__value--inline">
              {chunkLoadError.request}
            </span>
          </div>
        )}
        {isMissingInCache && chunkLoadError && (
          <div className="ErrorPrompt__row">
            <span className="ErrorPrompt__name">Type of Error:</span>
            <span className="ErrorPrompt__value--inline">
              {chunkLoadError.type}
            </span>
          </div>
        )}
        <div className="ErrorPrompt__row ErrorPrompt__row--vertical">
          <div className="ErrorPrompt__name">Component Stack:</div>
          <textarea className="ErrorPrompt__value--preformatted" readOnly>
            {info.componentStack}
          </textarea>
        </div>
      </div>
    </div>
  );
};
