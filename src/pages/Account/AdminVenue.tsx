import React, { useCallback, useState } from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";

export const AdminVenue: React.FC = () => {
  const [imageFileUrl, setImageFileUrl] = useState<string>(
    "https://www.printedtoday.co.uk/wp-content/uploads/2019/02/Pvc_Banners_Next_Day-1.png"
  );

  return (
    <WithNavigationBar>
      <div id="admin-venue" className="container admin-container">
        <div className="title">
          Create your space in{" "}
          <span className="title-adornment">The Sparkleverse</span>
        </div>
        <div className="form">
          <input
            name="email"
            className="wide-input-block"
            placeholder="Name your space"
          />
          <div className="url-text">The URL of your space will be: ...</div>
          <ImageInput imageUrl={imageFileUrl} onSetImage={setImageFileUrl} />
        </div>
      </div>
    </WithNavigationBar>
  );
};

interface ImageInputProps {
  imageUrl?: string;
  onSetImage: (val: string) => void;
  containerClassName?: string;
}

const ImageInput: React.FC<ImageInputProps> = (props) => {
  const { imageUrl, onSetImage, containerClassName } = props;

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length) return;
      const file = e.target.files[0];
      const fileUrl = URL.createObjectURL(file);
      onSetImage(fileUrl);
    },
    [onSetImage]
  );

  return (
    <div className={`image-input default-container ${containerClassName}`}>
      {imageUrl && <img className="default-image" src={imageUrl} />}
      <input
        type="file"
        accept="image/x-png,image/gif,image/jpeg"
        onChange={handleImageChange}
        className="default-input"
      />
    </div>
  );
};
