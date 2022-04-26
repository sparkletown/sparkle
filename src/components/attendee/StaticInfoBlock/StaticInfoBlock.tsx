import styles from "./StaticInfoBlock.module.scss";

interface StaticInfoBlockProps {
  title: string;
  subtitle?: string;
}

export const StaticInfoBlock: React.FC<StaticInfoBlockProps> = ({
  title,
  subtitle,
}) => (
  <div className={styles.container}>
    <h2 className={styles.title}>{title}</h2>
    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
  </div>
);
