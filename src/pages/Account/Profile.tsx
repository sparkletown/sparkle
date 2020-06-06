import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { updateUserProfile } from "./helpers";
import "firebase/storage";
import "./Account.scss";
import { useFirebase } from "react-redux-firebase";

export interface ProfileFormData {
  partyName: string;
  pictureUrl: string;
}

const Profile = () => {
  const history = useHistory();
  const firebase = useFirebase();
  const { user } = useSelector((state: any) => ({
    user: state.user,
  }));
  const {
    register,
    handleSubmit,
    errors,
    formState,
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    mode: "onChange",
  });

  const onSubmit = async (data: ProfileFormData) => {
    await updateUserProfile(user.uid, data);
    history.push("/account/questions");
  };

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    const storageRef = firebase.storage().ref();
    // TODO: add rule to forbid other users to edit a user's image
    const profilePictureRef = storageRef.child(
      `/users/${user.uid}/${file.name}`
    );
    const uploadedProfilePicture = await profilePictureRef.put(file);
    const pictureUrl = await uploadedProfilePicture.ref.getDownloadURL();
    setValue("pictureUrl", pictureUrl, true);
  };

  const pictureUrl = watch("pictureUrl");

  return (
    <div className="page-container">
      <div className="coreality-logo-sparkles"></div>
      <div className="login-container">
        <h2>Well done! Now create your party profile</h2>
        <p>
          Choose your party bio carefully, we don’t have edit functionality
          yet! 
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="input-group profile-form">
            <input
              name="partyName"
              className="input-block input-centered"
              placeholder="Your party name"
              ref={register({
                required: true,
                maxLength: 16,
              })}
            />
            <span className="input-info">
              This is your public party name (max 16 characters)
            </span>
            {errors.partyName && errors.partyName.type === "required" && (
              <span className="input-error">Party name is required</span>
            )}
            {errors.partyName && errors.partyName.type === "maxLength" && (
              <span className="input-error">
                Party name is less than 16 characters
              </span>
            )}
            <div className="profile-picture-upload-form">
              <div className="profile-picture-preview-container">
                {pictureUrl ? (
                  <img
                    src={pictureUrl}
                    className="profile-picture-preview"
                    alt="your profile"
                  />
                ) : (
                  <img
                    src="/default-profile-pic.png"
                    className="profile-picture-preview"
                    alt="default profile"
                  />
                )}
              </div>

              <input
                type="file"
                id="profile-picture-input"
                name="profilePicture"
                onChange={handleFileChange}
                className="profile-picture-input"
              />
              <label
                htmlFor="profile-picture-input"
                className="profile-picture-button"
              >
                Upload a profile pic
              </label>
              {errors.pictureUrl && errors.pictureUrl.type === "required" && (
                <span className="input-error">Profile picture is required</span>
              )}
              <small>
                This will be your public party avatar appearing on the party map
              </small>
              <input
                type="hidden"
                name="pictureUrl"
                className="profile-picture-input"
                ref={register({
                  required: true,
                })}
              />
            </div>
          </div>
          <input
            className="btn btn-primary btn-block btn-centered"
            type="submit"
            value="Create profile"
            disabled={!formState.isValid}
          />
        </form>
      </div>
    </div>
  );
};

export default Profile;
