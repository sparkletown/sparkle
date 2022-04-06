import classNames from "classnames";

import CN from "./MainSection.module.scss";

interface MainSectionProps {
  isBlurred?: boolean;
}

export const MainSection: React.FC<MainSectionProps> = ({
  children,
  isBlurred,
}) => {
  return (
    <section className={classNames(CN.general, isBlurred && CN.blur)}>
      {children}
    </section>
  );
};
