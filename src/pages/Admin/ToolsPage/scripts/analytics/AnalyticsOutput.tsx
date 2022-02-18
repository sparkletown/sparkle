import React from "react";

export interface AnalyticsOutputProps {
  dataReportFileUrl: string;
}

export const AnalyticsOutput: React.FC<AnalyticsOutputProps> = ({
  dataReportFileUrl,
}) => {
  return (
    <div>
      <p>
        Data report file can be downloaded by the following link:{" "}
        <a href={dataReportFileUrl}>Download</a>
      </p>
    </div>
  );
};
