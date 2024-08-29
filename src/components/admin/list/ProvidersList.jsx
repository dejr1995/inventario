import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import styled from "styled-components";
import { MdDelete } from "react-icons/md";
import { createTheme, ThemeProvider } from "@mui/material";
import {
  providersAllFetch,
  providersDelete,
} from "../../../store/slices/ProviderSlice";
import { useEffect, useState } from "react";
import EditProvider from "../edit/EditProvider";
import ProductsXprovider from "../graphics/ProductsXprovider";

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

const ProvidersList = () => {
  const dispatch = useDispatch();
  const providers = useSelector((state) => state.providers.list);

  const [filter, setFilter] = useState("");

  useEffect(() => {
    dispatch(providersAllFetch());
  }, [dispatch, providers]);

  if (!providers) {
    return <p>Cargando productos...</p>;
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredProviders = providers.filter((provider) =>
    provider.name_provider.toLowerCase().includes(filter.toLowerCase())
  );

  const columns = [
    {
      field: "name_provider",
      headerName: "Nombre",
      width: 150,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "email_provider",
      headerName: "Email",
      width: 200,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "phone_provider",
      headerName: "Telefono",
      width: 100,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "address_provider",
      headerName: "Direccion",
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
        return <EditProvider providerId={params.row.id} />;
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
    dispatch(providersDelete(id));
  };

  const rows = filteredProviders.map((provider, index) => ({
    id: provider.provider_id || index,
    name_provider: provider.name_provider,
    email_provider: provider.email_provider,
    phone_provider: provider.phone_provider,
    address_provider: provider.address_provider,
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
            placeholder="Ingrese un proveedor ..."
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
          <div style={{ marginRight: "20px" }}>
            <ProductsXprovider />
          </div>
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

export default ProvidersList;

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
