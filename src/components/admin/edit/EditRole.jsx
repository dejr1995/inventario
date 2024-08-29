import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { PrimaryButton, SecondaryButton } from "../CommonStyled";
import { rolesEdit } from "../../../store/slices/RoleSlice";
import { MdEdit } from "react-icons/md";

export default function EditRole({ roleId }) {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const { list, editStatus } = useSelector((state) => state.roles);

  const [rolename, setRoleName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      rolesEdit({
        role_id: roleId,
        rolename: rolename,
      })
    );
  };

  const handleClickOpen = () => {
    setOpen(true);

    let selectedRole = list.find((item) => item.role_id === roleId);
    if (selectedRole) {
      setRoleName(selectedRole.role_name);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Actions2>
        <MdEdit
          color="white"
          size={18}
          cursor={"pointer"}
          style={{ backgroundColor: "transparent" }}
          onClick={handleClickOpen}
        >
          edit
        </MdEdit>
      </Actions2>
      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="md">
        <DialogTitle>Actualizar Rol</DialogTitle>
        <DialogContent>
          <StyledEditProduct>
            <StyledForm onSubmit={handleSubmit}>
              <input
                type="text"
                required
                placeholder="Name"
                onChange={(e) => setRoleName(e.target.value)}
                value={rolename}
              />
              <PrimaryButton type="submit">
                {editStatus === "pendiente" ? "actualizando" : "Guardar"}
              </PrimaryButton>
            </StyledForm>
          </StyledEditProduct>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={handleClose}>cancel</SecondaryButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin-top: 2rem;

  select,
  input {
    padding: 7px;
    min-height: 30px;
    outline: none;
    border-radius: 5px;
    border: 1px solid rgb(182, 182, 182);
    margin: 0.3rem 0;

    &:focus {
      border: 2px solid rgb(0, 208, 255);
    }
  }

  select {
    color: rgb(95, 95, 95);
  }
`;

const StyledEditProduct = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Actions2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #4b70e2;
`;
