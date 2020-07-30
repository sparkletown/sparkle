import React, { useCallback, useState } from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";

const LONG_DESCRIPTION_PLACEHOLDER =
  "Describe what is unique andwonderful and sparkling about your venue";

export const AdminVenue: React.FC = () => {
  const [imageBannerUrl, setImageBannerUrl] = useState<string>(
    "https://www.printedtoday.co.uk/wp-content/uploads/2019/02/Pvc_Banners_Next_Day-1.png"
  );
  const [imageLogoUrl, setImageLogoUrl] = useState<string>(
    "https://www.printedtoday.co.uk/wp-content/uploads/2019/02/Pvc_Banners_Next_Day-1.png"
  );

  return (
    <WithNavigationBar>
      <div id="admin-venue" className="container admin-container">
        <h3 className="title">
          Create your space in{" "}
          <span className="title-adornment">The Sparkleverse</span>
        </h3>
        <div className="form">
          <div className="input-container">
            <div className="input-title">Name your space</div>
            <input
              className="wide-input-block"
              placeholder="This can't be changed in the future"
            />
            <div className="input-subtext">
              The URL of your space will be: ...
            </div>
          </div>
          <div className="input-container">
            <div className="input-title">Upload a banner page photo</div>
            <ImageInput
              imageUrl={imageBannerUrl}
              onSetImage={setImageBannerUrl}
            />
          </div>
          <div className="input-container">
            <div className="input-title">Upload a square logo</div>
            <ImageInput
              containerClassName="input-logo-container"
              imageClassName="input-logo-image"
              imageUrl={imageLogoUrl}
              onSetImage={setImageLogoUrl}
            />
          </div>
          <div className="input-container">
            <div className="input-title">Tagline</div>
            <input
              className="wide-input-block"
              placeholder="Briefly say what people will find here"
            />
          </div>
          <div className="input-container">
            <div className="input-title">Long description</div>
            <textarea
              className="wide-input-block input-centered align-left"
              placeholder={LONG_DESCRIPTION_PLACEHOLDER}
            />
          </div>
        </div>
      </div>
    </WithNavigationBar>
  );
};

interface ImageInputProps {
  imageUrl?: string;
  onSetImage: (val: string) => void;
  containerClassName?: string;
  imageClassName?: string;
}

const ImageInput: React.FC<ImageInputProps> = (props) => {
  const { imageUrl, onSetImage, containerClassName, imageClassName } = props;

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
      {imageUrl && (
        <img className={`default-image ${imageClassName}`} src={imageUrl} />
      )}
      <input
        type="file"
        accept="image/x-png,image/gif,image/jpeg"
        onChange={handleImageChange}
        className="default-input"
      />
    </div>
  );
};
