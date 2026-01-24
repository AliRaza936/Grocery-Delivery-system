import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import DeliveryBoy from "@/components/DeliveryBoy";

import EditRoleMobile from "@/components/EditRoleMobile";
import Footer from "@/components/Footer";
import GeoUpdater from "@/components/GeoUpdater";
import HomeWrapper from "@/components/HomeWrapper";
import Nav from "@/components/Nav";
import UserDashboard from "@/components/UserDashboard";
import Welcome from "@/components/Welcome";
import dbConnect from "@/config/db";
import Grocery, { IGrocery } from "@/models/grocery.model";
import User from "@/models/user.model";

const Home = async (props:{
  searchParams:Promise<{
    q:string
  }>
}) => {
  await dbConnect();
  const searchParams = await props.searchParams

  let session = await auth();
  const user = await User.findById(session?.user?.id);

  if (user) {
    const inCompleteProfile =
      !user?.mobile || !user?.role || (!user.mobile && user.role === "user");
    if (inCompleteProfile) {
      return <EditRoleMobile />;
    }
  }

  const plainUser = JSON.parse(JSON.stringify(user));

let groceryList:IGrocery[] = []
if(searchParams.q){
  groceryList = await Grocery.find({
    $or:[
      {name:{$regex:searchParams?.q || '',$options:"i"}},
      {category:{$regex:searchParams?.q || '' , $options:"i"}}
    ]
  })
}else{
  groceryList = await Grocery.find({})
}
  return (
    <>
      <HomeWrapper user={plainUser} />
      {plainUser &&  <GeoUpdater userId={plainUser._id}/>}
    
      {user?.role == "deliveryBoy" ? (
        <DeliveryBoy />
        
      ) : user?.role == "admin" ? (
        <AdminDashboard />
      ) : (
        <UserDashboard groceriesList={groceryList}/>
      )}
      <Footer user={plainUser}/>
    </>
  );
};

export default Home;
