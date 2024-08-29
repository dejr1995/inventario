import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { PrimaryButton, SecondaryButton } from "../CommonStyled";
import { MdEdit } from "react-icons/md";
import { usersEdit } from "../../../store/slices/UserSlice";

export default function EditUser({ userId }) {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const { list, editStatus } = useSelector((state) => state.users);
  const roles = useSelector((state) => state.roles.list);

  const [username, setUsername] = useState("");
  const [userrole, setUserRole] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      usersEdit({
        user_id: userId,
        username: username,
        userrole: userrole,
        phone: phone,
        password: password,
      })
    );
  };

  const handleClickOpen = () => {
    setOpen(true);

    let selectedUser = list.find((item) => item.user_id === userId);
    if (selectedUser) {
      setUsername(selectedUser.user_handle);
      setUserRole(selectedUser.role_id);
      setPhone(selectedUser.phone_number);
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
        ></MdEdit>
      </Actions2>
      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="md">
        <DialogTitle>Actualizar Datos de Usuario</DialogTitle>
        <DialogContent>
          <StyledEditProduct>
            <StyledForm onSubmit={handleSubmit}>
              <input
                type="text"
                required
                placeholder="Nombre de Usuario"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
              <select
                value={userrole}
                onChange={(e) => setUserRole(e.target.value)}
              >
                <option value={""}>Seleccionar Rol</option>
                {roles.slice(0, -1).map((item) => (
                  <option key={item.role_id} value={item.role_id}>
                    {item.role_name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                required
                placeholder="Telefono"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
              />
              <input
                type="text"
                required
                placeholder="New Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
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
