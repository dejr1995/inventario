import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { PrimaryButton } from "../CommonStyled";
import {
  businessEdit,
  businessFetchById,
} from "../../../store/slices/BusinessSlice";

export default function EditBusiness() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { singleBusiness, editStatus } = useSelector((state) => state.business);

  const [businessname, setBusinessName] = useState("");
  const [addressname, setAddressName] = useState("");
  const [cityname, setCityName] = useState("");
  const [countryname, setCountryName] = useState("");
  const [codpostal, setCodPostal] = useState("");
  const [phonecontact, setPhoneContact] = useState("");

  useEffect(() => {
    const fetchBusiness = async () => {
      const resultAction = await dispatch(
        businessFetchById("0a0f5f0a-0b06-4938-8843-c8a96c06f734")
      );
      if (businessFetchById.fulfilled.match(resultAction)) {
        const business = resultAction.payload;
        setBusinessName(business.business_name);
        setAddressName(business.address_name);
        setCityName(business.city_name);
        setCountryName(business.country_name);
        setCodPostal(business.cod_postal);
        setPhoneContact(business.phone_contact);
      }
    };
    fetchBusiness();
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      businessEdit({
        business_id: singleBusiness.business_id,
        businessname: businessname,
        addressname: addressname,
        cityname: cityname,
        countryname: countryname,
        codpostal: codpostal,
        phonecontact: phonecontact,
      })
    );
  };
  if (!auth.isAdmin) return <p>accesso denegado</p>;
  return (
    <div>
      <DialogTitle
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "-30px",
        }}
      >
        Actualizar Datos de la Empresa
      </DialogTitle>
      <StyledEditProduct>
        <StyledForm onSubmit={handleSubmit}>
          <input
            type="text"
            required
            placeholder="Nombre de la Empresa"
            onChange={(e) => setBusinessName(e.target.value)}
            value={businessname}
          />
          <input
            type="text"
            required
            placeholder="Direccion Especifica"
            onChange={(e) => setAddressName(e.target.value)}
            value={addressname}
          />
          <input
            type="text"
            required
            placeholder="Nombre de la Ciudad"
            onChange={(e) => setCityName(e.target.value)}
            value={cityname}
          />
          <input
            type="text"
            required
            placeholder="Nombre del Pais"
            onChange={(e) => setCountryName(e.target.value)}
            value={countryname}
          />
          <input
            type="text"
            required
            placeholder="Codigo Postal"
            onChange={(e) => setCodPostal(e.target.value)}
            value={codpostal}
          />
          <input
            type="text"
            required
            placeholder="Telefono de Contacto"
            onChange={(e) => setPhoneContact(e.target.value)}
            value={phonecontact}
          />
          <PrimaryButton type="submit">
            {editStatus === "pending" ? "Actualizando" : "Guardar"}
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
  height: 460px;
  justify-content: center;
`;
