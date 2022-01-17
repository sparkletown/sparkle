interface TableRowAvatarProps {
  src: string;
}

export const TableRowAvatar: React.FC<TableRowAvatarProps> = ({ src }) => (
  <div className="flex-shrink-0 h-10 w-10">
    <img className="h-10 w-10 rounded-md" src={src} alt="" />
  </div>
);
