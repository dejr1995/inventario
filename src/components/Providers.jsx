import { Outlet, useNavigate } from "react-router-dom";
import {
  AdminHeaders,
  PrimaryButton,
  SecondaryButton,
} from "./admin/CommonStyled";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { url } from "../store/api";

const Providers = () => {
  const navigate = useNavigate();

  const [switches, setSwitches] = useState({});
  const [status, setStatus] = useState("idle");
  const [showCreateProvider, setShowCreateProvider] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const permissionId = useSelector((state) => state.auth.role_id);

  useEffect(() => {
    if (permissionId) {
      setStatus("loading");
      console.log(`Fetching switches for permissionId: ${permissionId}`); // Añadir este log
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
    if (switches.switch_provider_state) {
      setShowContent(true);
    } else {
      setShowContent(false);
    }
  }, [switches, status]);

  const handleCreateClick = () => {
    setShowCreateProvider(false);
    navigate("/admin/providers/create-provider");
  };

  const handleCancelClick = () => {
    setShowCreateProvider(true);
    navigate("/admin/providers");
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error loading switches</div>;

  return (
    <>
      {showContent ? (
        <>
          <AdminHeaders>
            Proveedores
            {showCreateProvider && (
              <PrimaryButton
                style={{ marginTop: "-10px", marginBottom: "10px" }}
                onClick={handleCreateClick}
              >
                Crear
              </PrimaryButton>
            )}
            {!showCreateProvider && (
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

export default Providers;
