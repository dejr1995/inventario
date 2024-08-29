import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { PrimaryButton, SecondaryButton } from "../CommonStyled";
import { MdEdit } from "react-icons/md";
import { providersEdit } from "../../../store/slices/ProviderSlice";

export default function EditProvider({ providerId }) {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const { list, editStatus } = useSelector((state) => state.providers);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [direction, setDirection] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      providersEdit({
        provider_id: providerId,
        name: name,
        email: email,
        phone: phone,
        direction: direction,
      })
    );
  };

  const handleClickOpen = () => {
    setOpen(true);

    let selectedProvider = list.find((item) => item.provider_id === providerId);
    if (selectedProvider) {
      setName(selectedProvider.name_provider);
      setEmail(selectedProvider.email_provider);
      setPhone(selectedProvider.phone_provider);
      setDirection(selectedProvider.address_provider);
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
        <DialogTitle>Actualizar Datos de Proveedor</DialogTitle>
        <DialogContent>
          <StyledEditProduct>
            <StyledForm onSubmit={handleSubmit}>
              <input
                type="text"
                required
                placeholder="Nombre"
                onChange={(e) => setName(e.target.value)}
                value={name}
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
                placeholder="Telefono"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
              />
              <input
                type="text"
                required
                placeholder="Direccion"
                onChange={(e) => setDirection(e.target.value)}
                value={direction}
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
