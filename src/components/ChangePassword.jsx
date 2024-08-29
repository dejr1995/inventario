import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { PrimaryButton } from "../components/admin/CommonStyled";
import { userAdminEdit } from "../store/slices/UserSlice";

export default function ChangePassword() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const { editStatus } = useSelector((state) => state.users);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmValue = e.target.value;
    setConfirmPassword(confirmValue);
    setPasswordsMatch(password === confirmValue);
  };

  const cleanFields = () => {
    setPassword("");
    setConfirmPassword("");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordsMatch) {
      dispatch(
        userAdminEdit({
          user_id: auth.user_id,
          password: password,
        })
      );
      alert("Se cambio la contraseña con exito!");
      cleanFields();
    } else {
      alert("Las contraseñas no coinciden.");
    }
  };
  if (!auth.isAdmin) return <p>accesso denegado</p>;
  return (
    <div>
      <DialogTitle
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "-20px",
        }}
      >
        Cambiar Contraseña
      </DialogTitle>
      <StyledEditProduct>
        <StyledForm onSubmit={handleSubmit}>
          <input
            type="password"
            required
            placeholder="New Password"
            onChange={handlePasswordChange}
            value={password}
          />
          <input
            type="password"
            required
            placeholder="Confirm Password"
            onChange={handleConfirmPasswordChange}
            value={confirmPassword}
          />
          {!passwordsMatch && (
            <ErrorText>Las contraseñas no coinciden</ErrorText>
          )}
          <PrimaryButton type="submit" disabled={!passwordsMatch}>
            {editStatus === "pendiente" ? "actualizando" : "Guardar"}
          </PrimaryButton>
        </StyledForm>
      </StyledEditProduct>
    </div>
  );
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin-top: 2rem;
  padding: 50px;
  background-color: white;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;

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
  width: 100%;
  height: 300px;
  justify-content: center;
  align-items: center;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.875rem;
  margin: 0;
  padding: 0;
`;
