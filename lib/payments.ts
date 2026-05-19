export function validateCard(
  formData: FormData
): { ok: true; last4: string } | { ok: false; error: string } {
  const name = String(formData.get("cardName") ?? "").trim();
  const numberRaw = String(formData.get("cardNumber") ?? "").replace(/\D/g, "");
  const exp = String(formData.get("cardExp") ?? "").trim();
  const cvc = String(formData.get("cardCvc") ?? "").trim();

  if (!name) return { ok: false, error: "Cardholder name is required." };
  if (!/^\d{13,19}$/.test(numberRaw))
    return { ok: false, error: "Card number looks invalid." };
  if (!/^\d{2}\/\d{2}$/.test(exp))
    return { ok: false, error: "Expiry must be in MM/YY format." };
  if (!/^\d{3,4}$/.test(cvc))
    return { ok: false, error: "CVC must be 3 or 4 digits." };

  return { ok: true, last4: numberRaw.slice(-4) };
}
