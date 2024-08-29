import { useState } from "react";
import styled from "styled-components";
import { PrimaryButton } from "../CommonStyled";
import { useDispatch } from "react-redux";
import { clientsCreate } from "../../../store/slices/ClientSlice";

const CreateClient = () => {
  const dispatch = useDispatch();

  const [ruc, setRuc] = useState("");
  const [email, setEmail] = useState("");
  const [names, setNames] = useState("");
  const [surnames, setSurnames] = useState("");
  const [address, setAddress] = useState("");

  const cleanFields = () => {
    setRuc("");
    setEmail("");
    setNames("");
    setSurnames("");
    setAddress("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      clientsCreate({
        ruc,
        email,
        names,
        surnames,
        address,
      })
    );
    cleanFields();
  };
  return (
    <StyledCreateProduct>
      <StyledForm onSubmit={handleSubmit}>
        <h3></h3>
        <input
          type="text"
          required
          placeholder="ruc"
          value={ruc}
          onChange={(e) => setRuc(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Nombres"
          value={names}
          onChange={(e) => setNames(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Apellidos"
          value={surnames}
          onChange={(e) => setSurnames(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Direccion"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <PrimaryButton type="submit">Registrar</PrimaryButton>
      </StyledForm>
    </StyledCreateProduct>
  );
};

export default CreateClient;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 300px;
  padding: 50px;
  margin-top: 2rem;
  justify-content: center;
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

const StyledCreateProduct = styled.div`
  display: flex;
  width: 100%;
  height: 460px;
  justify-content: center;
`;
