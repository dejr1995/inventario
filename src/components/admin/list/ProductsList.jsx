import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import QRCode from "qrcode.react";
import { DataGrid } from "@mui/x-data-grid";
import { url } from "../../../store/api";
import styled, { keyframes } from "styled-components";
import { MdDelete } from "react-icons/md";
import { createTheme, ThemeProvider } from "@mui/material";
import {
  productsAllFetch,
  productsDelete,
} from "../../../store/slices/ProductSlice";
import EditProduct from "../edit/EditProduct";
import ProductsXcate from "../graphics/ProductsXcate";

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

const ProductsList = () => {
  const componentRef = useRef(null);
  const dispatch = useDispatch();

  const products = useSelector((state) => state.products.list);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [filter, setFilter] = useState("");

  useEffect(() => {
    dispatch(productsAllFetch());
  }, [dispatch, products]);

  const handleAddToPrint = (productId) => {
    const selectedProduct = products.find(
      (product) => product.product_id === productId
    );
    setSelectedProducts([...selectedProducts, selectedProduct]);
  };

  const handleAfterPrint = () => {
    setSelectedProducts([]);
  };

  if (!products) {
    return <p>Cargando productos...</p>;
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name_product.toLowerCase().includes(filter.toLowerCase())
  );

  const columns = [
    {
      field: "name_product",
      headerName: "Nombre",
      width: 200,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "description_product",
      headerName: "Descripcion",
      width: 200,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "price_product",
      headerName: "Precio",
      width: 100,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "unit_measurement",
      headerName: "Unidad de Medida",
      width: 150,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },

    /*{
      field: "qr_code",
      headerName: "Código QR",
      width: 200,
      renderCell: (params) => (
        <QRCode value={`${url}/products/find/${params.row.product_id}`} />
      ),
    },*/
    {
      field: "edit",
      headerName: "Editar",
      width: 70,
      renderCell: (params) => {
        return <EditProduct productId={params.row.id} />;
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
    {
      field: "select",
      headerName: "Seleccionar",
      width: 150,
      renderCell: (params) => {
        return (
          <Actions>
            <View
              className={
                selectedProducts.find(
                  (product) => product.product_id === params.row.id
                )
                  ? "action-button selected" // Clase "selected" si el producto está en selectedProducts
                  : "action-button"
              }
              onClick={() => handleAddToPrint(params.row.id)}
            >
              ✓
            </View>
          </Actions>
        );
      },
    },
  ];

  const handleDelete = (id) => {
    dispatch(productsDelete(id));
  };

  const rows = filteredProducts.map((product, index) => ({
    id: product.product_id || index,
    name_product: product.name_product,
    description_product: product.description_product,
    price_product: product.price_product,
    unit_measurement: product.unit_measurement,
    qr_code: product.product_id,
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
          <ProductsXcate />
          <ReactToPrint
            trigger={() => <PrintButton>🖨️ Generar QR</PrintButton>}
            content={() => componentRef.current}
            onAfterPrint={handleAfterPrint}
          />
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

        <div style={{ display: "none" }}>
          <div ref={componentRef}>
            {selectedProducts.map((selectedProduct) => (
              <div
                key={selectedProduct.product_id}
                className="selected-product-item"
              >
                <h3>{selectedProduct.name_product}</h3>
                <QRCode
                  value={`${url}/products/find/${selectedProduct.product_id}`}
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default ProductsList;

const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  button {
    border: none;
    outline: none;
    padding: 3px 5px;
    color: white;
    border-radius: 3px;
    cursor: pointer;
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

const View = styled.button`
  background-color: orange;

  &.selected {
    color: green;
    border-color: red;
  }
`;

const bounce = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;

const PrintButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    animation: ${bounce} 0.6s;
  }
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
