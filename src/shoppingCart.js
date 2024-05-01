"use strict";

import items from "../items.json";
import formatCurrency from "../util/formatCurrency.js";
import addGlobalEventListener from "../util/addGlobalEventListener.js";

const shoppingCartBtn = document.querySelector("[data-shoppingCart-button]");
const shoppingCartItemsWrapper = document.querySelector("[data-shoppingCart-items-wrapper]");
let shoppingCart = [];
const imageUrl = "https://github.com/e-d-i/shoppingCart/blob/main/src/img";
const shoppingCartItemTemplate = document.querySelector("#shoppingCart-item-template");
const shoppingCartItemContainer = document.querySelector("[data-shoppingCart-item-container]");
const shoppingCartQuantity = document.querySelector("[data-shoppingCart-quantity]");
const shoppingCartTotal = document.querySelector("[data-shoppingCart-total]");
const cart = document.querySelector("[data-cart]");
const sessionStorageKey = "Shopping_Cart-cart";

export function setupShoppingCart() {
  addGlobalEventListener("click", "[data-remove-from-shoppingCart-button]", e => {
    const id = parseInt(e.target.closest("[data-item]").dataset.itemId);
    removeFromShoppingCart(id);
  });

  shoppingCart = loadShoppingCart();
  renderShoppingCart();

  shoppingCartBtn.addEventListener("click", () => {
    shoppingCartItemsWrapper.classList.toggle("invisible");
  });
};

function saveShoppingCart() {
  sessionStorage.setItem(sessionStorageKey, JSON.stringify(shoppingCart));
}

function loadShoppingCart() {
  const shoppingCart = sessionStorage.getItem(sessionStorageKey);
  return JSON.parse(shoppingCart) || [];
}

export function addToShoppingCart(id) {
  const existingItem = shoppingCart.find(entry => entry.id === id);
  if(existingItem) {
    existingItem.quantity++;
  } else {
    shoppingCart.push({ id: id, quantity: 1 });
  }
  renderShoppingCart();
  saveShoppingCart();
}

function removeFromShoppingCart(id) {
  const existingItem = shoppingCart.find(entry => entry.id === id);
  if(existingItem == null) return;
  shoppingCart = shoppingCart.filter(entry => entry.id !== id);
  renderShoppingCart();
  saveShoppingCart();
}

function renderShoppingCart() {
  if(shoppingCart.length === 0) {
    hideShoppingCart();
  } else {
    showShoppingCart();
    renderShoppingCartItems();
  }
}

function hideShoppingCart() {
  cart.classList.add("invisible");
}

function showShoppingCart() {
  cart.classList.remove("invisible");
  shoppingCartItemsWrapper.classList.add("invisible");
}

function renderShoppingCartItems() {
  shoppingCartItemContainer.innerHTML = "";

  shoppingCartQuantity.innerText = shoppingCart.length;

  const sumTotalInCents = shoppingCart.reduce((sum, entry) => {
    const item = items.find(i => entry.id === i.id);
    return sum + item.priceCents * entry.quantity;
  }, 0);

  shoppingCartTotal.innerText = formatCurrency(sumTotalInCents / 100);

  shoppingCart.forEach(entry => {
    const item = items.find(i => entry.id === i.id);
    const shoppingCartItem = shoppingCartItemTemplate.content.cloneNode(true);

    const container = shoppingCartItem.querySelector("[data-item]");
    container.dataset.itemId = item.id;

    const name = shoppingCartItem.querySelector("[data-name]");
    name.innerText = item.name;

    const image = shoppingCartItem.querySelector("[data-image]");
    image.src = `${imageUrl}/${item.imageRamen}`;

    if(entry.quantity > 1) {
      const quantity = shoppingCartItem.querySelector("[data-quantity]");
      quantity.innerText = `x${entry.quantity}`;
    }

    const price = shoppingCartItem.querySelector("[data-price]");
    price.innerText = formatCurrency(item.priceCents * entry.quantity / 100);

    shoppingCartItemContainer.appendChild(shoppingCartItem);
  })
}