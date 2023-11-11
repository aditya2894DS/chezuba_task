import { useEffect, useState } from "react";
import ProductAdder from "./ProductAdder";
import { OrderContext } from "../Context";
import { capitalize } from "../Helper/Capitalize";
import validateForm from "../Helper/ValidateForm";
import "../Style/CreateOrderStyle.css";

export default function CreateOrderComponent() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");

  const [orderObj, setOrderObj] = useState({
    c_name: "",
    c_phno: "",
    cake: 0,
    cookies: 0,
    muffins: 0,
  });

  const [total, setTotal] = useState(0);

  function handleOrderSubmit() {
    let f_name = capitalize(firstName);
    let l_name = capitalize(lastName);

    let [isValid, mesg] = validateForm(f_name, l_name, orderObj);

    if (isValid) {
      let formObj = { ...orderObj, c_name: f_name + " " + l_name };
      try {
        fetch("http://localhost:3001/order/createorder", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formObj),
        })
          .then((res) => res.json())
          .then((json) => {
            setMessage(mesg);
          });
      } catch (err) {
        console.error(err);
      }
    } else {
      setMessage(mesg);
    }
  }

  function handleFirstName(e) {
    setFirstName(e.target.value);
  }

  function handleLastName(e) {
    setLastName(e.target.value);
  }

  function handlePhno(e) {
    setOrderObj({ ...orderObj, c_phno: e.target.value });
  }

  useEffect(() => {
    let totalPrice =
      orderObj.cake * 500 + orderObj.cookies * 50 + orderObj.muffins * 100;
    if (isNaN(totalPrice)) {
      setTotal(0);
    } else {
      setTotal(totalPrice);
    }
  }, [orderObj]);

  return (
    <>
      <OrderContext.Provider value={[orderObj, setOrderObj]}>
        <div className="create-order-container">
          <form className="customer-detail-form">
            <label htmlFor="customer-first-name">Customer first name</label>
            <input
              id="customer-first-name"
              className="input-field"
              type="text"
              onChange={handleFirstName}
              value={firstName}
            />
            <label htmlFor="customer-last-name">Customer last name</label>
            <input
              id="customer-last-name"
              className="input-field"
              type="text"
              onChange={handleLastName}
              value={lastName}
            />

            <label htmlFor="customer-phno">Customer phone number</label>
            <input
              id="customer-phno"
              className="input-field"
              type="text"
              value={orderObj.c_phno}
              onChange={handlePhno}
            />
            <h5>{message}</h5>
          </form>
          <div className="right-col">
            <form className="order-detail-form">
              <ProductAdder name="Cake" price={500} />
              <ProductAdder name="Cookies" price={50} />
              <ProductAdder name="Muffins" price={100} />
            </form>
            <p id="errorElement"></p>
            <p>Total: Rs.{total}</p>
            <button onClick={handleOrderSubmit} type="button">
              Checkout
            </button>
          </div>
        </div>
      </OrderContext.Provider>
    </>
  );
}
