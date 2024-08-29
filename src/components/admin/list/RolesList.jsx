import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import styled from "styled-components";
import { createTheme, ThemeProvider, Tooltip } from "@mui/material";
import { rolesAllFetch } from "../../../store/slices/RoleSlice";
import { useEffect, useState } from "react";
import EditPermissions from "../edit/EditPermissions";
import { FaLock } from "react-icons/fa";
import EditRole from "../edit/EditRole";

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-columnHeader:focus": {
            outline: "none",
          },
        },
      },
    },
  },
});

const RolesList = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const roles = useSelector((state) => state.roles.list);
  const [expandedPermissionId, setExpandedPermissionId] = useState(null); // Estado para almacenar el permissionId actual expandido

  const [filter, setFilter] = useState("");

  useEffect(() => {
    dispatch(rolesAllFetch());
  }, [dispatch, roles]);

  if (!roles) {
    return <p>Cargando roles...</p>;
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredRoles = roles.filter((roles) =>
    roles.role_name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleToggleEditPermissions = (permissionId) => {
    setExpandedPermissionId(
      expandedPermissionId === permissionId ? null : permissionId
    );
  };

  const columns = [
    {
      field: "role_name",
      headerName: "Rol",
      width: 300,
      renderCell: (params) => (
        <span style={{ color: "gray" }}>{params.value}</span>
      ),
    },
    {
      field: "permissions",
      headerName: "Permisos",
      width: 300,
      renderCell: (params) => {
        const permissionId = params.row.id;
        const isEditing = expandedPermissionId === permissionId; // Usar el id como permissionId
        return params.row.role_name !== "superadmin" ? (
          <Actions2>
            <Tooltip
              title={isEditing ? null : "Desbloquear"}
              arrow
              placement="right"
            >
              <div>
                {!isEditing ? (
                  <FaLock
                    color="white"
                    size={16}
                    cursor={"pointer"}
                    style={{ backgroundColor: "transparent" }}
                    onClick={() => handleToggleEditPermissions(permissionId)}
                  />
                ) : (
                  <EditPermissions permissionId={permissionId} />
                )}
              </div>
            </Tooltip>
          </Actions2>
        ) : (
          <p></p>
        );
      },
    },
    {
      field: "edit",
      headerName: "Editar",
      width: 70,
      renderCell: (params) => {
        return <EditRole roleId={params.row.id} />;
      },
    },
  ];

  const rows = filteredRoles.map((role, index) => ({
    id: role.role_id || index,
    role_name: role.role_name,
  }));

  if (!auth.isAdmin) return <p>Acceso denegado</p>;

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <input
            placeholder="Buscar ..."
            style={{
              width: "300px",
              borderRadius: "8px",
              padding: "8px",
              border: "1px solid #ccc",
              outline: "none",
            }}
            value={filter}
            onChange={handleFilterChange}
          ></input>
        </div>
        <StyledDataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      </Container>
    </ThemeProvider>
  );
};

export default RolesList;

const Actions2 = styled.div`
  display: flex;
  align-items: center;
  padding-top: 5px;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #4b70e2;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 460px;
  width: 100%;
  padding: 20px;
  background-color: white;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  margin-top: 10px;
`;

const StyledDataGrid = styled(DataGrid)`
  width: 100%;
  max-width: 900px; /* Limita el ancho máximo */
  border-top: 1px solid #ddd;
  padding-top: 20px;
`;
