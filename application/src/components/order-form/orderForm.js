import React, { Component } from 'react';
import { Template } from '../../components';
import { connect } from 'react-redux';
import { SERVER_IP } from '../../private';
import './orderForm.css';

const ADD_ORDER_URL = `${SERVER_IP}/api/add-order`;
const EDIT_ORDER_URL = `${SERVER_IP}/api/edit-order`;
const GET_ORDER_URL = (id) => `${SERVER_IP}/api/${id}`;
const mapStateToProps = (state) => ({
    auth: state.auth,
});

class OrderForm extends Component {
    // contrustor setting up my state
    constructor(props) {
        super(props);
        this.state = {
            formLabel: (!props.match.params.id) ? "I'd like to order..." : "I need to change something real quick...",
            id: props.match.params.id || "",
            order_item: "",
            quantity: "1"
        }
    }

    // TODO: learn how to, and implement, data prefetching in react for this
    componentDidMount() {
      if (!!this.state.id) {
        fetch(GET_ORDER_URL(this.state.id)).then(async res => {
            const body = await res.json();
            this.setState({
              order_item: body.order_item,
              quantity: body.quantity.toString()
            });
        });
      }
    }
    // setting funtionality for template 
    menuItemChosen(event) {
        this.setState({ order_item: event.target.value });
    }

    menuQuantityChosen(event) {
        this.setState({ quantity: event.target.value });
    }
    // submt ordor form that pings api 
    submitOrder(event) {
        event.preventDefault();
        if (this.state.order_item === "") return;
        const SUBMIT_URL = (!!this.state.id) ? EDIT_ORDER_URL : ADD_ORDER_URL;
        fetch(SUBMIT_URL, {
            method: 'POST',
            body: JSON.stringify({
                id: this.state.id,
                order_item: this.state.order_item,
                quantity: this.state.quantity,
                ordered_by: this.props.auth.email || 'Unknown!',
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(response => console.log("Success", JSON.stringify(response)))
        .catch(error => console.error(error));
    }

    // renders the view 
    render() {
        return (
            <Template>
                <div className="form-wrapper">
                    <form>
                        <label className="form-label">{this.state.formLabel}</label><br />
                        <select 
                            value={this.state.order_item} 
                            onChange={(event) => this.menuItemChosen(event)}
                            className="menu-select"
                        >
                            <option value="" defaultValue disabled hidden>Lunch menu</option>
                            <option value="Soup of the Day">Soup of the Day</option>
                            <option value="Linguini With White Wine Sauce">Linguini With White Wine Sauce</option>
                            <option value="Eggplant and Mushroom Panini">Eggplant and Mushroom Panini</option>
                            <option value="Chili Con Carne">Chili Con Carne</option>
                        </select><br />
                        <label className="qty-label">Qty:</label>
                        <select value={this.state.quantity} onChange={(event) => this.menuQuantityChosen(event)}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                        <button type="button" className="order-btn" onClick={(event) => this.submitOrder(event)}>Order It!</button>
                    </form>
                </div>
            </Template>
        );
    }
}

// using react redux
export default connect(mapStateToProps, null)(OrderForm);