import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { PrimaryButton, SecondaryButton } from "../CommonStyled";
import { MdEdit } from "react-icons/md";
import { clientsEdit } from "../../../store/slices/ClientSlice";

export default function EditClient({ clientId }) {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const { list, editStatus } = useSelector((state) => state.clients);
  const users = useSelector((state) => state.users.list);

  const [user, setUser] = useState("");
  const [ruc, setRuc] = useState("");
  const [email, setEmail] = useState("");
  const [names, setNames] = useState("");
  const [surnames, setSurnames] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      clientsEdit({
        client_id: clientId,
        user: user,
        ruc: ruc,
        email: email,
        names: names,
        surnames: surnames,
        address: address,
      })
    );
  };

  const handleClickOpen = () => {
    setOpen(true);

    let selectedClient = list.find((item) => item.client_id === clientId);
    if (selectedClient) {
      setUser(selectedClient.user_id);
      setRuc(selectedClient.ruc_id);
      setEmail(selectedClient.email_address);
      setNames(selectedClient.first_name);
      setSurnames(selectedClient.last_name);
      setAddress(selectedClient.address);
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
        <DialogTitle>Actualizar Datos de Cliente</DialogTitle>
        <DialogContent>
          <StyledEditProduct>
            <StyledForm onSubmit={handleSubmit}>
              <select value={user} onChange={(e) => setUser(e.target.value)}>
                <option value={""}>Seleccionar Usuario</option>
                {users.map((item) => (
                  <option key={item.user_id} value={item.user_id}>
                    {item.user_handle}
                  </option>
                ))}
              </select>
              <input
                type="text"
                required
                placeholder="ruc"
                onChange={(e) => setRuc(e.target.value)}
                value={ruc}
              />
              <input
                type="text"
                required
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <input
                type="text"
                required
                placeholder="Nombres"
                onChange={(e) => setNames(e.target.value)}
                value={names}
              />
              <input
                type="text"
                required
                placeholder="Name"
                onChange={(e) => setSurnames(e.target.value)}
                value={surnames}
              />
              <input
                type="text"
                required
                placeholder="Direccion"
                onChange={(e) => setAddress(e.target.value)}
                value={address}
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
