import { useContext, useEffect, useRef, useState } from "react";
import { OrderContext } from "../Context";

export default function ProductAdder(props) {
  const [context, setContext] = useContext(OrderContext);

  const [count, setCount] = useState(0);
  const priceRef = useRef(0);

  function increment() {
    setCount(count + 1);
  }

  function decrement() {
    if (count > 0) {
      setCount(count - 1);
    } else setCount(0);
  }

  useEffect(() => {
    if(props.clearText){
      setCount(0)
    }
  }, [props.clearText])

  useEffect(() => {
    let total = count * props.price;
    priceRef.current.innerText = `Rs. ${total}`;

    if(isNaN(total)){
      priceRef.current.innerText = `Rs. 0`;
    }

    switch (props.name) {
      case "Cake":
        setContext({ ...context, cake: count });
        break;
      case "Cookies":
        setContext({ ...context, cookies: count });
        break;
      case "Muffins":
        setContext({ ...context, muffins: count });
        break;
      default:
        return true;
    }
  }, [count, props.price]);

  return (
    <>
      <div className="product-adder-component">
          <p className="prod-name">{props.name}</p>
        <div className="counter-container">
          <button type="button" onClick={decrement} id="dec-button"></button>
          <input
            type="text"
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
          <button type="button" onClick={increment} id="inc-button"></button>
        </div>
          <p ref={priceRef} className="subtotal"></p>
      </div>
    </>
  );
}
