import { STRING_SPACE } from "settings";

import * as TW from "./AnalyticsOutput.tailwind";

export interface AnalyticsOutputProps {
  dataReportFileUrl: string;
}

export const AnalyticsOutput: React.FC<AnalyticsOutputProps> = ({
  dataReportFileUrl,
}) => {
  return (
    <div>
      <p>
        Data report file can be downloaded by the following link:{STRING_SPACE}
        <a className={TW.link} href={dataReportFileUrl}>
          Download
        </a>
      </p>
    </div>
  );
};
