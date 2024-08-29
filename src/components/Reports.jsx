import { Outlet } from "react-router-dom";
import { AdminHeaders } from "./admin/CommonStyled";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { url } from "../store/api";

const Reports = () => {
  const [switches, setSwitches] = useState({});
  const [status, setStatus] = useState("idle");
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
    if (switches.switch_report_state) {
      setShowContent(true);
    } else {
      setShowContent(false);
    }
  }, [switches, status]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error loading switches</div>;

  return (
    <>
      {showContent ? (
        <>
          <AdminHeaders>Crear Reporte</AdminHeaders>
          <Outlet />
        </>
      ) : (
        <div>Acceso denegado</div>
      )}
    </>
  );
};

export default Reports;
