import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { existFetchByIdFactura } from "../../../store/slices/ExistSlice";
import styled from "styled-components";

const BillingsList = () => {
  const dispatch = useDispatch();
  const facturas = useSelector((state) => state.exists.facturas);
  const status = useSelector((state) => state.exists.status);

  useEffect(() => {
    dispatch(existFetchByIdFactura("3"));
  }, [dispatch]);

  if (status === "pending") {
    return <p>Loading...</p>;
  }

  if (status === "rejected") {
    return <p>Error fetching data.</p>;
  }

  return (
    <TableWrapper>
      <table>
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio por unidad</th>
            <th>Precio total</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((factura) => (
            <tr key={factura.id}>
              <td>{factura.name_category}</td>
              <td>{factura.name_product}</td>
              <td>{factura.amount}</td>
              <td>{factura.price_product}</td>
              <td>{factura.amount_total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
};

export default BillingsList;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    padding: 8px 12px;
    border: 1px solid #ddd;
    text-align: left;
  }
  th {
    background-color: #f4f4f4;
  }
`;
