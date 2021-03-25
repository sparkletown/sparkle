import React from "react";
import { Document, Page, pdfjs } from "react-pdf";

import { TPoster } from "../../Posters";

import "./Poster.scss";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export interface PosterProps {
  poster: TPoster;
}

export const Poster: React.FC<PosterProps> = ({ poster }) => {
  const { title, pdfUrl, authors } = poster;

  return (
    <div className="poster">
      <Document file={pdfUrl}>
        <Page pageNumber={1} className="poster__pdf" height={200} />
      </Document>
      <p className="poster__title">{title}</p>
    </div>
  );
};
