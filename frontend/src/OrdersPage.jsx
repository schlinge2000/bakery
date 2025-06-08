import React, { useEffect, useState } from 'react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('/orders')
      .then(res => res.json())
      .then(setOrders)
      .catch(() => setOrders([]));
  }, []);

  return (
    <div>
      <h2>Bestellungen</h2>
      <ul>
        {orders.map(o => (
          <li key={o.id}>{o.date}: {o.quantity} Stück</li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersPage;
