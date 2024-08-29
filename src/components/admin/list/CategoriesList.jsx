import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import styled from "styled-components";
import { MdDelete } from "react-icons/md";

const CategoriesList = () => {
  const categories = useSelector((state) => state.categories.list);

  if (!categories) {
    return <p>Cargando usuarios...</p>;
  }

  const columns = [
    {
      field: "name_category",
      headerName: "Categoria",
      width: 200,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    /*{
      field: "qr_code",
      headerName: "Código QR",
      width: 200,
      renderCell: (params) => (
        <QRCode value={`${url}/products/find/${params.row.product_id}`} />
      ),
    },*/
    {
      field: "delete",
      headerName: "Eliminar",
      width: 100,
      renderCell: () => {
        return (
          <Actions1>
            <MdDelete
              color="white"
              size={18}
              cursor={"pointer"}
              style={{ backgroundColor: "transparent" }}
            />
          </Actions1>
        );
      },
    },
  ];

  const rows = categories.map((category, index) => ({
    id: category.category_id || index,
    name_category: category.name_category,
  }));

  return (
    <div style={{ height: 400, width: "100%", marginTop: "30px" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
};

export default CategoriesList;

const Actions1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e24b4b;
`;
