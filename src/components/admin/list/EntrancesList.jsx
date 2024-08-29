import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import styled from "styled-components";
import { MdDelete } from "react-icons/md";
import { createTheme, ThemeProvider } from "@mui/material";
import EditEntrance from "../edit/EditEntrance";
import { useEffect, useState } from "react";
import {
  entrancesAllFetch,
  entrancesDelete,
} from "../../../store/slices/EntranceSlice";
import EntrancesXproviders from "../graphics/EntrancesXproviders";

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

const EntrancesList = () => {
  const dispatch = useDispatch();
  const entrances = useSelector((state) => state.entrances.purchases);

  const [filter, setFilter] = useState("");

  useEffect(() => {
    dispatch(entrancesAllFetch());
  }, [dispatch, entrances]);

  if (!entrances) {
    return <p>Cargando entradas de productos...</p>;
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredEntrances = entrances.filter((entrance) =>
    entrance.name_product.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDelete = (id) => {
    dispatch(entrancesDelete(id));
  };

  const columns = [
    {
      field: "name_category",
      headerName: "Categoria",
      width: 100,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "name_product",
      headerName: "Producto",
      width: 100,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "name_provider",
      headerName: "Proveedor",
      width: 100,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "initial_stock",
      headerName: "Stock_Inicial",
      width: 100,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "current_stock",
      headerName: "Stock_actual",
      width: 100,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "purchase_price",
      headerName: "Precio_compra",
      width: 200,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "edit",
      headerName: "Editar",
      width: 70,
      renderCell: (params) => {
        return <EditEntrance entranceId={params.row.id} />;
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

  const rows = filteredEntrances.map((entrance, index) => ({
    id: entrance.purchaseId || index,
    name_category: entrance.name_category,
    name_product: entrance.name_product,
    name_provider: entrance.name_provider,
    initial_stock: entrance.initial_stock,
    current_stock: entrance.current_stock,
    purchase_price: entrance.purchase_price,
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
            placeholder="Ingrese un producto ..."
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
            <EntrancesXproviders />
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

export default EntrancesList;

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
