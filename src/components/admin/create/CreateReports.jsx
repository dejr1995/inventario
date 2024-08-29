import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByDate } from "../../../store/slices/ProductSlice";
import { fetchPaymentsByDate } from "../../../store/slices/PaymentSlice";
import { fetchPurchasesByDate } from "../../../store/slices/EntranceSlice";
import styled from "styled-components";
import { fetchSalesByDate } from "../../../store/slices/ExistSlice";
import * as XLSX from "xlsx";
import { RiFileExcel2Fill } from "react-icons/ri";

const formatBillingId = (id) => {
  const idStr = id.toString();
  if (idStr.length === 1) {
    return `F00${id}`;
  } else if (id.length === 2) {
    return `F0${id}`;
  } else {
    return `F${id}`;
  }
};

const formatPaymentId = (id) => {
  const idStr = id.toString();
  if (idStr.length === 1) {
    return `B00${id}`;
  } else if (idStr.length === 2) {
    return `B0${id}`;
  } else {
    return `B${id}`;
  }
};

const CreateReports = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.list);
  const payments = useSelector((state) => state.payments.list);
  const sales = useSelector((state) => state.exists.list);
  const purchases = useSelector((state) => state.entrances.list);
  const clients = useSelector((state) => state.clients.list);

  const categories = useSelector((state) => state.categories.list);
  const providers = useSelector((state) => state.providers.list);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchType, setSearchType] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedBilling, setSelectedBilling] = useState("");

  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleFetch = () => {
    if (startDate && endDate) {
      setHasSearched(true);
      if (searchType === "products") {
        dispatch(
          fetchProductsByDate({
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
          })
        );
      } else if (searchType === "payments") {
        dispatch(
          fetchPaymentsByDate({
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
          })
        );
      } else if (searchType === "sales") {
        dispatch(
          fetchSalesByDate({
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
          })
        );
      } else if (searchType === "purchases") {
        dispatch(
          fetchPurchasesByDate({
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
          })
        );
      }
    }
  };

  const handleChangeSearchType = (e) => {
    setSearchType(e.target.value);
    setHasSearched(false);
  };

  const getUniquePaymentMethods = (payments) => {
    const paymentMethods = payments.map((payment) =>
      formatBillingId(payment.billing_id.toString())
    );
    return [...new Set(paymentMethods)];
  };

  const filteredProducts = products.filter((product) => {
    const categoryMatches =
      selectedCategory === "" || product.name_category === selectedCategory;
    const providerMatches =
      selectedProvider === "" || product.name_provider === selectedProvider;

    return categoryMatches && providerMatches;
  });

  const filteredPurchases = purchases.filter((purchase) => {
    const categoryMatches =
      selectedCategory === "" || purchase.name_category === selectedCategory;
    const providerMatches =
      selectedProvider === "" || purchase.name_provider === selectedProvider;

    return categoryMatches && providerMatches;
  });

  const filteredSales = sales.filter((sale) => {
    const categoryMatches =
      selectedCategory === "" || sale.name_category === selectedCategory;

    const providerMatches =
      selectedProvider === "" || sale.name_provider === selectedProvider;

    const clientsMatches =
      selectedClient === "" ||
      sale.first_name + " " + sale.last_name === selectedClient;

    return categoryMatches && providerMatches && clientsMatches;
  });

  const filteredPayments = payments.filter((payment) => {
    const categoryMatches =
      selectedBilling === "" ||
      formatBillingId(payment.billing_id.toString()) === selectedBilling;

    return categoryMatches;
  });

  const exportToExcel = (data, headers, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, fileName);
  };

  const handleExport = () => {
    const now = new Date();
    const formattedDate = now
      .toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
    const formattedTime = now
      .toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/:/g, "-");

    const timestamp = `${formattedDate}_${formattedTime}`;

    if (searchType === "products") {
      const headers = [
        "Producto",
        "Descripcion",
        "Precio",
        "Medida",
        "Categoria",
        "Proveedor",
        "Fecha",
      ];
      const data = filteredProducts.map((product) => ({
        Producto: product.name_product,
        Descripcion: product.description_product,
        Precio: product.price_product,
        Medida: product.unit_measurement,
        Categoria: product.name_category,
        Proveedor: product.name_provider,
        Fecha: new Date(product.created_at).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      }));
      exportToExcel(data, headers, `productos_${timestamp}.xlsx`);
    } else if (searchType === "payments") {
      const headers = [
        "N° Boleta",
        "N° Factura",
        "Monto Pagado",
        "Metodo de Pago",
        "Referencia de Pago",
        "Fecha",
      ];
      const data = filteredPayments.map((payment) => ({
        "N° Boleta": formatPaymentId(payment.payment_id),
        "N° Factura": payment.billing_id,
        "Monto Pagado": payment.amount_paid,
        "Metodo de Pago": payment.payment_method,
        "Referencia de Pago": payment.payment_reference,
        Fecha: new Date(payment.created_at).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      }));
      exportToExcel(data, headers, `boletas_${timestamp}.xlsx`);
    } else if (searchType === "sales") {
      const headers = [
        "N° Factura",
        "Nombres",
        "Apellidos",
        "Producto",
        "Categoria",
        "Cantidad",
        "Precio",
        "Descuento aplicado",
        "Metodo de Pago",
        "Descuento Total",
        "Pago Total",
        "Fecha",
      ];
      const data = filteredSales.map((sale) => ({
        "N° Factura": formatBillingId(sale.factura_id),
        Nombres: sale.first_name,
        Apellidos: sale.last_name,
        Producto: sale.name_product,
        Categoria: sale.name_category,
        Cantidad: sale.amount,
        Precio: sale.price_product,
        "Descuento aplicado": sale.amount_discount,
        "Metodo de Pago": sale.payment_method,
        "Descuento Total": sale.discount_amount_quantity,
        "Pago Total": sale.amount_total,
        Fecha: new Date(sale.created_at).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      }));
      exportToExcel(data, headers, `ventas_${timestamp}.xlsx`);
    } else if (searchType === "purchases") {
      const headers = [
        "Categoria",
        "Proveedor",
        "Producto",
        "Stock_inicial",
        "Stock_actual",
        "Precio_compra",
        "Fecha",
      ];
      const data = filteredPurchases.map((purchase) => ({
        Categoria: purchase.name_category,
        Proveedor: purchase.name_provider,
        Producto: purchase.name_product,
        Stock_inicial: purchase.initial_stock,
        Stock_actual: purchase.current_stock,
        Precio_compra: purchase.purchase_price,
        Fecha: new Date(purchase.created_at).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      }));
      exportToExcel(data, headers, `entradas_${timestamp}.xlsx`);
    }
  };

  const uniquePaymentMethods = getUniquePaymentMethods(payments);

  return (
    <Main>
      <Column1>
        <select
          style={{ border: "1px solid #ccc" }}
          className="option-select"
          value={searchType}
          onChange={handleChangeSearchType}
        >
          <option value="">Selecciona una opción</option>{" "}
          <option value="products">Productos</option>
          <option value="payments">Boletas</option>
          <option value="sales">Facturas</option>
          <option value="purchases">Entradas</option>
        </select>

        <input
          style={{ border: "1px solid #ccc" }}
          className="option-select"
          type="date"
          value={formatDate(startDate)}
          onChange={(e) => setStartDate(new Date(e.target.value))}
        />
        <input
          style={{ border: "1px solid #ccc" }}
          className="option-select"
          type="date"
          value={formatDate(endDate)}
          onChange={(e) => setEndDate(new Date(e.target.value))}
        />
      </Column1>
      <Column2>
        <select
          style={{ border: "1px solid #ccc" }}
          className="option-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.name_category}>
              {category.name_category}
            </option>
          ))}
        </select>

        <select
          style={{ border: "1px solid #ccc" }}
          className="option-select"
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
        >
          <option value="">Todos los proveedores</option>
          {providers.map((provider) => (
            <option key={provider.provider_id} value={provider.name_provider}>
              {provider.name_provider}
            </option>
          ))}
        </select>

        <select
          style={{ border: "1px solid #ccc" }}
          className="option-select"
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
        >
          <option value="">Todas los clientes</option>
          {clients.map((client) => (
            <option
              key={client.client_id}
              value={`${client.first_name} ${client.last_name}`}
            >
              {client.first_name} {client.last_name}
            </option>
          ))}
        </select>
      </Column2>
      <Column3>
        <select
          style={{ border: "1px solid #ccc" }}
          className="option-select"
          value={selectedBilling}
          onChange={(e) => setSelectedBilling(e.target.value)}
        >
          <option value="">Todas las facturas</option>
          {uniquePaymentMethods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </Column3>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ButtonReport onClick={handleFetch}>Buscar</ButtonReport>
      </div>

      <span
        style={{
          border: "1px solid #ccc",
          marginTop: "-30px",
          marginBottom: "-10px",
        }}
      ></span>
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
        }}
      >
        {hasSearched && (
          <div style={{ marginBottom: "-30px" }}>
            <ButtonExcel onClick={handleExport}>Exportar</ButtonExcel>
            <RiFileExcel2Fill
              color="#008A00"
              size={32}
              style={{ marginBottom: "-10px", marginLeft: "5px" }}
            />
          </div>
        )}
      </div>
      {hasSearched && (
        <div
          style={{
            border: "1px solid #ccc",
            maxWidth: "850px",
            maxHeight: "600px",
            marginBottom: "20px",
            marginLeft: "20px",
            marginRight: "20px",
            padding: "10px",
          }}
        >
          {hasSearched && searchType === "products" && (
            <TableWrapper>
              {products.length > 0 ? (
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Descripcion</th>
                        <th>Precio</th>
                        <th>Medida</th>
                        <th>Categoria</th>
                        <th>Proveedor</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.product_id}>
                          <td>{product.name_product}</td>
                          <td>{product.description_product}</td>
                          <td>{product.price_product}</td>
                          <td>{product.unit_measurement}</td>
                          <td>{product.name_category}</td>
                          <td>{product.name_provider}</td>
                          <td>
                            {new Date(product.created_at).toLocaleDateString(
                              "es-ES",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div>
                  No se encontraron productos para el rango de fechas
                  seleccionado.
                </div>
              )}
            </TableWrapper>
          )}

          {hasSearched && searchType === "payments" && (
            <TableWrapper>
              {payments.length > 0 ? (
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <table>
                    <thead>
                      <tr>
                        <th>N° Boleta</th>
                        <th>N° Factura</th>
                        <th>Monto Pagado</th>
                        <th>Metodo de Pago</th>
                        <th>Referencia de Pago</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments.map((payment) => (
                        <tr key={payment.payment_id}>
                          <td>{formatPaymentId(payment.payment_id)}</td>
                          <td>{formatBillingId(payment.billing_id)}</td>
                          <td>{payment.amount_paid}</td>
                          <td>{payment.payment_method}</td>
                          <td>{payment.payment_reference}</td>
                          <td>
                            {new Date(payment.created_at).toLocaleDateString(
                              "es-ES",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div>
                  No se encontraron productos para el rango de fechas
                  seleccionado.
                </div>
              )}
            </TableWrapper>
          )}

          {hasSearched && searchType === "sales" && (
            <TableWrapper>
              {sales.length > 0 ? (
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <table>
                    <thead>
                      <tr>
                        <th>N° Factura</th>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Producto</th>
                        <th>Categoria</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Descuento aplicado</th>
                        <th>Metodo de Pago</th>
                        <th>Descuento Total</th>
                        <th>Pago Total</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSales.map((sale) => (
                        <tr key={sale.sale_id}>
                          <td>{formatBillingId(sale.factura_id)}</td>
                          <td>{sale.first_name}</td>
                          <td>{sale.last_name}</td>
                          <td>{sale.name_product}</td>
                          <td>{sale.name_category}</td>
                          <td>{sale.amount}</td>
                          <td>{sale.price_product}</td>
                          <td>{sale.amount_discount}</td>
                          <td>{sale.payment_method}</td>
                          <td>{sale.discount_amount_quantity}</td>
                          <td>{sale.amount_total}</td>
                          <td>
                            {new Date(sale.created_at).toLocaleDateString(
                              "es-ES",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div>
                  No se encontraron productos para el rango de fechas
                  seleccionado.
                </div>
              )}
            </TableWrapper>
          )}

          {hasSearched && searchType === "purchases" && (
            <TableWrapper>
              {purchases.length > 0 ? (
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Categoria</th>
                        <th>Proveedor</th>
                        <th>Producto</th>
                        <th>Stock_inicial</th>
                        <th>Stock_actual</th>
                        <th>Precio_compra</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPurchases.map((purchase) => (
                        <tr key={purchase.purchase_id}>
                          <td>{purchase.name_category}</td>
                          <td>{purchase.name_provider}</td>
                          <td>{purchase.name_product}</td>
                          <td>{purchase.initial_stock}</td>
                          <td>{purchase.current_stock}</td>
                          <td>{purchase.purchase_price}</td>
                          <td>
                            {new Date(purchase.created_at).toLocaleDateString(
                              "es-ES",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div>
                  No se encontraron productos para el rango de fechas
                  seleccionado.
                </div>
              )}
            </TableWrapper>
          )}
        </div>
      )}
    </Main>
  );
};

export default CreateReports;

const TableWrapper = styled.div`
  width: 100%;
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    padding: 3px 8px;
    border: 1px solid #ddd;
    text-align: left;
  }
  th {
    background-color: #f4f4f4;
  }
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
  margin-top: 30px;
  padding: 30px;
  background-color: white;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
`;

const Column1 = styled.div`
  display: flex;
  flex-direction: row;
  gap: 50px;
`;

const Column2 = styled.div`
  display: flex;
  flex-direction: row;
  gap: 50px;
`;

const Column3 = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
`;

const ButtonReport = styled.button`
  padding: 9px 12px;
  border-radius: 5px;
  font-weight: 400;
  letter-spacing: 1.15px;
  background-color: #4b70e2;
  color: #f9f9f9;
  border: none;
  outline: none;
  cursor: pointer;
`;

const ButtonExcel = styled.button`
  margin-bottom: -40px;
  margin-left: 20px;
  padding: 9px 12px;
  border-radius: 5px;
  font-weight: 400;
  letter-spacing: 1.15px;
  background-color: #008a00;
  color: #e0f2f1;
  border: none;
  outline: none;
  cursor: pointer;
`;
