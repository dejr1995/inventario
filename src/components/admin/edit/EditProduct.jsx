import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { PrimaryButton, SecondaryButton } from "../CommonStyled";
import { MdEdit } from "react-icons/md";
import { productsEdit } from "../../../store/slices/ProductSlice";

export default function EditProduct({ productId }) {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const { list, editStatus } = useSelector((state) => state.products);
  const categories = useSelector((state) => state.categories.list);
  const providers = useSelector((state) => state.providers.list);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unitmeasurement, setUnitMeasurement] = useState("");
  const [category, setCategory] = useState("");
  const [provider, setProvider] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      productsEdit({
        product_id: productId,
        name: name,
        description: description,
        price: price,
        unitmeasurement: unitmeasurement,
        category: category,
        provider: provider,
      })
    );
  };

  const handleClickOpen = () => {
    setOpen(true);

    let selectedProduct = list.find((item) => item.product_id === productId);
    if (selectedProduct) {
      setName(selectedProduct.name_product);
      setDescription(selectedProduct.description_product);
      setPrice(selectedProduct.price_product);
      setUnitMeasurement(selectedProduct.unit_measurement);
      setCategory(selectedProduct.category_id);
      setProvider(selectedProduct.provider_id);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Actions2>
        <MdEdit
          color="white"
          size={18}
          cursor={"pointer"}
          style={{ backgroundColor: "transparent" }}
          onClick={handleClickOpen}
        ></MdEdit>
      </Actions2>
      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="md">
        <DialogTitle>Actualizar Datos de Producto</DialogTitle>
        <DialogContent>
          <StyledEditProduct>
            <StyledForm onSubmit={handleSubmit}>
              <input
                type="text"
                required
                placeholder="Nombre del Producto"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              <input
                type="text"
                required
                placeholder="Descripcion"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value={""}>Seleccionar Categoria</option>
                {categories.map((item) => (
                  <option key={item.category_id} value={item.category_id}>
                    {item.name_category}
                  </option>
                ))}
              </select>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
              >
                <option value={""}>Seleccionar Proveedor</option>
                {providers.map((item) => (
                  <option key={item.provider_id} value={item.provider_id}>
                    {item.name_provider}
                  </option>
                ))}
              </select>
              <input
                type="text"
                required
                placeholder="Precio unitario"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
              />
              <input
                type="text"
                required
                placeholder="Stock"
                onChange={(e) => setUnitMeasurement(e.target.value)}
                value={unitmeasurement}
              />
              <PrimaryButton type="submit">
                {editStatus === "pendiente" ? "actualizando" : "Guardar"}
              </PrimaryButton>
            </StyledForm>
          </StyledEditProduct>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={handleClose}>cancel</SecondaryButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin-top: 2rem;

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

const StyledEditProduct = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Actions2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #4b70e2;
`;
