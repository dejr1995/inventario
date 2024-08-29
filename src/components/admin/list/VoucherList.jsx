import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import styled from "styled-components";
import { useEffect, useState } from "react";
import {
  billingFetchByIdBilling,
  billingsXfacturasById,
} from "../../../store/slices/BillingSlice";
import { AiFillPrinter } from "react-icons/ai";
import { createTheme, ThemeProvider } from "@mui/material";
import { SecondaryButton } from "../CommonStyled";
import { useNavigate } from "react-router-dom";
import { paymentXbilling } from "../../../store/slices/PaymentSlice";

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

const formatAmount = (amount) => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-columnHeader:focus": {
            outline: "none",
          },
        },
      },
    },
  },
});

const VoucherList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const billing =
    useSelector((state) => state.billings.singleBillingXfactura) || {};
  const payments = useSelector((state) => state.payments.list);

  const [filter, setFilter] = useState("");

  const [showCreateVoucher, setShowCreateVoucher] = useState(true);

  const handleCreateClick = () => {
    setShowCreateVoucher(false);
    navigate("/admin/exists");
  };

  const [selectedId, setSelectedId] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [readyToPrint, setReadyToPrint] = useState(false);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredPayments = payments.filter((payment) =>
    formatPaymentId(payment.payment_id)
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  useEffect(() => {
    dispatch(billingsXfacturasById(1));
  }, [dispatch]);

  useEffect(() => {
    dispatch(billingFetchByIdBilling());
  }, [dispatch]);

  useEffect(() => {
    if (selectedId !== null) {
      dispatch(paymentXbilling(selectedId));
    }
  }, [dispatch, selectedId]);

  useEffect(() => {
    if (payments.length >= 0) {
      setReadyToPrint(true);
    }
  }, [payments]);

  useEffect(() => {
    if (readyToPrint && selectedInvoice) {
      const printWindow = window.open("", "", "width=800,height=600");

      const formattedDate = new Date(selectedInvoice.created_at).toLocaleString(
        "es-ES",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      );

      printWindow.document.write(`
        <html>
          <head>
            <title>Imprimir Factura</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h2, p { margin: 0 0 10px; };
              table {
                width: 100%;
                border-collapse: collapse;
              }
              h1, h3 { text-align: center }
              th, td {
                padding: 8px 12px;
                border: 1px solid #ddd;
                text-align: left;
              }
              th {
                background-color: #f4f4f4;
              }
              .div-total {
                margin-top: 20px;
                display: flex;
                flex-direction: column;
                margin-left: auto;
                width: fit-content;
              }
              .info-client {border-top: 1px solid #ddd; padding-top: 20px}
              .text-p {display: flex; gap: 10px }
              .p-1 {font-weight: bold}
              .text-p1 {border-top: 1px solid #ddd}
              .p-2 {font-weight: bold; margin-top: 10px}
              .p-3 {font-weight: bold; text-align: right}
            </style>
          </head>
          <body>
            <div>
              <h1>Recibo N°: ${formatPaymentId(selectedInvoice.id)}</h1>
              
              <div class="info-client">                
                <p>Informacion del cliente</p>
                <div class="text-p"><p class="p-1">DNI/RUC:</p><p>${
                  billing.ruc_id
                }</p></div>
                <div class="text-p"><p class="p-1">Cliente:</p><p>${
                  billing.first_name
                } ${billing.last_name}</p></div>      
                <div class="text-p"><p class="p-1">Direccion:</p><p>${
                  billing.address
                }</p></div>
              </div>
              <p class="p-3">Recibo N° : ${formatPaymentId(
                selectedInvoice.id
              )}</p> 
              <p class="p-3">Fecha: ${formattedDate}</p>            
              
              <div class="div-total">
                <div class="text-p1"><p class="p-2">Factura N°:</p><p>${formatBillingId(
                  selectedInvoice.billing_id
                )}</p></div>
                <div class="text-p1"><p class="p-2">Monto Adeudado:</p><p>${formatAmount(
                  billing.amount_total
                )}</p></div>
                <div class="text-p1"><p class="p-2">Monto Pagado:</p><p>${formatAmount(
                  selectedInvoice.amount_paid
                )}</p></div>
                <div class="text-p1"><p class="p-2">Saldo pendiente:</p><p>${formatAmount(
                  billing.amount_pending
                )}</p></div>
                <div class="text-p1"><p class="p-2">Metodo de pago</p><p>${
                  selectedInvoice.payment_method
                }</p></div>
                <div class="text-p1"><p class="p-2">Referencia de Pago</p><p>${
                  selectedInvoice.payment_reference
                }</p></div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      setReadyToPrint(false);
    }
  }, [readyToPrint, selectedInvoice, payments]);

  const handlePrint = (row) => {
    setSelectedId(row.id);
    setSelectedInvoice(row);
    setReadyToPrint(true);
  };

  const columns = [
    {
      field: "id",
      headerName: "Boleta",
      width: 60,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{formatPaymentId(params.value)}</span>
      ),
    },
    {
      field: "billing_id",
      headerName: "Factura",
      width: 60,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{formatBillingId(params.value)}</span>
      ),
    },
    {
      field: "created_at",
      headerName: "Fecha",
      width: 100,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>
          {new Date(params.value).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </span>
      ),
    },
    {
      field: "amount_paid",
      headerName: "Pagado",
      width: 100,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "payment_method",
      headerName: "Metodo de pago",
      width: 150,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "payment_reference",
      headerName: "Referencia de pago",
      width: 300,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "actions",
      headerName: "Imprimir",
      width: 70,
      renderCell: (params) => {
        return (
          <Actions>
            <AiFillPrinter
              color="white"
              size={18}
              cursor={"pointer"}
              style={{ backgroundColor: "transparent" }}
              onClick={() => handlePrint(params.row)}
            />
          </Actions>
        );
      },
    },
  ];

  const rows = filteredPayments.map((payment, index) => ({
    id: payment.payment_id || index,
    billing_id: payment.billing_id,
    amount_paid: payment.amount_paid,
    payment_method: payment.payment_method,
    payment_reference: payment.payment_reference,
    created_at: payment.created_at,
  }));

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <input
            placeholder="Ingrese un codigo de boleta ..."
            style={{
              width: "300px",
              borderRadius: "8px",
              padding: "8px",
              border: "1px solid #ccc",
              outline: "none",
            }}
            value={filter}
            onChange={handleFilterChange}
          ></input>
          {showCreateVoucher && (
            <SecondaryButton onClick={handleCreateClick}>
              Regresar
            </SecondaryButton>
          )}
        </div>
        <StyledDataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      </Container>
    </ThemeProvider>
  );
};

export default VoucherList;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e27d4b;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 460px;
  width: 100%;
  padding: 20px;
  margin-top: 20px;
  background-color: white;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
`;

const StyledDataGrid = styled(DataGrid)`
  width: 100%;
  max-width: 900px; /* Limita el ancho máximo */
  border-top: 1px solid #ddd;
  padding-top: 20px;
`;
