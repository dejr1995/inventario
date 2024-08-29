import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { PrimaryButton } from "../CommonStyled";
import { MdAttachMoney } from "react-icons/md";
import { billingsEdit } from "../../../store/slices/BillingSlice";
import {
  paymentsAllFetch,
  paymentsCreate,
} from "../../../store/slices/PaymentSlice";

const formatBillingId = (id) => {
  const idStr = id.toString();
  if (idStr.length === 1) {
    return `F00${id}`;
  } else if (id.length === 2) {
    return `F0${id}`;
  } else {
    return `F${id}`;
  }
};

export default function EditPay({ existsId }) {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const list = useSelector((state) => state.billings.list);
  const clients = useSelector((state) => state.clients.list);

  const [client, setClient] = useState("");
  const [amountpaid, setAmountPaid] = useState("");
  const [paymetmethod, setPaymentMethod] = useState("");
  const [paymentreference, setPaymentReference] = useState("");

  const [amounttotal, setAmounTotal] = useState("");
  const [payment, setPayment] = useState("");
  const [amountpending, setAmountPending] = useState("");

  useEffect(() => {
    dispatch(paymentsAllFetch());
  }, [dispatch, list]);

  useEffect(() => {
    if (amountpaid) {
      setAmountPending(
        (prevAmountPending) => Number(prevAmountPending) - Number(amountpaid)
      );
      setPayment((prevPayment) => Number(prevPayment) + Number(amountpaid));
    }
  }, [amountpaid]);

  const cleanFields = () => {
    setAmountPaid("");
    setPaymentMethod("");
    setPaymentReference("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !amountpending ||
      !amountpaid ||
      !amounttotal ||
      !paymetmethod ||
      !paymentreference
    ) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    if (amountpending > 0) {
      dispatch(
        billingsEdit({
          billing_id: existsId,
          amounttotal: amounttotal,
          payment: payment,
          amountpending: amountpending,
        })
      );
      dispatch(
        paymentsCreate({
          billing: existsId,
          client: client,
          amountpaid: amountpaid,
          paymetmethod: paymetmethod,
          paymentreference: paymentreference,
        })
      ).then(() => {
        cleanFields();
        alert("Pago realizado exitosamente!");
        handleClose();
      });
    } else {
      console.log("La factura ya ha sido pagada");
    }
  };

  const handleClickOpen = () => {
    setOpen(true);

    let selectedBilling = list.find((item) => item.billing_id === existsId);
    if (selectedBilling) {
      setClient(selectedBilling.client_id);
      setAmounTotal(selectedBilling.amount_total);
      setPayment(selectedBilling.payment);
      setAmountPending(selectedBilling.amount_pending);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Actions3>
        <MdAttachMoney
          color="white"
          size={18}
          cursor={"pointer"}
          style={{ backgroundColor: "transparent" }}
          onClick={handleClickOpen}
        ></MdAttachMoney>
      </Actions3>
      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="md">
        <TableWrapper>
          <div>
            <DialogTitle>
              Pagos de Factura N°: {formatBillingId(existsId)}
            </DialogTitle>
            <DialogTitle>
              Cliente:{" "}
              <select
                disabled
                value={client}
                onChange={(e) => setClient(e.target.value)}
              >
                <option value={""}>Seleccionar Cliente</option>
                {clients.map((item) => (
                  <option key={item.client_id} value={item.client_id}>
                    {item.first_name + " " + item.last_name}
                  </option>
                ))}
              </select>
            </DialogTitle>
          </div>
        </TableWrapper>
        <DialogContent>
          <StyledEditProduct>
            <StyledForm onSubmit={handleSubmit}>
              <p style={{ marginBottom: "5px" }}>Monto a pagar:</p>
              <input
                style={{ marginBottom: "10px" }}
                type="text"
                placeholder="Monto a pagar"
                onChange={(e) => setAmountPaid(e.target.value)}
                value={amountpaid}
              />
              <p style={{ marginBottom: "5px" }}>Metodo de pago:</p>
              <select
                style={{ marginBottom: "10px" }}
                value={paymetmethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value={""}>Seleccionar metodo de pago</option>
                <option value={"Efectivo"}>Efectivo</option>
                <option value={"Tarjeta"}>Tarjeta de Credito/Debito</option>
                <option value={"Transferencia"}>Transferencia</option>
              </select>
              <p style={{ marginBottom: "5px" }}>Referencia:</p>
              <input
                style={{ marginBottom: "10px" }}
                type="text"
                placeholder="Referencia"
                onChange={(e) => setPaymentReference(e.target.value)}
                value={paymentreference}
              />
              <PrimaryButton type="submit">Emitir Recibo</PrimaryButton>
            </StyledForm>
          </StyledEditProduct>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 300px;

  select,
  input {
    padding: 7px;
    min-height: 30px;
    outline: none;
    border-radius: 5px;
    border: 1px solid rgb(182, 182, 182);

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

const Actions3 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e29b4b;
`;

const TableWrapper = styled.div`
  width: 100%;
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    padding: 3px 8px;
    border: 1px solid #ddd;
    text-align: left;
  }
  th {
    background-color: #f4f4f4;
  }
`;
