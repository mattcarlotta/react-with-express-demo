import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [isLoading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API}/orders`);
        const data = await res.json();

        setOrders(data.orders);
      } catch (error) {
        setError(error.toString());
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (error) return <h1 className="error">Error: {error}</h1>;

  return (
    <div className="app">
      <header className="app-header">
        {!isLoading ? (
          <>
            <h1>Orders</h1>
            <pre className="order-details">
              <code>{JSON.stringify(orders, null, 2)}</code>
            </pre>
          </>
        ) : (
          <h1 className="loading-orders">Loading...</h1>
        )}
      </header>
    </div>
  );
}

export default App;
