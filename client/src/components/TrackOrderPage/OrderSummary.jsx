import React, { useEffect, useState } from "react";

const OrderSummary = () => {
  const [orderData, setOrderData] = useState({
    products: [],
    deliveryFee: 20,
    total: 0,
    subtotal: 0,
  });

  useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem("lastOrder"));
    if (savedOrder) {
      const detailedProducts = savedOrder.products
        .map((product) => {
          const quantity = savedOrder.quantities[product.id] || 0;
          const unit_price = savedOrder.prices[product.id] || 0;
  
          return {
            ...product,
            quantity,
            unit_price
          };
        })
        .filter(p => p.quantity > 0); // Ne garder que ceux commandés
  
      const subtotal = detailedProducts.reduce(
        (sum, item) => sum + item.unit_price * item.quantity,
        0
      );
      const total = subtotal + (savedOrder.deliveryFee || 0);
  
      setOrderData({
        products: detailedProducts,
        deliveryFee: savedOrder.deliveryFee || 0,
        subtotal,
        total,
      });
    }
  }, []);
  

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-xl font-bold mb-4" style={{ color: "#245FA6" }}>
        Détails de la commande
      </h3>

      <div className="space-y-3">
        {orderData.products.map(
          (item) =>
            item.quantity > 0 && (
              <div
                key={item.id}
                className="flex justify-between items-center py-2 border-b"
              >
                <div>
                  <span className="font-medium">{item.nom_court}</span>
                  <span className="text-gray-600 ml-2">x {item.quantity}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{item.quantity * item.unit_price} DH</div>
                  <div className="text-sm text-gray-600">{item.unit_price} DH/unité</div>
                </div>
              </div>
            )
        )}

        <div className="flex justify-between items-center py-2 border-b">
          <span className="font-medium">Frais de livraison</span>
          <span className="font-bold">{orderData.deliveryFee} DH</span>
        </div>

        <div
          className="flex justify-between items-center py-3 text-xl font-bold"
          style={{ color: "#1F55A3" }}
        >
          <span>Total</span>
          <span>{orderData.total} DH</span>
        </div>
      </div>
    </div>
  );
};


export default OrderSummary;