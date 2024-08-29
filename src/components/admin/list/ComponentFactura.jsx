import { useState } from "react";
import ExistsList from "./ExistsList";
import { PrimaryButton } from "../CommonStyled";
import styled from "styled-components";
import FactureList from "./FactureList";
import { IoIosCloseCircle } from "react-icons/io";

const ComponentFactura = () => {
  const [showComponent, setShowComponent] = useState(false);

  const handleCreateInvoice = () => {
    setShowComponent(true);
  };

  const handleCloseInvoice = () => {
    setShowComponent(false);
  };

  return (
    <Componente>
      {!showComponent ? (
        <ButtonWrapper>
          <PrimaryButton onClick={handleCreateInvoice}>
            Crear Factura
          </PrimaryButton>
        </ButtonWrapper>
      ) : (
        <>
          <ButtonWrapper>
            <IoIosCloseCircle
              onClick={handleCloseInvoice}
              color="red"
              size={40}
              style={{
                marginBottom: "20px",
                marginTop: "5px",
                cursor: "pointer",
              }}
            />
          </ButtonWrapper>
          <ContentExists>
            <ExistsList />
          </ContentExists>
        </>
      )}
      <ContentBilling>
        <FactureList />
      </ContentBilling>
    </Componente>
  );
};

export default ComponentFactura;

const Componente = styled.div`
  display: flex;
  width: 950px;
  flex-direction: column;
`;

const ButtonWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: end;

  margin-top: -40px;
`;

const ContentExists = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: white;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
`;

const ContentBilling = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
`;
