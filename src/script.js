"use strict";

import { setupShop } from "./shop.js";
import { setupShoppingCart } from "./shoppingCart.js";

setupShop();
setupShoppingCart();

const purchaseBtn = document.querySelector("[data-purchase-button]");
if(purchaseBtn) {
  purchaseBtn.addEventListener("click", purchaseClicked);
}

function purchaseClicked() {
  alert("Awesome! Thank you for your purchase!");
  sessionStorage.clear();
  location.reload();
}