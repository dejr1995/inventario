import { useEffect, useState } from "react";
import styled from "styled-components";
import { PrimaryButton } from "../CommonStyled";
import { useDispatch, useSelector } from "react-redux";
import { productsXcategories } from "../../../store/slices/ProductSlice";
import { entrancesCreate } from "../../../store/slices/EntranceSlice";

const CreateEntrance = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.list);
  const providers = useSelector((state) => state.providers.list);
  const listpxc = useSelector((state) => state.products.listpxc);

  const [category, setCategory] = useState("");
  const [product, setProduct] = useState("");
  const [provider, setProvider] = useState("");
  const [stockinitial, setStockInitial] = useState("");
  const [stockcurrent, setStockCurrent] = useState("");
  const [pricepurchase, setPricePurchase] = useState("");

  useEffect(() => {
    if (category) {
      dispatch(productsXcategories(category));
    }
  }, [dispatch, category]);

  const cleanFields = () => {
    setCategory("");
    setProduct("");
    setProvider("");
    setStockInitial("");
    setStockCurrent("");
    setPricePurchase("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      entrancesCreate({
        category,
        product,
        provider,
        stockinitial,
        stockcurrent,
        pricepurchase,
      })
    );
    cleanFields();
  };
  return (
    <StyledCreateProduct>
      <StyledForm onSubmit={handleSubmit}>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value={""}>Seleccionar Categoria</option>
          {categories.map((item) => (
            <option key={item.category_id} value={item.category_id}>
              {item.name_category}
            </option>
          ))}
        </select>

        <select value={product} onChange={(e) => setProduct(e.target.value)}>
          <option value={""}>Seleccionar Producto</option>
          {listpxc.map((item) => (
            <option key={item.productId} value={item.productId}>
              {item.name_product}
            </option>
          ))}
        </select>

        <select value={provider} onChange={(e) => setProvider(e.target.value)}>
          <option value={""}>Seleccionar Proveedor</option>
          {providers.map((item) => (
            <option key={item.provider_id} value={item.provider_id}>
              {item.name_provider}
            </option>
          ))}
        </select>

        <input
          type="number"
          required
          placeholder="Stock_inicial"
          value={stockinitial}
          onChange={(e) => setStockInitial(e.target.value)}
        />
        <input
          type="number"
          required
          placeholder="Stock_actual"
          value={stockcurrent}
          onChange={(e) => setStockCurrent(e.target.value)}
        />
        <input
          type="number"
          required
          placeholder="Precio_compra"
          value={pricepurchase}
          onChange={(e) => setPricePurchase(e.target.value)}
        />
        <PrimaryButton type="submit">Registrar</PrimaryButton>
      </StyledForm>
    </StyledCreateProduct>
  );
};

export default CreateEntrance;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin-top: 2rem;
  padding: 50px;
  background-color: white;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;

  select,
  input {
    padding: 7px;
    min-height: 30px;
    outline: none;
    border-radius: 5px;
    border: 1px solid rgb(182, 182, 182);
    margin: 0.3rem 0;

    &:focus {
      border: 2px solid rgb(0, 208, 255);
    }
  }

  select {
    color: rgb(95, 95, 95);
  }
`;

const StyledCreateProduct = styled.div`
  display: flex;
  width: 100%;
  height: 460px;
  justify-content: center;
`;
