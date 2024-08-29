import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { logoutUser } from "../store/slices/AuthSlice";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser(null));
    navigate("/");
  };
  return (
    <nav className="nav-bar">
      <Link to="/admin/exists">
        <h3 style={{ color: "white" }}>Inventario</h3>
      </Link>
      {auth.user_id ? (
        <Links>
          {auth.isAdmin ? (
            <div>
              <Link to="/admin/roles">
                <p style={{ color: "white" }}>admin</p>
              </Link>
            </div>
          ) : (
            <Link to="/admin/clients">Tu cuenta</Link>
          )}
          <div onClick={handleLogout}>logout</div>
        </Links>
      ) : (
        <AuthLinks>
          <Link to="/">login</Link>
        </AuthLinks>
      )}
    </nav>
  );
};

export default NavBar;

const AuthLinks = styled.div`
  a {
    &:last-child {
      margin-left: 2rem;
    }
  }
`;

const Links = styled.div`
  color: white;
  display: flex;

  div {
    cursor: pointer;

    &:last-child {
      margin-left: 2rem;
    }
  }
`;
