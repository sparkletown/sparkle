import "./LogoRF.scss";

export const LogoRF = () => {
  const logoClasses = "LogoRF__logo";

  return (
    <div className="LogoRF">
      <img
        className={`${logoClasses}-small LogoRF__logo-small--left-top`}
        src="/sparkle-icon-wide-sm.svg"
        alt="sparkle logo"
      />
      <img
        className={`${logoClasses}-small LogoRF__logo-small--left-bottom`}
        src="/sparkle-icon-wide-sm.svg"
        alt="sparkle logo"
      />
      <img
        className={logoClasses}
        src="/sparkle-icon-wide.svg"
        alt="sparkle logo"
      />
      <img
        className={`${logoClasses}-small LogoRF__logo-small--right-top`}
        src="/sparkle-icon-wide-sm.svg"
        alt="sparkle logo"
      />
    </div>
  );
};
