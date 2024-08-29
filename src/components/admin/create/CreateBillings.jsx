import { useEffect, useState } from "react";
import styled from "styled-components";
import { PrimaryButton } from "../CommonStyled";
import { useDispatch, useSelector } from "react-redux";
import { billingsCreate } from "../../../store/slices/BillingSlice";

const CreateBillings = () => {
  const dispatch = useDispatch();

  const createdBillingId = useSelector(
    (state) => state.billings.createdBillingId
  );

  const [client, setClient] = useState("");
  const [amounttotal, setTotalAmount] = useState(0);
  const [payment, setPayment] = useState(0);
  const [amountpending, setDebt] = useState(0);
  const [billingsstatus, setStatus] = useState("");

  // Calculate debt whenever totalAmount or payment changes
  useEffect(() => {
    setDebt(amounttotal - payment);
  }, [amounttotal, payment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      billingsCreate({
        client,
        amounttotal,
        amountpending,
        billingsstatus,
      })
    );
  };

  return (
    <TableWrapper>
      <form onSubmit={handleSubmit}>
        <p>Cliente</p>
        <input
          type="text"
          required
          placeholder="Cliente"
          value={client}
          onChange={(e) => setClient(e.target.value)}
        />
        <p>Total a pagar</p>
        <input
          type="number"
          required
          placeholder="Monto Total a Pagar"
          value={amounttotal}
          onChange={(e) => setTotalAmount(parseFloat(e.target.value))}
        />
        <p>Pago</p>
        <input
          type="number"
          required
          placeholder="Pago"
          value={payment}
          onChange={(e) => setPayment(parseFloat(e.target.value))}
        />
        <p>Debe pagar</p>
        <input
          type="number"
          required
          placeholder="Debe pagar"
          value={amountpending}
          readOnly
        />
        <p>Estado</p>
        <input
          type="text"
          required
          placeholder="Estado"
          value={billingsstatus}
          onChange={(e) => setStatus(e.target.value)}
        />
        <PrimaryButton type="submit">Submit</PrimaryButton>
      </form>
      <p>Factura creada con ID: {createdBillingId}</p>
    </TableWrapper>
  );
};

export default CreateBillings;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  form {
    display: flex;
    flex-direction: column;
  }
  p {
    margin: 8px 0 4px;
  }
  input {
    margin-bottom: 12px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;
