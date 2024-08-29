import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import styled from "styled-components";
import { MdDelete } from "react-icons/md";
import { createTheme, ThemeProvider } from "@mui/material";
import { clientsDelete } from "../../../store/slices/ClientSlice";
import EditClient from "../edit/EditClient";
import { useEffect, useState } from "react";
import { clientsFetchByBilling } from "../../../store/slices/BillingSlice";

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

const ClientsList = () => {
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.billings.clientsx);

  const [filter, setFilter] = useState("");

  useEffect(() => {
    dispatch(clientsFetchByBilling());
  }, [dispatch, clients]);

  if (!clients) {
    return <p>Cargando clientes...</p>;
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredClients = clients.filter((client) =>
    client.first_name.toLowerCase().includes(filter.toLowerCase())
  );

  const columns = [
    {
      field: "first_name",
      headerName: "Cliente",
      width: 200,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "total_amount",
      headerName: "Importe comprado",
      width: 100,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "payment",
      headerName: "Importe pagado",
      width: 100,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "amount_pending",
      headerName: "importe deuda",
      width: 300,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "edit",
      headerName: "Editar",
      width: 70,
      renderCell: (params) => {
        return <EditClient clientId={params.row.id} />;
      },
    },
    {
      field: "delete",
      headerName: "Eliminar",
      width: 100,
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

  const handleDelete = (id) => {
    dispatch(clientsDelete(id));
  };

  const rows = filteredClients.map((client, index) => ({
    id: client.client_id || index,
    first_name: client.first_name + " " + client.last_name,
    total_amount: client.total_amount,
    payment: client.payment,
    amount_pending: client.amount_pending,
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
            placeholder="Ingrese un nombre ..."
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

export default ClientsList;

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
