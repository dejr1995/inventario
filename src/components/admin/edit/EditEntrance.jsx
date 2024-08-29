import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { PrimaryButton, SecondaryButton } from "../CommonStyled";
import { MdEdit } from "react-icons/md";
import { usersEdit } from "../../../store/slices/UserSlice";

export default function EditEntrance({ entranceId }) {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const { purchases, editStatus } = useSelector((state) => state.entrances);

  const [category, setCategory] = useState("");
  const [product, setProduct] = useState("");
  const [provider, setProvider] = useState("");
  const [stockinitial, setStockInitial] = useState("");
  const [stockcurrent, setStockCurrent] = useState("");
  const [pricepurchase, setPricePurchase] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      usersEdit({
        purchase_id: entranceId,
        category: category,
        product: product,
        provider: provider,
        stockinitial: stockinitial,
        stockcurrent: stockcurrent,
        pricepurchase: pricepurchase,
      })
    );
  };

  const handleClickOpen = () => {
    setOpen(true);

    let selectedUser = purchases.find((item) => item.purchaseId === entranceId);
    if (selectedUser) {
      setCategory(selectedUser.name_category);
      setProduct(selectedUser.name_product);
      setProvider(selectedUser.name_provider);
      setStockInitial(selectedUser.initial_stock);
      setStockCurrent(selectedUser.current_stock);
      setPricePurchase(selectedUser.purchase_price);
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
        <DialogTitle>Actualizar Datos de Ingresos</DialogTitle>
        <DialogContent>
          <StyledEditProduct>
            <StyledForm onSubmit={handleSubmit}>
              <input
                type="text"
                required
                placeholder="Categoria"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                disabled
              />
              <input
                type="text"
                required
                placeholder="Producto"
                onChange={(e) => setProduct(e.target.value)}
                value={product}
                disabled
              />
              <input
                type="text"
                required
                placeholder="Proveedor"
                onChange={(e) => setProvider(e.target.value)}
                value={provider}
                disabled
              />
              <input
                type="text"
                required
                placeholder="Stock_inicial"
                onChange={(e) => setStockInitial(e.target.value)}
                value={stockinitial}
              />
              <input
                type="text"
                required
                placeholder="Stock_actual"
                onChange={(e) => setStockCurrent(e.target.value)}
                value={stockcurrent}
              />
              <input
                type="text"
                required
                placeholder="Precio_compra"
                onChange={(e) => setPricePurchase(e.target.value)}
                value={pricepurchase}
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
