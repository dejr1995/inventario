import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { PrimaryButton, SecondaryButton } from "../CommonStyled";
import { MdEdit } from "react-icons/md";
import { clientsEdit } from "../../../store/slices/ClientSlice";

export default function EditExists({ existsId }) {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const { list, editStatus } = useSelector((state) => state.billings);
  const clients = useSelector((state) => state.clients.list);

  const [client, setClient] = useState("");
  const [amounttotal, setAmounTotal] = useState("");
  const [payment, setPayment] = useState("");
  const [amountpending, setAmountPending] = useState("");
  const [billingsstatus, setBillingsStatus] = useState("");
  const [amounttotaldiscount, setAmountTotalDiscount] = useState("");
  const [amountsubtotaldiscount, setAmountSubTotalDiscount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      clientsEdit({
        billing_id: existsId,
        client: client,
        amounttotal: amounttotal,
        payment: payment,
        amountpending: amountpending,
        billingsstatus: billingsstatus,
        amounttotaldiscount: amounttotaldiscount,
        amountsubtotaldiscount: amountsubtotaldiscount,
      })
    );
  };

  const handleClickOpen = () => {
    setOpen(true);

    let selectedBilling = list.find((item) => item.billing_id === existsId);
    if (selectedBilling) {
      setClient(selectedBilling.client_id);
      setAmounTotal(selectedBilling.amount_total);
      setPayment(selectedBilling.payment);
      setAmountPending(selectedBilling.amount_pending);
      setBillingsStatus(selectedBilling.billings_status);
      setAmountTotalDiscount(selectedBilling.amount_total_discount);
      setAmountSubTotalDiscount(selectedBilling.amount_subtotal_discount);
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
        <DialogTitle>Actualizar Datos de Factura</DialogTitle>
        <DialogContent>
          <StyledEditProduct>
            <StyledForm onSubmit={handleSubmit}>
              <select
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
              <input
                type="text"
                required
                placeholder="Monto_total"
                onChange={(e) => setAmounTotal(e.target.value)}
                value={amounttotal}
              />
              <input
                type="text"
                required
                placeholder="Pago"
                onChange={(e) => setPayment(e.target.value)}
                value={payment}
              />
              <input
                type="text"
                required
                placeholder="Monto_pendiente"
                onChange={(e) => setAmountPending(e.target.value)}
                value={amountpending}
              />
              <input
                type="text"
                required
                placeholder="Estado"
                onChange={(e) => setBillingsStatus(e.target.value)}
                value={billingsstatus}
              />
              <input
                type="text"
                required
                placeholder="Descuento_total"
                onChange={(e) => setAmountTotalDiscount(e.target.value)}
                value={amounttotaldiscount}
              />
              <input
                type="text"
                required
                placeholder="Subtotal"
                onChange={(e) => setAmountSubTotalDiscount(e.target.value)}
                value={amountsubtotaldiscount}
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
