/*
Copyright 2016 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

//jshint esversion: 6
import {pushLocationHash} from 'url-tools';

export default class CartView {

  constructor (cart, containerId='cart') {
    this._cart = cart;
    this._containerId = containerId;
    this._element = 'tr';
    this._elementClass = 'product';
    this._clickHandler = null;
    this._container = document.getElementById(this._containerId);
    this._tbody = this._container.querySelector('tbody');
    this._checkoutBtn = document.getElementById('checkoutBtn');
  }

  install() {
    this._clickHandler = this._handleClick.bind(this);
    this._container.addEventListener('click', this._clickHandler, true);
    // Checkout button switches hash to "pay", will cause the form to open
    this._checkoutBtn.addEventListener('click', this._goToPayment.bind(this));
  }

  render () {
    // Remove existing products
    let itemRows = this._tbody.querySelectorAll(this.itemSelector);
    for (var i=0; i < itemRows.length; i++) {
      this._tbody.removeChild(itemRows[i]);
    }
    for (let product of this._cart.cart) {
      let placeholder = document.createElement('tbody');
      // TODO add mdl "delete" icon
      placeholder.innerHTML = `<tr class="product" data-sku="${product.sku}">
        <td class="mdl-data-table__cell-non-numeric">${product.title}</td>
        <td>${product.quantity}</td>
        <td>$${product.price}</td>
        <td><button class="mdl-button mdl-button--colored mdl-js-button
              mdl-js-ripple-effect mdl-button--accent delete"
              data-sku="${product.sku}" data-action="remove">remove</button>
        </td>
      </tr>`;
      this._tbody.appendChild(placeholder.firstElementChild); // WARN: no ie8
    }
    // Add the total price
    this.updateTotal();
  }

  updateTotal() {
    document.getElementById('cart-total').innerText = `$${this._cart.total}`;
  }

  removeFromView(sku) {
    let row = this._tbody.querySelector(`tr[data-sku=${sku}]`);
    if (row) {
      row.parentNode.removeChild(row);
    }
    this.updateTotal();
  }

  set visible(vis) {
    if (vis && !this.visible) {
      this.render(); // redraw before reveal
    }
    if (vis) {
      this._container.removeAttribute('hidden');
    } else {
      this._container.setAttribute('hidden', true);
    }
  }

  get visible () {
    return !this._container.hasAttribute('hidden');
  }

  _goToPayment() {
    pushLocationHash('pay');
  }

  _handleClick(event) {
    event.preventDefault();
    if (event.target.dataset) {
      var sku = event.target.dataset.sku;
      var action = event.target.dataset.action;
      if (sku && action == 'remove') {
        var product = this._cart.findItem(sku);
        this._cart.remove(product);
        this.removeFromView(sku);
      }
    }
    // TODO otherwise, handle checkout button
  }

  // utility for unit testing (used in counting the number of elements)
  get itemSelector() {
    return `${this._element}.${this._elementClass}[data-sku]`;
  }

}
