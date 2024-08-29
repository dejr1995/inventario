import { useEffect, useState } from "react";
import styled from "styled-components";
import { ItemButton, PrimaryButton } from "../CommonStyled";
import { useDispatch, useSelector } from "react-redux";
import { existsCreate } from "../../../store/slices/ExistSlice";
import { productsXcategories } from "../../../store/slices/ProductSlice";
import { clientsXusers } from "../../../store/slices/ClientSlice";
import { billingsCreate } from "../../../store/slices/BillingSlice";
import { FaUser } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const formatBillingId = (id) => {
  const idStr = id.toString();
  if (idStr.length === 1) {
    return `F00${id}`;
  } else if (idStr.length === 2) {
    return `F0${id}`;
  } else {
    return `F${id}`;
  }
};

const CreateExists = () => {
  const dispatch = useDispatch();
  const listcxu = useSelector((state) => state.clients.list);
  const categories = useSelector((state) => state.categories.list);
  const createdBillingId = useSelector(
    (state) => state.billings.createdBillingId
  );

  const [client, setClient] = useState(null);
  const [factura, setFactura] = useState(null);
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
      discountamountquantity: null,
      productsList: [],
    },
  ]);

  const [amounttotal, setTotalAmount] = useState(0);
  const [payment, setPayment] = useState(0);
  const [amountpending, setDebt] = useState(0);
  const [billingsstatus, setStatus] = useState("");
  const [amounttotaldiscount, setTotalDiscount] = useState(0);
  const [amountsubtotaldiscount, setSubTotalAmount] = useState(0);

  const clearRows = () => {
    setRows([
      {
        category: null,
        product: null,
        newAmount: null,
        priceproduct: null,
        amountdiscount: null,
        discountType: "%",
        amounttotal: null,
        paymentmethod: "Efectivo",
        discountamountquantity: null,
        productsList: [],
      },
    ]);
  };
  const resetForm = () => {
    setClient(null);
    setFactura(null);
    clearRows();
    setTotalAmount(0);
    setPayment(0);
    setDebt(0);
    setStatus("");
    setTotalDiscount(0);
    setSubTotalAmount(0);
  };

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
            updatedRows[index].productsList = response.payload;
            return updatedRows;
          });
        });
      }
    });
  }, [rows.map((row) => row.category).join(","), dispatch]);

  useEffect(() => {
    let discountSum = 0;
    let subtotal = 0;
    const updatedRows = rows.map((row) => {
      if (row.product) {
        const selectedProduct = row.productsList.find(
          (p) => p.productId === row.product
        );
        if (selectedProduct) {
          const total = row.newAmount * selectedProduct.price_product;
          let discountAmount;
          let discountedTotal;

          if (row.discountType === "%") {
            discountAmount = total * (Number(row.amountdiscount) / 100);
          } else {
            discountAmount = Number(row.amountdiscount);
          }
          discountedTotal = total - discountAmount;

          discountSum += discountAmount;
          subtotal += total;

          return {
            ...row,
            priceproduct: selectedProduct.price_product,
            amounttotal: discountedTotal,
            discountamountquantity: discountAmount,
          };
        }
      }
      return row;
    });

    if (JSON.stringify(updatedRows) !== JSON.stringify(rows)) {
      setRows(updatedRows);
    }
    setTotalDiscount(discountSum);
    setSubTotalAmount(subtotal);
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
        discountamountquantity: null,
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
        payment,
        amountpending,
        billingsstatus,
        amounttotaldiscount,
        amountsubtotaldiscount,
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
              discountamountquantity: row.discountamountquantity,
              amounttotal: row.amounttotal,
            })
          );
        });
        resetForm();
      })
      .catch((error) => {
        console.error("Error creando la factura:", error);
      });
  };

  return (
    <TableWrapper>
      <form onSubmit={handleSubmit}>
        <Texto>Cod. Factura Generado</Texto>
        <Separate>
          <FacturaDiv>
            <FaUser />

            <input
              style={{ width: "100px" }}
              disabled
              type="text"
              value={
                createdBillingId ? formatBillingId(createdBillingId) : "N/A"
              }
              onChange={(e) => setFactura(e.target.value)}
              required
              placeholder="N° Factura"
            />
          </FacturaDiv>
          <ClientDiv>
            <FaUser />
            <select onChange={(e) => setClient(e.target.value)}>
              <option value="">Select a client</option>
              {listcxu.map((item) => (
                <option key={item.client_id} value={item.client_id}>
                  {item.first_name}
                </option>
              ))}
            </select>
          </ClientDiv>
        </Separate>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Category</th>
              <th>Product</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Descuento</th>
              <th>Tipo de descuento</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>
                  <MdDelete
                    size={22}
                    color="red"
                    style={{ cursor: "pointer" }}
                  />
                </td>
                <td>
                  <select
                    style={{ width: "100px" }}
                    value={row.category}
                    onChange={(e) =>
                      handleRowChange(index, "category", e.target.value)
                    }
                  >
                    <option value="">Select a category</option>
                    {categories.map((item) => (
                      <option key={item.category_id} value={item.category_id}>
                        {item.name_category}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    style={{ width: "100px" }}
                    value={row.product}
                    onChange={(e) =>
                      handleRowChange(index, "product", e.target.value)
                    }
                  >
                    <option value="">Select a product</option>
                    {row.productsList.map((item) => (
                      <option key={item.productId} value={item.productId}>
                        {item.name_product}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    style={{ width: "100px" }}
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
                    style={{ width: "100px" }}
                    type="text"
                    required
                    placeholder="Precio"
                    value={row.priceproduct || ""}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    style={{ width: "100px" }}
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
                    style={{ width: "100px" }}
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
        <ItemButton
          type="button"
          onClick={handleAddRow}
          style={{ marginTop: "20px", marginBottom: "40px" }}
        >
          + Añadir mas
        </ItemButton>

        <Billing>
          <Billing1>
            <div>
              <p>Total a pagar S/.</p>
              <input
                type="number"
                required
                placeholder="Monto Total a Pagar"
                value={amounttotal}
                onChange={(e) => setTotalAmount(e.target.value)}
                readOnly
              />
            </div>
          </Billing1>
          <Billing2>
            <div>
              <p>Importe neto por pagar :</p>
              <input
                type="number"
                required
                placeholder="Debe pagar"
                value={amountpending}
                onChange={(e) => setDebt(e.target.value)}
                readOnly
              />
            </div>
            <div>
              <p>Tipo de pago</p>
              <select
                value={billingsstatus}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Seleccionar tipo de pago</option>
                <option value="completo">Completo</option>
                <option value="parcial">Parcial</option>
              </select>
            </div>
          </Billing2>
        </Billing>
        <div style={{ width: "100%", borderBottom: "1px solid #ddd" }}>
          <PrimaryButton
            type="submit"
            style={{ marginTop: "20px", marginBottom: "20px" }}
          >
            Generar Factura
          </PrimaryButton>
        </div>
      </form>
    </TableWrapper>
  );
};

export default CreateExists;

const TableWrapper = styled.div`
  width: 100%;
  display: flex;
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

const Texto = styled.div`
  display: flex;
  margin-top: 20px;
`;

const FacturaDiv = styled.div`
  display: flex;
  gap: 10px;
`;

const ClientDiv = styled.div`
  display: flex;
  gap: 10px;
`;

const Separate = styled.div`
  display: flex;
  margin-top: 10px;
  margin-bottom: 30px;
  gap: 60px;
`;

const Billing = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Billing1 = styled.div`
  display: flex;
  gap: 100px;
`;

const Billing2 = styled.div`
  display: flex;
  gap: 100px;
`;
