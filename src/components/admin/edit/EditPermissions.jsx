// components/EditPermissions.js
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { SecondaryButton } from "../CommonStyled";
import { FormControlLabel, Switch } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSwitches,
  updateSwitches,
} from "../../../store/slices/SwitchesSlice";
import { FaLockOpen } from "react-icons/fa";

export default function EditPermissions({ permissionId }) {
  const dispatch = useDispatch();
  const switches = useSelector((state) => state.switches.switches);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    dispatch(fetchSwitches({ permissionId }));
  }, [dispatch, permissionId]);

  const handleSwitchChange = (switchName, checked) => {
    const updatedSwitches = { ...switches, [switchName]: checked };
    dispatch(updateSwitches({ permissionId, switchStates: updatedSwitches }));
  };

  return (
    <div>
      <FaLockOpen
        color="white"
        size={18}
        cursor={"pointer"}
        style={{ backgroundColor: "transparent" }}
        onClick={handleClickOpen}
      />

      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="md">
        <div>
          <DialogTitle>Gestion de clientes</DialogTitle>
          <StyledPermission>
            <div className="permissions-switch">
              <p>Clientes</p>
              <FormControlLabel
                control={<Switch checked={switches.switch_client_state} />}
                onChange={(e) =>
                  handleSwitchChange("switch_client_state", e.target.checked)
                }
              />
            </div>
          </StyledPermission>
        </div>
        <div>
          <DialogTitle>Gestión de productos</DialogTitle>
          <StyledPermission>
            <div className="permissions-switch">
              <p>Categorías</p>
              <FormControlLabel
                control={<Switch checked={switches.switch_category_state} />}
                onChange={(e) =>
                  handleSwitchChange("switch_category_state", e.target.checked)
                }
              />
            </div>
            <div className="permissions-switch">
              <p>Productos</p>
              <FormControlLabel
                control={<Switch checked={switches.switch_product_state} />}
                onChange={(e) =>
                  handleSwitchChange("switch_product_state", e.target.checked)
                }
              />
            </div>
            <div className="permissions-switch">
              <p>Proveedores</p>
              <FormControlLabel
                control={<Switch checked={switches.switch_provider_state} />}
                onChange={(e) =>
                  handleSwitchChange("switch_provider_state", e.target.checked)
                }
              />
            </div>
          </StyledPermission>
        </div>
        <div>
          <DialogTitle>Gestión de existencias</DialogTitle>
          <StyledPermission>
            <div className="permissions-switch">
              <p>Entradas</p>
              <FormControlLabel
                control={<Switch checked={switches.switch_entrance_state} />}
                onChange={(e) =>
                  handleSwitchChange("switch_entrance_state", e.target.checked)
                }
              />
            </div>
            <div className="permissions-switch">
              <p>Salidas/Facturación</p>
              <FormControlLabel
                control={<Switch checked={switches.switch_exist_state} />}
                onChange={(e) =>
                  handleSwitchChange("switch_exist_state", e.target.checked)
                }
              />
            </div>
          </StyledPermission>
        </div>
        <div>
          <DialogTitle>Gestión de usuarios</DialogTitle>
          <StyledPermission>
            <div className="permissions-switch">
              <p>Gestión de roles</p>
              <FormControlLabel
                control={<Switch checked={switches.switch_role_state} />}
                onChange={(e) =>
                  handleSwitchChange("switch_role_state", e.target.checked)
                }
              />
            </div>
            <div className="permissions-switch">
              <p>Usuarios</p>
              <FormControlLabel
                control={<Switch checked={switches.switch_user_state} />}
                onChange={(e) =>
                  handleSwitchChange("switch_user_state", e.target.checked)
                }
              />
            </div>
          </StyledPermission>
        </div>
        <div>
          <DialogTitle>Gestion de reportes</DialogTitle>
          <StyledPermission>
            <div className="permissions-switch">
              <p>Reportes</p>
              <FormControlLabel
                control={<Switch checked={switches.switch_report_state} />}
                onChange={(e) =>
                  handleSwitchChange("switch_report_state", e.target.checked)
                }
              />
            </div>
          </StyledPermission>
        </div>
        <DialogActions>
          <SecondaryButton onClick={handleClose}>Cancelar</SecondaryButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const StyledPermission = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  height: 300px;
  overflow-y: auto;
`;
