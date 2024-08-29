import { configureStore } from "@reduxjs/toolkit";
import { ProductSlice, productsAllFetch } from "../store/slices/ProductSlice";
import { UserSlice, usersAllFetch, usersXroles } from "../store/slices/UserSlice";
import { categoriesAllFetch, CategorySlice } from "./slices/CategorySlice";
import { providersAllFetch, ProviderSlice } from "./slices/ProviderSlice";
import { clientsAllFetch, ClientSlice } from "./slices/ClientSlice";
import { entrancesAllFetch, EntranceSlice, purchasesAll } from "./slices/EntranceSlice";
import { existsAllFetch, ExistSlice } from "./slices/ExistSlice";
import {  billingsAllFetch, BillingSlice, clientsFetchByBilling } from "./slices/BillingSlice";
import { rolesAllFetch, RoleSlice } from "./slices/RoleSlice";
import { businessAllFetch, businesslice } from "./slices/BusinessSlice";
import { paymentsAllFetch, paymentslice, paymentXbilling } from "./slices/PaymentSlice";
import { AuthSlice, loadUser } from "./slices/AuthSlice";
import { fetchSwitches, SwitchesSlice } from "./slices/SwitchesSlice";

export const store = configureStore({
    reducer:{
        auth: AuthSlice.reducer,
        products: ProductSlice.reducer,
        users: UserSlice.reducer,
        categories: CategorySlice.reducer,
        providers: ProviderSlice.reducer,
        clients: ClientSlice.reducer,
        entrances: EntranceSlice.reducer,
        exists: ExistSlice.reducer,
        billings: BillingSlice.reducer,
        roles: RoleSlice.reducer,
        business: businesslice.reducer,
        payments: paymentslice.reducer,
        switches: SwitchesSlice.reducer
    },
});

store.dispatch(productsAllFetch());
store.dispatch(usersAllFetch());
store.dispatch(categoriesAllFetch());
store.dispatch(providersAllFetch());
store.dispatch(clientsAllFetch());
store.dispatch(entrancesAllFetch());
store.dispatch(purchasesAll());
store.dispatch(existsAllFetch());
store.dispatch(billingsAllFetch());
store.dispatch(usersXroles());
store.dispatch(rolesAllFetch());
store.dispatch(businessAllFetch());
store.dispatch(paymentsAllFetch());
store.dispatch(paymentXbilling());
store.dispatch(clientsFetchByBilling());
store.dispatch(loadUser(null))
store.dispatch(fetchSwitches());

