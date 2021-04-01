import React, { useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import { WithPoster } from "types/posters";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { enterVenue } from "utils/url";

import "./Poster.scss";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export interface PosterProps {
  posterVenue: WithId<WithPoster<AnyVenue>>;
}

export const Poster: React.FC<PosterProps> = ({ posterVenue }) => {
  const { title, pdfUrl, author, categories } = posterVenue.poster;

  const enterPosterVenue = useCallback(() => enterVenue(posterVenue.id), [
    posterVenue.id,
  ]);

  return (
    <div className="poster">
      <div className="poster__pdf">
        <Document file={pdfUrl}>
          <Page pageNumber={0} />
        </Document>

        <div className="poster__pdf__actions">
          <button
            className="poster__pdf__actions__join-btn"
            onClick={enterPosterVenue}
          >
            Join
          </button>
        </div>
      </div>

      <p className="poster__title">{title}</p>
      {categories?.length > 0 && (
        <div className="poster__categories">
          {categories.map((category) => (
            <div
              key={category.title + category.color}
              className="poster__category"
              style={{
                backgroundColor: category.color,
              }}
            >
              {category.title}
            </div>
          ))}
        </div>
      )}
      {author && (
        <div className="poster__author">
          <div className="poster__author__name">{author.name}</div>
          <div className="poster__author__institution">
            {author.institution}
          </div>
        </div>
      )}
    </div>
  );
};
