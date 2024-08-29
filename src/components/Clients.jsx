import { Outlet, useNavigate } from "react-router-dom";
import {
  AdminHeaders,
  PrimaryButton,
  SecondaryButton,
} from "./admin/CommonStyled";
import { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../store/api";
import { useSelector } from "react-redux";

const Clients = () => {
  const navigate = useNavigate();

  const [switches, setSwitches] = useState({});
  const [status, setStatus] = useState("idle");
  const [showCreateClient, setShowCreateClient] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const permissionId = useSelector((state) => state.auth.role_id);

  useEffect(() => {
    if (permissionId) {
      setStatus("loading");
      axios
        .get(`${url}/permissions/switches/${permissionId}`)
        .then((response) => {
          setSwitches(response.data);
          setStatus("succeeded");
        })
        .catch((error) => {
          console.error("Error loading switches", error);
          setStatus("failed");
        });
    }
  }, [permissionId]);

  useEffect(() => {
    if (switches.switch_client_state) {
      setShowContent(true);
    } else {
      setShowContent(false);
    }
  }, [switches, status]);

  const handleCreateClick = () => {
    setShowCreateClient(false);
    navigate("/admin/clients/create-client");
  };

  const handleCancelClick = () => {
    setShowCreateClient(true);
    navigate("/admin/clients");
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error loading switches</div>;

  return (
    <>
      {showContent ? (
        <>
          <AdminHeaders>
            Clientes
            {showCreateClient && (
              <PrimaryButton
                style={{ marginTop: "-10px", marginBottom: "10px" }}
                onClick={handleCreateClick}
              >
                Crear
              </PrimaryButton>
            )}
            {!showCreateClient && (
              <SecondaryButton onClick={handleCancelClick}>
                Regresar
              </SecondaryButton>
            )}
          </AdminHeaders>
          <Outlet />
        </>
      ) : (
        <div>Acceso denegado</div>
      )}
    </>
  );
};

export default Clients;
