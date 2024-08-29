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
import { url } from "../store/slices/api";

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

const Home = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(`${url}/sales/salesXcategoryGraphics`);

        // Verifica los datos recibidos
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

  // Función para calcular el porcentaje
  const calculatePercentage = (value, total) => {
    return ((value / total) * 100).toFixed(2); // Muestra con dos decimales
  };

  // Sumar todas las ventas para el cálculo de porcentaje
  const totalSales = salesData.reduce((acc, item) => acc + item.total_sales, 0);

  return (
    <>
      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <StyledChart>
          <h3>Distribución de Ventas por Categoría</h3>
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
    </>
  );
};

export default Home;

const StyledChart = styled.div`
  width: 100%;
  height: 400px;
  margin-top: 2rem;
  padding: 1rem;
  border: 2px solid rgba(48, 51, 78, 0.2);
  border-radius: 5px;

  h3 {
    margin-bottom: 1rem;
  }
`;
