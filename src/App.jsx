import { Route, Routes } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import SignIn from "./pages/auth/SignIn";
import SIgnUp from "./pages/auth/SIgnUp";
import Maintenance from "./pages/maintenance/Maintenance";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgetPassword from "./pages/auth/ForgetPassword";
import Profile from "./pages/profile/Profile";
import ChangePassword from "./pages/profile/ChangePassword";
import TeamList from "./pages/users/team/TeamList";
import AppUserList from "./pages/users/appUser/AppUserList";
import ProductReportList from "./pages/reports/Product/ProductReportList";
import OrderList from "./pages/dashboard/OrderList";
import ViewList from "./pages/dashboard/ViewList";
import FormOrderDetails from "./pages/reports/order/FormOrderDetails";
import FormQuotationDetails from "./pages/reports/quotations/FormQuotationDetails";
import ReportOrderDetails from "./pages/reports/order/ReportOrderDetails";
import ReportQuotationDetails from "./pages/reports/quotations/ReportQuotationDetails";
import CaterogyList from "./pages/master/caterogies/CaterogyList";
import AddCaterogies from "./pages/master/caterogies/AddCaterogies";
import EditCaterogy from "./pages/master/caterogies/EditCaterogy";
import SubCategoriesList from "./pages/master/subCategories/SubCategoriesList";
import AddSubCategory from "./pages/master/subCategories/AddSubCategory";
import EditSubCategory from "./pages/master/subCategories/EditSubCategory";
import BrandList from "./pages/master/brands/BrandList";
import AddBrand from "./pages/master/brands/AddBrand";
import EditBrand from "./pages/master/brands/EditBrand";
import ProductsList from "./pages/master/products/ProductsList";
import EditProduct from "./pages/master/products/EditProduct";
import AddProduct from "./pages/master/products/AddProduct";
import QuotationsSubmittedList from "./pages/quotations/quotationsSubmitted/QuotationsSubmitted";
import EditQuotation from "./pages/quotations/quotationsSubmitted/EditQuotation";
import AllQuotationsList from "./pages/quotations/allQuotations/AllQuotations";
import CreateOrders from "./pages/createOrders/CreateOrders";
import PendingOrdersList from "./pages/createOrders/PendingOrdersList";
import EditOrder from "./pages/createOrders/EditOrder";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ViewQuotions from "./pages/quotations/quotationsSubmitted/ViewQuotions";


const App = () => {
  return (
    <>
     <ToastContainer />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<SIgnUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user-team" element={<TeamList />} />
        <Route path="/user-app" element={<AppUserList />} />
        <Route path="/product-report" element={<ProductReportList />} />
        <Route path="/create-order" element={<CreateOrders />} />
        <Route path="/order-list" element={<OrderList />} />
        <Route path="/pending-order-list" element={<PendingOrdersList />} />
        <Route path="/view-order/:id" element={<ViewList />} />
        <Route path="/view-quotions/:id" element={<ViewQuotions />} />
        <Route path="/edit-order/:id" element={<EditOrder />} />
        <Route path="/categories" element={<CaterogyList />} />
        <Route path="/add-categories" element={<AddCaterogies />} />
        <Route path="/edit-categories/:id" element={<EditCaterogy />} />
        <Route path="/sub-categories" element={<SubCategoriesList />} />
        <Route path="/add-sub-categories" element={<AddSubCategory />} />
        <Route path="/edit-sub-categories/:id" element={<EditSubCategory />} />
        <Route path="/brand" element={<BrandList />} />
        <Route path="/add-brand" element={<AddBrand />} />
        <Route path="/edit-brand/:id" element={<EditBrand />} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/quotations" element={<QuotationsSubmittedList />} />
        <Route path="/all-quotations" element={<AllQuotationsList />} />
        <Route path="/edit-quotations/:id" element={<EditQuotation />} />
        <Route path="/order-report" element={<FormOrderDetails />} />
        <Route path="/quotation-report" element={<FormQuotationDetails />} />
        <Route path="/order-view-report" element={<ReportOrderDetails />} />
        <Route path="/quotation-view-report" element={<ReportQuotationDetails />} />
       
       
        <Route
          path="/profile"
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path="/change-password"
          element={<ProtectedRoute element={<ChangePassword />} />}
        />

        {/* <Route
          path="*"
          element={<ProtectedRoute element={<Navigate to="/" />} />}
        /> */}
      </Routes>
    </>
  );
};

export default App;
