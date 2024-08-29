import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { SecondaryButton } from "../CommonStyled";
import { MdDelete } from "react-icons/md";
import {
  clearLastPaymentAsync,
  paymentsDelete,
  paymentsForBilling,
} from "../../../store/slices/PaymentSlice";
import { IoMdEye } from "react-icons/io";

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

const formatPaymentId = (id) => {
  const idStr = id.toString();
  if (idStr.length === 1) {
    return `B00${id}`;
  } else if (idStr.length === 2) {
    return `B0${id}`;
  } else {
    return `B${id}`;
  }
};

export default function EditPayments({ paymentsId }) {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const list = useSelector((state) => state.payments.list);

  const handleClickOpen = () => {
    setOpen(true);
    dispatch(paymentsForBilling(paymentsId));
    console.log(list);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(clearLastPaymentAsync());
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar este pago?"
    );
    if (confirmDelete) {
      dispatch(paymentsDelete(id)).then(() => {
        dispatch(paymentsForBilling(paymentsId));
      });
    }
  };

  return (
    <div>
      <Actions3>
        <IoMdEye
          color="white"
          size={18}
          cursor={"pointer"}
          style={{ backgroundColor: "transparent" }}
          onClick={handleClickOpen}
        ></IoMdEye>
      </Actions3>
      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="md">
        <TableWrapper>
          <div>
            <DialogTitle>
              Pagos de Factura N°: {formatBillingId(paymentsId)}
            </DialogTitle>
            {list && list.length > 0 ? (
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table>
                  <thead>
                    <tr>
                      <th>Cod. Boleta</th>
                      <th>Importe</th>
                      <th>Pago con</th>
                      <th>Fecha</th>
                      <th>Eliminar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((payment) => (
                      <tr key={payment.payment_id}>
                        <td>{formatPaymentId(payment.payment_id)}</td>
                        <td>{payment.amount_paid}</td>
                        <td>{payment.payment_method}</td>
                        <td>
                          {new Date(payment.created_at).toLocaleDateString(
                            "es-ES",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}
                        </td>
                        <td>
                          <Actions1>
                            <MdDelete
                              color="white"
                              size={18}
                              cursor={"pointer"}
                              style={{ backgroundColor: "transparent" }}
                              onClick={() => handleDelete(payment.payment_id)}
                            />
                          </Actions1>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ marginLeft: "25px" }}>En proceso...</p>
            )}
          </div>
        </TableWrapper>
        <DialogActions>
          <SecondaryButton onClick={handleClose}>Cerrar</SecondaryButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const Actions3 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #4bcde2;
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

const Actions1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e24b4b;
`;
