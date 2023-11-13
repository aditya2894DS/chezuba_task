import { useState } from "react";

import '../Style/GetOrder.css';

export default function GetOrderComponent() {
  const [inputId, setInputId] = useState("");
  const [orderData, setOrderData] = useState({products: []});
  const [displayDetails, setDisplayDetails] = useState(false);

  function sendOrderId(e) {
    e.preventDefault();
    try {
      fetch(`http://localhost:3001/order/${inputId}`, { method: "get" })
        .then((res) => res.json())
        .then((json) => getOrderData(json));
    } catch (err) {
      console.error(err);
    }
  }

  function getOrderData(json) {
    let myObj = {}
    let priceArr = [];
    let grandTotal = 0;
    myObj.cust_id = json.msg[0].cust_id;
    myObj.cust_name = json.msg[0].cust_name;
    myObj.status = json.msg[0].status;


    let split = json.msg[0].order_time.split(":");
    let time = `${split[0]}:${split[1]}`;
    myObj.order_time = time;

    let  myDate = new Date(json.msg[0].order_date)
    let day = myDate.getDate();
    let month = myDate.getMonth();
    let year = myDate.getFullYear();

    myObj.order_date = day + '-' + month + '-' + year;

    json.msg.forEach((obj, index) => {
        grandTotal += obj.prod_price * obj.quantity;
        priceArr.push({prod_name: obj.prod_name, quantity: obj.quantity})
    })

    myObj.price = grandTotal;
    myObj.products = priceArr;
    setOrderData(myObj);
    setDisplayDetails(true);
  }

  return (
    <>
      <div className="get-order-container">
        <form className="get-order-form" onSubmit={sendOrderId}>
            <label for="order-id">Order id:</label>
          <input
            type="text"
            id="order-id"
            name="order-id"
            onChange={(e) => setInputId(e.target.value)}
            value={inputId}
          />
          <button type="submit">Get order details</button>
        </form>
        <div className="order-detail-container" style={{display: displayDetails?"block": "none"}}>
            <div className="row row-1">
            <p className="order-detail-text" id="cust-name">Customer name: {orderData.cust_name}</p>    
            <p className="order-detail-text" id="cust-id">Customer id: {orderData.cust_id}</p>    
            </div> 
            <div className="row row-2">
            <p className="order-detail-text" id="o-time">Order time: {orderData.order_time}</p>    
            <p className="order-detail-text" id="o-date">Order date: {orderData.order_date}</p>    
            <p className="order-detail-text" id="o-status">Order status: {orderData.status}</p>    
            </div> 
            <div className="row row-3">
                <p className="order-txt">Orders:</p>
                {
                    orderData.products.map(data => 
                        <div className="prod-details-container">
                            <p>{data.prod_name}:</p>
                            <p>{data.quantity}</p>
                        </div>
                )}
            </div> 
            <div className="row row-4"><p>Total price: Rs. {orderData.price}</p></div>
        </div>
      </div>
    </>
  );
}
