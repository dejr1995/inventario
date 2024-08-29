import { Outlet, useNavigate } from "react-router-dom";
import {
  AdminHeaders,
  PrimaryButton,
  SecondaryButton,
} from "./admin/CommonStyled";
import { useState } from "react";
import { useSelector } from "react-redux";

const Roles = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [showCreateRole, setShowCreateRole] = useState(true);

  const handleCreateClick = () => {
    setShowCreateRole(false);
    navigate("/admin/roles/create-role");
  };

  const handleCancelClick = () => {
    setShowCreateRole(true);
    navigate("/admin/roles");
  };

  if (!auth.isAdmin) return <p>accesso denegado</p>;

  return (
    <>
      <AdminHeaders>
        Gestion de Roles
        {showCreateRole ? (
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

export default Roles;
