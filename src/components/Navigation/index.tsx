import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { authService } from "../../firebase";
import { signOut } from "@firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const NavWrapper = styled.nav`
  display: flex;
  flex-direction: column;
  position: fixed;
  right: 0;
  top: 0;
`;

const UserImg = styled.img`
  border-radius: 50%;
  border: #666 1px solid;
  height: 50px;
  width: 50px;
  margin: 10px 10px;
`;

const Logout = styled.div`
  border: 1px solid #6666;
  background-color: #6666;
  border-radius: 5px;
  padding: 5px 5px;
  transition: ease 0.5;
  text-align: center;
  cursor: pointer;
  &:hover {
  }
`;

const HoverText = styled.span`
  ${Logout}:hover & {
    border-bottom: 1px solid #ffffff;
  }
`;

interface NavigationProps {
  userImage: string;
  userId: string;
}
const Navigation: React.FunctionComponent<NavigationProps> = ({
  userImage,
  userId,
}): JSX.Element => {
  const [isHome, setIsHome] = useState(true);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      setIsHome(true);
    } else {
      setIsHome(false);
    }
  }, [location]);

  const onSignOutClick = async () => {
    signOut(authService);
  };

  return (
    <NavWrapper onMouseLeave={() => setIsMouseOver(false)}>
      {isHome ? (
        <>
          <Link to={`/${userId}`}>
            <div onMouseOver={() => setIsMouseOver(true)}>
              <UserImg src={userImage} alt="user" />
            </div>
          </Link>
          {isMouseOver && (
            <>
              <Logout onClick={onSignOutClick}>
                <HoverText>Logout</HoverText>
              </Logout>
            </>
          )}
        </>
      ) : (
        <Link to="/">
          <FontAwesomeIcon icon={faHome} />
        </Link>
      )}
    </NavWrapper>
  );
};

export default Navigation;
