import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import NotFound from "../components/NotFound";
import Dashboard from "../components/admin/Dashboard";
import Products from "../components/Products";
import ProductsList from "../components/admin/list/ProductsList";
import Users from "../components/Users";
import UsersList from "../components/admin/list/UsersList";
import Categories from "../components/Categories";
import CategoriesList from "../components/admin/list/CategoriesList";
import Providers from "../components/Providers";
import ProvidersList from "../components/admin/list/ProvidersList";
import Clients from "../components/Clients";
import ClientsList from "../components/admin/list/ClientsList";
import Entrances from "../components/Entrances";
import EntrancesList from "../components/admin/list/EntrancesList";
import Exists from "../components/Exists";
import ComponentFactura from "../components/admin/list/ComponentFactura";
import CreateExists from "../components/admin/create/CreateExists";
import CreateBillings from "../components/admin/create/CreateBillings";
import BillingsList from "../components/admin/list/BillingsList";
import Roles from "../components/Roles";
import RolesList from "../components/admin/list/RolesList";
import ChangePassword from "../components/ChangePassword";
import Reports from "../components/Reports";
import CreateClient from "../components/admin/create/CreateClient";
import CreateProduct from "../components/admin/create/CreateProduct";
import CreateProvider from "../components/admin/create/CreateProvider";
import CreateUser from "../components/admin/create/CreateUser";
import CreateRole from "../components/admin/create/CreateRole";
import CreateEntrance from "../components/admin/create/CreateEntrance";
import EditBusiness from "../components/admin/edit/EditBusiness";
import VoucherList from "../components/admin/list/VoucherList";
import Login from "../components/auth/Login";
import CreateReports from "../components/admin/create/CreateReports";

const MyRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<Login />} />
      <Route path="/admin" exact={true} element={<Dashboard />}>
        <Route path="clients" element={<Clients />}>
          <Route index element={<ClientsList />} />
          <Route path="create-client" element={<CreateClient />} />
        </Route>
        <Route path="products" element={<Products />}>
          <Route index element={<ProductsList />} />
          <Route path="create-product" element={<CreateProduct />} />
        </Route>
        <Route path="users" element={<Users />}>
          <Route index element={<UsersList />} />
          <Route path="create-user" element={<CreateUser />} />
        </Route>
        <Route path="roles" element={<Roles />}>
          <Route index element={<RolesList />} />
          <Route path="create-role" element={<CreateRole />} />
        </Route>
        <Route path="categories" element={<Categories />}>
          <Route index element={<CategoriesList />} />
        </Route>
        <Route path="providers" element={<Providers />}>
          <Route index element={<ProvidersList />} />
          <Route path="create-provider" element={<CreateProvider />} />
        </Route>
        <Route path="entrances" element={<Entrances />}>
          <Route index element={<EntrancesList />} />
          <Route path="create-entrance" element={<CreateEntrance />} />
        </Route>
        <Route path="exists" element={<Exists />}>
          <Route index element={<ComponentFactura />} />
          <Route path="list-exists" element={<VoucherList />} />
        </Route>
        <Route path="items" element={<BillingsList />}>
          <Route index element={<ComponentFactura />} />
        </Route>
        <Route path="reports" element={<Reports />}>
          <Route index element={<CreateReports />} />
        </Route>
        <Route path="infocompany" element={<EditBusiness />} />
        <Route path="changepassword" element={<ChangePassword />} />
        <Route path="create-client" element={<CreateExists />}></Route>
        <Route path="create-billing" element={<CreateBillings />}></Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MyRoutes;
