import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";
import { url } from "../../../store/api";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import { SecondaryButton } from "../CommonStyled";
import { IoStatsChartOutline } from "react-icons/io5";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#FF6347",
  "#4682B4",
  "#6A5ACD",
];

const ProductsXprovider = () => {
  const [open, setOpen] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [hover, setHover] = useState(false);

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const response = await axios.get(`${url}/products/productsXprovider`);

        console.log("Datos recibidos del backend:", response.data);

        if (Array.isArray(response.data) && response.data.length > 0) {
          const formattedData = response.data.map((item) => ({
            provider: item.name_provider,
            total_products: Number(item.total_products),
          }));
          setProductsData(formattedData);
        } else {
          console.error("La respuesta del backend no contiene datos válidos");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products data:", error);
        setLoading(false);
      }
    };

    fetchProductsData();
  }, []);

  const totalProducts = productsData.reduce(
    (sum, item) => sum + item.total_products,
    0
  );

  const calculatePercentage = (value) => {
    return ((value / totalProducts) * 100).toFixed(2);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IoStatsChartOutline
        size={24}
        style={{
          marginTop: "10px",
          cursor: "pointer",
          transition: "transform 0.3s ease",
          transform: hover ? "scale(1.2)" : "scale(1)",
          color: hover ? "#ccc" : "#999",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={handleClickOpen}
      />
      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="md">
        <DialogContent>
          <StyledEditProduct>
            {loading ? (
              <p>Cargando datos...</p>
            ) : (
              <StyledChart>
                <h3 style={{ display: "flex", justifyContent: "center" }}>
                  Cantidad de Productos por Proveedor
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={productsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="provider" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="total_products"
                      fill="#8884d8"
                      label={({ x, y, width, value }) => (
                        <text
                          x={x + width / 2}
                          y={y - 10}
                          fill="#000"
                          textAnchor="middle"
                          fontSize={14}
                        >
                          {`${calculatePercentage(value)}%`}
                        </text>
                      )}
                    >
                      {productsData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </StyledChart>
            )}
          </StyledEditProduct>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={handleClose}>cancel</SecondaryButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductsXprovider;

const StyledChart = styled.div`
  width: 100%;
  height: 450px;
  border: 2px solid rgba(48, 51, 78, 0.2);
  border-radius: 5px;

  h3 {
    margin-bottom: 1rem;
  }
`;

const StyledEditProduct = styled.div`
  display: flex;
  justify-content: space-between;
`;
