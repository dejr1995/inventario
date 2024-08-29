import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import styled from "styled-components";
import { useEffect, useState } from "react";
import {
  existDelete,
  existFetchByIdFactura,
} from "../../../store/slices/ExistSlice";
import { billingFetchByIdBilling } from "../../../store/slices/BillingSlice";
import { MdDelete } from "react-icons/md";
import { AiFillPrinter } from "react-icons/ai";
import { createTheme, ThemeProvider } from "@mui/material";
import { businessFetchById } from "../../../store/slices/BusinessSlice";
import EditPay from "../edit/EditPay";
import { useNavigate } from "react-router-dom";
import EditPayments from "../edit/EditPayments";
import SalesXcategories from "../graphics/SalesXcategories";
import SalesXYear from "../graphics/SalesXYear";

const formatBillingId = (id) => {
  const idStr = id.toString();
  if (idStr.length === 1) {
    return `F00${id}`;
  } else if (idStr.length === 2) {
    return `F0${id}`;
  } else {
    return `F${id}`;
  }
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

const FactureList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const billings = useSelector((state) => state.billings.billings);
  const facturas = useSelector((state) => state.exists.facturas);

  const [filter, setFilter] = useState("");

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredBillings = billings.filter((billing) =>
    formatBillingId(billing.billingId)
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  const [showCreateVoucher, setShowCreateVoucher] = useState(true);

  const handleCreateClick = () => {
    setShowCreateVoucher(false);
    navigate("/admin/exists/list-exists");
  };

  const [businessname, setBusinessName] = useState("");
  const [addressname, setAddressName] = useState("");
  const [cityname, setCityName] = useState("");
  const [countryname, setCountryName] = useState("");
  const [codpostal, setCodPostal] = useState("");
  const [phonecontact, setPhoneContact] = useState("");

  const [selectedId, setSelectedId] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [readyToPrint, setReadyToPrint] = useState(false);

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

  useEffect(() => {
    dispatch(billingFetchByIdBilling());
  }, [dispatch]);

  useEffect(() => {
    if (selectedId !== null) {
      dispatch(existFetchByIdFactura(selectedId));
    }
  }, [dispatch, selectedId]);

  useEffect(() => {
    if (facturas.length > 0) {
      setReadyToPrint(true);
    }
  }, [facturas]);

  useEffect(() => {
    if (readyToPrint && selectedInvoice) {
      const printWindow = window.open("", "", "width=800,height=600");
      const facturaDetails = facturas
        .map(
          (factura) => `
          <tr key=${factura.id}>
            <td>${factura.name_category}</td>
            <td>${factura.name_product}</td>
            <td>${factura.amount}</td>
            <td>${factura.price_product.toFixed(2)}</td>
            <td>${factura.discount_amount_quantity.toFixed(2)}</td>
            <td>${factura.amount_total.toFixed(2)}</td>
          </tr>
        `
        )
        .join("");

      // Formatear la fecha
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

      const formatAmount = (amount) => {
        return new Intl.NumberFormat("es-PE", {
          style: "currency",
          currency: "PEN",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount);
      };
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
              <h1>${businessname}</h1>
              <h3>${addressname}, ${cityname}-${countryname},Cod. Postal: ${codpostal}</h3>
              <h3>${phonecontact}</h3>
              <div class="info-client">                
                <p>Informacion del cliente</p>
                <div class="text-p"><p class="p-1">DNI/RUC:</p><p>${
                  selectedInvoice.ruc_id
                }</p></div>
                <div class="text-p"><p class="p-1">Cliente:</p><p>${
                  selectedInvoice.first_name
                } ${selectedInvoice.last_name}</p></div>      
                <div class="text-p"><p class="p-1">Direccion:</p><p>${
                  selectedInvoice.address
                }</p></div>
              </div>
              <p class="p-3">Factura N° : ${formatBillingId(
                selectedInvoice.id
              )}</p> 
              <p class="p-3">Fecha: ${formattedDate}</p>            
              <table class="invoice-table">
                <thead>
                  <tr>
                    <th>Categoria</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio por unidad</th>
                    <th>Descuento</th>
                    <th>Precio total</th>
                  </tr>
                </thead>
                <tbody>
                  ${facturaDetails}
                </tbody>
              </table>
              <div class="div-total">
                <div class="text-p1"><p class="p-2">Subtotal:</p><p>${formatAmount(
                  selectedInvoice.amount_subtotal_discount
                )}</p></div>
                <div class="text-p1"><p class="p-2">Descuento:</p><p>${formatAmount(
                  selectedInvoice.amount_total_discount
                )}</p></div>
                <div class="text-p1"><p class="p-2">Total a pagar:</p><p>${formatAmount(
                  selectedInvoice.amount_total
                )}</p></div>
                <div class="text-p1"><p class="p-2">Tipo de pago:</p><p>${
                  selectedInvoice.billings_status
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
  }, [readyToPrint, selectedInvoice, facturas]);

  const handlePrint = (row) => {
    setSelectedId(row.id);
    setSelectedInvoice(row);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar este pago?"
    );
    if (confirmDelete) {
      dispatch(existDelete(id));
      //dispatch(paymentsForBilling(paymentsId));
    }
  };

  const columns = [
    {
      field: "id",
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
      field: "first_name",
      headerName: "Cliente",
      width: 100,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "amount_total",
      headerName: "Monto total",
      width: 100,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "payment",
      headerName: "Pagado",
      width: 100,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "amount_pending",
      headerName: "Pendiente",
      width: 100,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "billings_status",
      headerName: "Estado",
      width: 90,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "payments",
      headerName: "Pagos",
      width: 70,
      renderCell: (params) => {
        return <EditPayments paymentsId={params.row.id} />;
      },
    },
    {
      field: "paid",
      headerName: "Abonar",
      width: 70,
      renderCell: (params) => {
        return <EditPay existsId={params.row.id} />;
      },
    },
    /*{
      field: "edit",
      headerName: "Editar",
      width: 70,
      renderCell: (params) => {
        return <EditExists existsId={params.row.id} />;
      },
    },*/
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
    {
      field: "delete",
      headerName: "Eliminar",
      width: 70,
      renderCell: (params) => {
        return (
          <Actions1>
            <MdDelete
              color="white"
              size={18}
              cursor={"pointer"}
              style={{ backgroundColor: "transparent" }}
              onClick={() => handleDelete(params.row.id)}
            />
          </Actions1>
        );
      },
    },
  ];

  const rows = filteredBillings.map((billing, index) => ({
    id: billing.billingId || index,
    ruc_id: billing.ruc_id,
    first_name: billing.first_name,
    last_name: billing.last_name,
    email_address: billing.email_address,
    phone_number: billing.phone_number,
    address: billing.address,
    amount_total: billing.amount_total,
    payment: billing.payment,
    amount_pending: billing.amount_pending,
    billings_status: billing.billings_status,
    amount_total_discount: billing.amount_total_discount,
    amount_subtotal_discount: billing.amount_subtotal_discount,
    created_at: billing.created_at,
  }));

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <input
            placeholder="Ingrese un codigo de factura ..."
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
          <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
            <SalesXYear />
            <SalesXcategories />
          </div>
          {showCreateVoucher && (
            <BoletasBottom onClick={handleCreateClick}>Boletas</BoletasBottom>
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

export default FactureList;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e27d4b;
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 460px;
  width: 100%;
  padding: 20px;
  background-color: white;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  margin-top: 10px;
`;

const StyledDataGrid = styled(DataGrid)`
  width: 100%;
  max-width: 900px; /* Limita el ancho máximo */
  border-top: 1px solid #ddd;
  padding-top: 20px;
`;

export const BoletasBottom = styled.button`
  padding: 9px 12px;
  border-radius: 5px;
  font-weight: 400;
  letter-spacing: 1.15px;
  background-color: #4b70e2;
  color: #f9f9f9;
  border: none;
  outline: none;
  cursor: pointer;
`;
