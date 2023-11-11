import OrderByStatusWidget from "./OrderByStatusWidget";
import OrderByProductWidget from "./OrderByProductWidget";
import '../Style/Dashboard.css';
import TopBranches from "./TopBranches";

export default function Dashboard(){
    return(
        <>
        <div className="dashboard-container">
            <OrderByStatusWidget />
            <OrderByProductWidget />
            <TopBranches />
        </div>
        </>
    )
}