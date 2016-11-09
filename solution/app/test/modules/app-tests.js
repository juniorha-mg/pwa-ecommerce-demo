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
// jshint esversion: 6
import App from 'app';
import HeaderController from 'header-controller';
import Product from 'product';
// import sinon from 'sinon-es6';
// import $ from 'jquery';

const containerID = 'headers';

QUnit.module('App', {beforeEach: () => {
  let fixture = document.getElementById('qunit-fixture');
  fixture.innerHTML = window.__html__['app-fixture'];
}});


QUnit.test('relays hashChange events', assert => {
  let app = new App();
  let controller = new HeaderController();
  controller.selection = 'cart';
  app.headerController = controller;

  // Falsify an event
  let event = {oldURL: (window.location), newURL: (window.location+'#shop')};
  app._handleHashChange(event);
  assert.equal(controller.selection, 'shop', 'set selection');
  });

QUnit.test('detects cart changes and triggers save', assert => {
  let app = new App();
  let cart = app.cart;
  let storage = app.storage;
  const c10 = new Product('C10', 'C10 Chair', 100.00, 'C10.jpg', 'PUT TEXT HERE');
  app.install();
  storage.key = 'test-cart-storage';
  storage.delete();
  cart.add(c10);
  assert.ok(storage.load(), 'cart saved');
  });

QUnit.test('selection == shop makes only shop visible', assert => {
  let app = new App();
  app.selection = 'shop';
  let shop = document.getElementById('shop');
  let cart = document.getElementById('cart');
  assert.ok(isVisible(shop), 'shop visible');
  assert.ok(!isVisible(cart), 'cart hidden');
  });

QUnit.test('selection == cart makes only cart visible', assert => {
  let app = new App();
  app.selection = 'cart';
  let shop = document.getElementById('shop');
  let cart = document.getElementById('cart');
  assert.ok(!isVisible(shop), 'shop hidden');
  assert.ok(isVisible(cart), 'cart visible');
  });

function isVisible(elt) {
  return !elt.hasAttribute('hidden');
}