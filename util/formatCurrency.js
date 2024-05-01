"use strict";

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "EUR",
});

export default function formatCurrency(amount) {
  return currencyFormatter.format(amount);
}
