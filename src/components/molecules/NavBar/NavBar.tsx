import React, { useState } from "react";
import "./NavBar.scss";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isChatValid } from "validation";
import { OverlayTrigger, Popover } from "react-bootstrap";
import PrivateChatModal from "components/organisms/PrivateChatModal";
import ProfileModal from "components/organisms/ProfileModal";

interface PropsType {
  redirectionUrl?: string;
}

const NavBar: React.FunctionComponent<PropsType> = ({ redirectionUrl }) => {
  const { user, users, privateChats } = useSelector((state: any) => ({
    user: state.user,
    users: state.firestore.data.users,
    privateChats: state.firestore.ordered.privatechats,
  }));

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const popover = (
    <Popover id="popover-basic">
      <Popover.Content>
        <PrivateChatModal />
      </Popover.Content>
    </Popover>
  );

  const numberOfUnreadMessages =
    privateChats &&
    user &&
    privateChats
      .filter(isChatValid)
      .filter((chat: any) => chat.to === user.uid && chat.isRead === false)
      .length;

  return (
    <>
      <header>
        <nav className="navbar fixed-top navbar-expand-lg navbar-dark navbar-container">
          <Link to={redirectionUrl || "/"}>
            <span className="navbar-brand title">
              <img
                className="sparkle-icon"
                src="/sparkle-header.png"
                alt="Sparkle collective"
              />
            </span>
          </Link>
          {user && user.email && users && users[user.uid] && (
            <div className="icons-container">
              <OverlayTrigger
                trigger="click"
                placement="bottom-end"
                overlay={popover}
                rootClose={true}
              >
                <span className="private-chat-icon">
                  {!!numberOfUnreadMessages && numberOfUnreadMessages > 0 && (
                    <div className="notification-card">
                      {numberOfUnreadMessages}
                    </div>
                  )}
                  <FontAwesomeIcon icon={faCommentAlt} />
                </span>
              </OverlayTrigger>
              <div
                className="profile-icon-container"
                onClick={() => setIsProfileModalOpen(true)}
              >
                <img
                  src={users[user.uid].pictureUrl}
                  className="profile-icon"
                  alt="avatar"
                  width="40"
                  height="40"
                />
              </div>
            </div>
          )}
        </nav>
      </header>
      <ProfileModal
        show={isProfileModalOpen}
        onHide={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};

export default NavBar;
