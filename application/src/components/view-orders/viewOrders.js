import React, { Component } from 'react';
import { Template } from '../../components';
import { SERVER_IP } from '../../private';

import './viewOrders.css';

class ViewOrders extends Component {
  state = {
    orders: [],
  };

  componentDidMount() {
    fetch(`${SERVER_IP}/api/current-orders`)
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          this.setState({ orders: response.orders });
        } else {
          console.log('Error getting orders');
        }
      });
  }

  editOrder() {}

  deleteOrder(order) {
    fetch(`${SERVER_IP}/api/delete-order`, {
      method: 'POST',
      body: JSON.stringify({
        id: order._id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((response) => console.log(response.success))
      .catch((error) => console.error(error));
  }

  render() {
    return (
      <Template>
        <div className="container-fluid">
          {this.state.orders.map((order) => {
            let options = {
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
              hour12: false,
            };
            const createdDate = new Intl.DateTimeFormat(
              'en-US',
              options
            ).format(new Date(order.createdAt));

            return (
              <div className="row view-order-container" key={order._id}>
                <div className="col-md-4 view-order-left-col p-3">
                  <h2>{order.order_item}</h2>
                  <p>Ordered by: {order.ordered_by || ''}</p>
                </div>
                <div className="col-md-4 d-flex view-order-middle-col">
                  <p>Order placed at {`${createdDate}`}</p>
                  <p>Quantity: {order.quantity}</p>
                </div>
                <div className="col-md-4 view-order-right-col">
                  <button className="btn btn-success">Edit</button>
                  <button
                    className="btn btn-danger"
                    onClick={() => this.deleteOrder(order)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Template>
    );
  }
}

export default ViewOrders;

