import { useEffect, useState } from "react";
import styled from "styled-components";
import { PrimaryButton } from "../CommonStyled";
import { useDispatch, useSelector } from "react-redux";
import { existsCreate } from "../../../store/slices/ExistSlice";
import { productsXcategories } from "../../../store/slices/ProductSlice";
import { clientsXusers } from "../../../store/slices/ClientSlice";
import { billingsCreate } from "../../../store/slices/BillingSlice";

const CreateExists = () => {
  const dispatch = useDispatch();
  const listcxu = useSelector((state) => state.clients.listcxu);
  const categories = useSelector((state) => state.categories.list);
  const createdBillingId = useSelector(
    (state) => state.billings.createdBillingId
  );

  const [client, setClient] = useState(null);
  const [rows, setRows] = useState([
    {
      category: null,
      product: null,
      newAmount: null,
      priceproduct: null,
      amountdiscount: null,
      discountType: "%",
      amounttotal: null,
      paymentmethod: "Efectivo",
      productsList: [],
    },
  ]);

  const [amounttotal, setTotalAmount] = useState(0);
  const [payment, setPayment] = useState(0);
  const [amountpending, setDebt] = useState(0);
  const [billingsstatus, setStatus] = useState("");

  useEffect(() => {
    dispatch(clientsXusers());
  }, [dispatch]);

  useEffect(() => {
    if (categories.length > 0 && rows[0].category === null) {
      setRows((prevRows) => prevRows.map((row) => ({ ...row })));
    }
  }, [categories]);

  useEffect(() => {
    rows.forEach((row, index) => {
      if (row.category) {
        dispatch(productsXcategories(row.category)).then((response) => {
          setRows((prevRows) => {
            const updatedRows = [...prevRows];
            updatedRows[index].productsList = response.payload; // Update products list for the specific row
            return updatedRows;
          });
        });
      }
    });
  }, [rows.map((row) => row.category).join(","), dispatch]);

  useEffect(() => {
    const updatedRows = rows.map((row) => {
      if (row.product) {
        const selectedProduct = row.productsList.find(
          (p) => p.productId === row.product
        );
        if (selectedProduct) {
          const total = row.newAmount * selectedProduct.price_product;
          let discountedTotal;

          if (row.discountType === "%") {
            discountedTotal = total - total * (row.amountdiscount / 100);
          } else {
            discountedTotal = total - row.amountdiscount;
          }

          return {
            ...row,
            priceproduct: selectedProduct.price_product,
            amounttotal: discountedTotal,
          };
        }
      }
      return row;
    });

    if (JSON.stringify(updatedRows) !== JSON.stringify(rows)) {
      setRows(updatedRows);
    }
  }, [rows]);

  useEffect(() => {
    const sum = rows.reduce((acc, row) => acc + (row.amounttotal || 0), 0);
    setTotalAmount(sum);
  }, [rows]);

  useEffect(() => {
    setDebt(amounttotal - payment);
  }, [amounttotal, payment]);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        category: null,
        product: null,
        newAmount: null,
        priceproduct: null,
        amountdiscount: null,
        discountType: "%",
        amounttotal: null,
        paymentmethod: "Efectivo",
        productsList: [],
      },
    ]);
  };

  const handleRowChange = (index, key, value) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[index] = { ...updatedRows[index], [key]: value };
      if (key === "category") {
        updatedRows[index].product = null;
        updatedRows[index].productsList = [];
        dispatch(productsXcategories(value)).then((response) => {
          updatedRows[index].productsList = response.payload;
          setRows(updatedRows);
        });
      }
      return updatedRows;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      billingsCreate({
        client,
        amounttotal,
        amountpending,
        billingsstatus,
      })
    )
      .then((action) => {
        const createdBillingId = action.payload.id;

        rows.forEach((row) => {
          dispatch(
            existsCreate({
              client,
              factura: createdBillingId,
              category: row.category,
              product: row.product,
              amount: row.newAmount,
              priceproduct: row.priceproduct,
              amountdiscount: row.amountdiscount,
              discountType: row.discountType,
              paymentmethod: row.paymentmethod,
              amounttotal: row.amounttotal,
            })
          );
        });
      })
      .catch((error) => {
        console.error("Error creando la factura:", error);
      });
  };

  return (
    <TableWrapper>
      <form onSubmit={handleSubmit}>
        <select onChange={(e) => setClient(e.target.value)}>
          <option value={""}>Select a client</option>
          {listcxu.map((item) => (
            <option key={item.clientId} value={item.clientId}>
              {item.first_name}
            </option>
          ))}
        </select>

        <table>
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Descuento</th>
              <th>Tipo Descuento</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>
                  <select
                    value={row.category}
                    onChange={(e) =>
                      handleRowChange(index, "category", e.target.value)
                    }
                  >
                    <option value={""}>Select a category</option>
                    {categories.map((item) => (
                      <option key={item.category_id} value={item.category_id}>
                        {item.name_category}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={row.product}
                    onChange={(e) =>
                      handleRowChange(index, "product", e.target.value)
                    }
                  >
                    <option value={""}>Select a product</option>
                    {row.productsList.map((item) => (
                      <option key={item.productId} value={item.productId}>
                        {item.name_product}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    required
                    placeholder="Cantidad"
                    value={row.newAmount || ""}
                    onChange={(e) =>
                      handleRowChange(index, "newAmount", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    required
                    placeholder="Precio"
                    value={row.priceproduct || ""}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="number"
                    required
                    placeholder="Descuento"
                    value={row.amountdiscount || ""}
                    onChange={(e) =>
                      handleRowChange(index, "amountdiscount", e.target.value)
                    }
                  />
                </td>
                <td>
                  <select
                    value={row.discountType}
                    onChange={(e) =>
                      handleRowChange(index, "discountType", e.target.value)
                    }
                  >
                    <option value="%">%</option>
                    <option value="Importe">Importe</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    required
                    placeholder="Monto Total"
                    value={row.amounttotal || ""}
                    readOnly
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <PrimaryButton type="button" onClick={handleAddRow}>
          Añadir Item +
        </PrimaryButton>

        <PrimaryButton type="submit">Submit</PrimaryButton>
        <p>Total a pagar</p>
        <input
          type="number"
          required
          placeholder="Monto Total a Pagar"
          value={amounttotal}
          onChange={(e) => setTotalAmount(e.target.value)}
        />
        <p>Pago</p>
        <input
          type="number"
          required
          placeholder="Pago"
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
        />
        <p>Debe pagar</p>
        <input
          type="number"
          required
          placeholder="Debe pagar"
          value={amountpending}
          onChange={(e) => setDebt(e.target.value)}
        />
        <p>Estado</p>
        <input
          type="text"
          required
          placeholder="Estado"
          value={billingsstatus}
          onChange={(e) => setStatus(e.target.value)}
        />
      </form>
      Factura es{createdBillingId}
    </TableWrapper>
  );
};

export default CreateExists;

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
