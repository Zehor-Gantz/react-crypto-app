import { notification } from "antd";

export default function useAddAssetForm({
  coin,
  form,
  assetRef,
  setSubmitted,
  addAsset,
}) {
  const validateMessages = {
    required: "${label} is required",
    types: {
      number: "${label} is not valid number",
    },
    number: {
      range: "${label} must bin between &{min} and &{max}",
    },
  };

  async function onFinish(values) {
    const newAsset = {
      id: coin.id,
      amount: values.amount,
      price: values.price,
      date: values.date?.$d ?? new Date(),
    };
    assetRef.current = newAsset;

    try {
      await addAsset(newAsset);
      setSubmitted(true);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "You are out of luck, try next time",
      });
    }
  }

  function handleAmountChange(value) {
    const price = form.getFieldValue("price");
    form.setFieldsValue({
      total: +(value * price).toFixed(2),
    });
  }

  function handlePriceChange(value) {
    const amount = form.getFieldValue("amount");
    form.setFieldsValue({
      total: +(amount * value).toFixed(2),
    });
  }

  return { validateMessages, onFinish, handleAmountChange, handlePriceChange };
}
