import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import { url } from "../../../store/api";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import { SecondaryButton } from "../CommonStyled";
import { PiChartLineUp } from "react-icons/pi";

const SalesXYear = () => {
  const [open, setOpen] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("");
  const [years] = useState(
    [...Array(5).keys()].map((i) => new Date().getFullYear() - i)
  );
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      console.log("Año seleccionado:", selectedYear);

      try {
        const response = await axios.get(`${url}/payments/sellXmonth`, {
          params: {
            year: selectedYear,
          },
        });

        console.log("Datos recibidos del backend:", response.data);

        if (Array.isArray(response.data)) {
          const formattedData = response.data.map((item) => ({
            monthYear: `${item.year}-${
              item.month < 10 ? `0${item.month}` : item.month
            }`,
            total_sales: item.total_sales,
          }));

          const filteredData = formattedData.filter((data) =>
            data.monthYear.startsWith(selectedYear)
          );

          setSalesData(filteredData);
        } else {
          console.error("La respuesta del backend no es un array");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sales data:", error);
        setLoading(false);
      }
    };

    if (selectedYear) {
      fetchSalesData();
    }
  }, [selectedYear]);

  const handleYearChange = (e) => {
    console.log("Año seleccionado:", e.target.value);
    setSelectedYear(e.target.value);
  };

  const getYAxisDomain = () => {
    if (salesData.length === 0) return [0, 100];
    const values = salesData.map((data) => data.total_sales);
    const min = Math.min(...values);
    const max = Math.max(...values);
    return [Math.min(0, min), Math.ceil(max * 1.1)];
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <PiChartLineUp
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
            <div>
              <label htmlFor="year">Año:</label>
              <select
                id="year"
                value={selectedYear}
                onChange={handleYearChange}
              >
                <option value="">Selecciona un año</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <p>Cargando datos...</p>
            ) : selectedYear ? (
              <StyledChart>
                <h3 style={{ display: "flex", justifyContent: "center" }}>
                  Ventas Mensuales (S/.) en {selectedYear}
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={salesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="monthYear"
                      tickFormatter={(value) => value}
                    />
                    <YAxis
                      domain={getYAxisDomain()}
                      tickFormatter={(value) => value.toLocaleString()}
                    >
                      <Label
                        angle={-90}
                        position="left"
                        style={{ textAnchor: "middle" }}
                      >
                        Total Sales (S/.)
                      </Label>
                    </YAxis>
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="total_sales"
                      stroke="#82ca9d"
                      dot={{ stroke: "#82ca9d", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </StyledChart>
            ) : (
              <p>Por favor selecciona un año.</p>
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

export default SalesXYear;

const StyledChart = styled.div`
  width: 100%;
  height: 450px;
  margin-top: 10px;
  border: 2px solid rgba(48, 51, 78, 0.2);
  border-radius: 5px;

  h3 {
    margin-bottom: 1rem;
  }
`;
const StyledEditProduct = styled.div`
  display: flex;
  flex-direction: column;
`;
