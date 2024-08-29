import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { url } from "../../../store/api";
import { SecondaryButton } from "../CommonStyled";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import { IoStatsChartOutline } from "react-icons/io5";

// Colores para el gráfico de pastel
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#FF6347",
  "#4682B4",
  "#6A5ACD",
];

const SalesXcategories = () => {
  const [open, setOpen] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(`${url}/sales/salesXcategoryGraphics`); // Ajusta la URL según tu backend

        console.log("Datos recibidos del backend:", response.data);

        if (Array.isArray(response.data) && response.data.length > 0) {
          const formattedData = response.data.map((item) => ({
            category: item.category,
            total_sales: Number(item.total_sales),
          }));
          setSalesData(formattedData);
        } else {
          console.error("La respuesta del backend no contiene datos válidos");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sales data:", error);
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  const calculatePercentage = (value, total) => {
    return ((value / total) * 100).toFixed(2);
  };

  const totalSales = salesData.reduce((acc, item) => acc + item.total_sales, 0);

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
                  Distribución de Ventas por Categoría
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Tooltip />
                    <Legend />
                    <Pie
                      data={salesData}
                      dataKey="total_sales"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      fill="#8884d8"
                      label={(entry) =>
                        `${entry.category}: ${calculatePercentage(
                          entry.total_sales,
                          totalSales
                        )}%`
                      }
                    >
                      {salesData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
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

export default SalesXcategories;

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
