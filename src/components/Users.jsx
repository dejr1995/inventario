import { Outlet, useNavigate } from "react-router-dom";
import {
  AdminHeaders,
  PrimaryButton,
  SecondaryButton,
} from "./admin/CommonStyled";
import { useState } from "react";
import { useSelector } from "react-redux";

const Users = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [showCreateUser, setShowCreateUser] = useState(true);

  const handleCreateClick = () => {
    setShowCreateUser(false);
    navigate("/admin/users/create-user");
  };

  const handleCancelClick = () => {
    setShowCreateUser(true);
    navigate("/admin/users");
  };

  if (!auth.isAdmin) return <p>accesso denegado</p>;

  return (
    <>
      <AdminHeaders>
        Usuarios
        {showCreateUser ? (
          <PrimaryButton
            style={{ marginTop: "-10px", marginBottom: "10px" }}
            onClick={handleCreateClick}
          >
            Crear
          </PrimaryButton>
        ) : (
          <SecondaryButton onClick={handleCancelClick}>
            Regresar
          </SecondaryButton>
        )}
      </AdminHeaders>
      <Outlet />
    </>
  );
};

export default Users;
