import React from "react";

export interface AnalyticsOutputProps {
  dataReportFileUrl: string;
  allSpaceVisitsFileUrl: string;
  uniqueVenuesVisitedFileUrl: string;
}

export const AnalyticsOutput: React.FC<AnalyticsOutputProps> = ({
  dataReportFileUrl,
  allSpaceVisitsFileUrl,
  uniqueVenuesVisitedFileUrl,
}) => {
  return (
    <div>
      <p>
        Data report file can be downloaded by the following link:{" "}
        <a href={dataReportFileUrl}>Download</a>
      </p>
      <p>
        All space visits file can be downloaded by the following link:{" "}
        <a href={allSpaceVisitsFileUrl}>Download</a>
      </p>
      <p>
        Unique venues visited file can be downloaded by the following link:{" "}
        <a href={uniqueVenuesVisitedFileUrl}>Download</a>
      </p>
    </div>
  );
};
