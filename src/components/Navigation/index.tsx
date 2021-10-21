import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import "./Navigation.css";
import { authService } from "../../firebase";
import { signOut } from "@firebase/auth";
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

  if (isHome) {
    return (
      <nav onMouseLeave={() => setIsMouseOver(false)}>
        <Link to={`/${userId}`}>
          <div onMouseOver={() => setIsMouseOver(true)}>
            <img src={userImage} alt="user" />
          </div>
        </Link>
        {isMouseOver && (
          <>
            <div className="logout" onClick={onSignOutClick}>
              logout
            </div>
          </>
        )}
      </nav>
    );
  } else {
    return (
      <nav>
        <Link to="/">Home</Link>
      </nav>
    );
  }
};

export default Navigation;
