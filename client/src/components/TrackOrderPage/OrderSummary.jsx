import React from "react";
import { useEffect, useState } from "react";

const OrderSummary = () => {
    const [orderItems, setOrderItems] = useState({
    propaneQuantity : 0,
    butaneQuantity : 0,
    propanePrice : 100,
    butanePrice: 50,
    deliveryFee: 20,
    subtotal: 0,
    total: 0
    });

    useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem('lastOrder'));
    if (savedOrder){
      setOrderItems({
        propaneQuantity : savedOrder.propaneQuantity,
        butaneQuantity : savedOrder.butaneQuantity,
        propanePrice : savedOrder.propanePrice,
        butanePrice: savedOrder.butanePrice,
        deliveryFee: savedOrder.deliveryFee,
        subtotal: savedOrder.subtotal,
        total: savedOrder.total
      })
    }
  },[]);

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-xl font-bold mb-4" style={{color: '#245FA6'}}>
          Détails de la commande
        </h3>
        
        <div className="space-y-3">
        {orderItems.propaneQuantity > 0 && (
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <span className="font-medium">Bouteille Propane 34kg</span>
                <span className="text-gray-600 ml-2">x {orderItems.propaneQuantity}</span>
              </div>
              <div className="text-right">
                <div className="font-bold">{orderItems.propaneQuantity * orderItems.propanePrice} DH</div>
                <div className="text-sm text-gray-600">{orderItems.propanePrice} DH/unité</div>
              </div>
            </div>
          )}
          
          {orderItems.butaneQuantity > 0 && (
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <span className="font-medium">Bouteille Butane 12kg</span>
                <span className="text-gray-600 ml-2">x {orderItems.butaneQuantity}</span>
              </div>
              <div className="text-right">
                <div className="font-bold">{orderItems.butaneQuantity * orderItems.butanePrice} DH</div>
                <div className="text-sm text-gray-600">{orderItems.butanePrice} DH/unité</div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center py-2 border-b">
            <span className="font-medium">Frais de livraison</span>
            <span className="font-bold">{orderItems.deliveryFee} DH</span>
          </div>

          <div className="flex justify-between items-center py-3 text-xl font-bold" style={{color: '#1F55A3'}}>
            <span>Total</span>
            <span>{orderItems.total} DH</span>
          </div>
        </div>
      </div>
    );
  };
export default OrderSummary;