import { useState } from "react";
import styled from "styled-components";
import { PrimaryButton } from "../CommonStyled";
import { useDispatch, useSelector } from "react-redux";
import { usersCreate } from "../../../store/slices/UserSlice";

const CreateUser = () => {
  const dispatch = useDispatch();
  const roles = useSelector((state) => state.roles.list);

  const [username, setUsername] = useState("");
  const [userrole, setUserRole] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const cleanFields = () => {
    setUsername("");
    setUserRole("");
    setPhone("");
    setPassword("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      usersCreate({
        username,
        userrole,
        phone,
        password,
      })
    );
    cleanFields();
  };
  return (
    <StyledCreateProduct>
      <StyledForm onSubmit={handleSubmit}>
        <input
          type="text"
          required
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <select onChange={(e) => setUserRole(e.target.value)}>
          <option value={userrole}>Seleccionar Rol</option>
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
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PrimaryButton type="submit">Registrar</PrimaryButton>
      </StyledForm>
    </StyledCreateProduct>
  );
};

export default CreateUser;

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
