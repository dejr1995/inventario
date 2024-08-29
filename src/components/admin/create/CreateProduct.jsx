import { useEffect, useState } from "react";
import styled from "styled-components";
import { PrimaryButton } from "../CommonStyled";
import { useDispatch, useSelector } from "react-redux";
import { productsCreate } from "../../../store/slices/ProductSlice";
import {
  categoriesAllFetch,
  categoriesCreate,
  categoriesDelete,
} from "../../../store/slices/CategorySlice";
import { MdDelete } from "react-icons/md";

const CreateProduct = () => {
  const dispatch = useDispatch();

  const categories = useSelector((state) => state.categories.list);
  const providers = useSelector((state) => state.providers.list);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unitmeasurement, setUnitMeasurement] = useState("");
  const [category, setCategory] = useState("");
  const [provider, setProvider] = useState("");

  const [namecategory, setNameCategory] = useState("");

  useEffect(() => {
    category === "new" ? namecategory : category;
  });
  useEffect(() => {
    dispatch(categoriesAllFetch());
  }, [dispatch, categories]);

  const cleanFields = () => {
    setCategory("");
    setProvider("");
    setName("");
    setDescription("");
    setPrice("");
    setUnitMeasurement("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      productsCreate({
        name,
        description,
        price,
        unitmeasurement,
        category,
        provider,
      })
    );
    cleanFields();
  };

  const handleCreateCategory = () => {
    dispatch(
      categoriesCreate({
        namecategory,
      })
    );
    setNameCategory("");
  };

  const handleDeleteCategory = (categoryId) => {
    dispatch(categoriesDelete(categoryId));

    setCategory("");
  };

  return (
    <StyledCreateProduct>
      <StyledForm onSubmit={handleSubmit}>
        <select onChange={(e) => setProvider(e.target.value)}>
          <option value={provider}>Seleccionar Proveedor</option>
          {providers.map((item) => (
            <option key={item.provider_id} value={item.provider_id}>
              {item.name_provider}
            </option>
          ))}
        </select>
        <DivCategories>
          <select onChange={(e) => setCategory(e.target.value)}>
            <option value={category}>Seleccionar Categoria</option>
            {categories.map((item) => (
              <option key={item.category_id} value={item.category_id}>
                {item.name_category}
              </option>
            ))}
            <option value={"new"}>Nueva Categoria</option>
          </select>

          {category && (
            <MdDelete
              color="red"
              size={20}
              cursor={"pointer"}
              style={{ marginTop: "10px" }}
              onClick={() => handleDeleteCategory(category)}
            />
          )}
        </DivCategories>
        <input
          type="text"
          required
          placeholder="Producto"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Descripcion"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Precio unitario"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Unidad_medida"
          value={unitmeasurement}
          onChange={(e) => setUnitMeasurement(e.target.value)}
        />
        <PrimaryButton type="submit">Registrar</PrimaryButton>
      </StyledForm>
      <div style={{ display: "flex", gap: "10px" }}>
        {category === "new" && (
          <div>
            <input
              type="text"
              required
              placeholder="Nombre de la nueva categoría"
              value={namecategory}
              onChange={(e) => setNameCategory(e.target.value)}
            />
            <PrimaryButton onClick={handleCreateCategory}>
              Crear categoria
            </PrimaryButton>
          </div>
        )}
      </div>
    </StyledCreateProduct>
  );
};

export default CreateProduct;

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

const DivCategories = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;
