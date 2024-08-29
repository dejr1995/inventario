import { useState } from "react";
import styled from "styled-components";
import { PrimaryButton } from "../CommonStyled";
import { useDispatch, useSelector } from "react-redux";
import { rolesCreate } from "../../../store/slices/RoleSlice";

const CreateRole = () => {
  const dispatch = useDispatch();

  const { createStatus } = useSelector((state) => state.roles);
  const [rolename, setRoleName] = useState("");

  const cleanFields = () => {
    setRoleName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      rolesCreate({
        rolename,
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
          placeholder="Rol"
          value={rolename}
          onChange={(e) => setRoleName(e.target.value)}
        />

        <PrimaryButton type="submit">
          {createStatus === "pendiente" ? "Guardando..." : "Guardar"}
        </PrimaryButton>
      </StyledForm>
    </StyledCreateProduct>
  );
};

export default CreateRole;

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
