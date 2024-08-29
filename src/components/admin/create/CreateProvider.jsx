import { useState } from "react";
import styled from "styled-components";
import { PrimaryButton } from "../CommonStyled";
import { useDispatch } from "react-redux";
import { providersCreate } from "../../../store/slices/ProviderSlice";

const CreateProvider = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [direction, setDirection] = useState("");

  const cleanFields = () => {
    setName("");
    setEmail("");
    setPhone("");
    setDirection("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      providersCreate({
        name,
        email,
        phone,
        direction,
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
          placeholder="Proveedor"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          placeholder="Telefono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Direccion"
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
        />
        <PrimaryButton type="submit">Registrar</PrimaryButton>
      </StyledForm>
    </StyledCreateProduct>
  );
};

export default CreateProvider;

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

const StyledCreateProduct = styled.div`
  display: flex;
  width: 100%;
  height: 460px;
  justify-content: center;
`;
