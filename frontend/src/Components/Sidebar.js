import { Outlet, Link } from "react-router-dom";
import '../Style/Sidebar.css';

export default function Sidebar(){
    return(
        <>
        <div className="sidebar-component">
            <ul className="sidebar-list">
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/createorder">Create order</Link></li>
                <li><Link to="/getorder">Get order details</Link></li>
            </ul>
        </div>
        <Outlet />
        </>
    )
}