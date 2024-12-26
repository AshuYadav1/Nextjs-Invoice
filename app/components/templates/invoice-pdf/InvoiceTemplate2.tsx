// @ts-nocheck
import React from "react";

// Components
import { InvoiceLayout } from "@/app/components";

// Helpers
import { formatNumberWithCommas } from "@/lib/helpers";

// Variables
import { DATE_OPTIONS } from "@/lib/variables";

// Types
import { InvoiceType } from "@/types";

// Function to calculate the total price for an item
const calculateItemTotal = (item) => item.unitPrice * item.quantity;

// Function to calculate IGST
const calculateIGST = (gst, itemTotal) => {
  return (gst / 100) * itemTotal; // Return as a number
};



const InvoiceTemplate = (data: InvoiceType) => {

  const { sender, receiver, details } = data;




  return (
    <InvoiceLayout data={data}>
      <div className="flex justify-between">
        <div>
          <img
            src={details.invoiceLogo || "/assets/img/logo.png"}
            width={140}
            height={100}
            alt={`Logo of ${sender.name}`}
            className=" bg-black rounded-md"
          />
          <h1 className="mt-2 text-lg md:text-xl font-semibold text-blue-600">
            {sender.name}
          </h1>
          <p className="block text-sm font-medium text-gray-800">
            {`PAN :${sender.pan}`}
          </p>
          <p className="block text-sm font-medium text-gray-800">
            {`GST  :${sender.gst}`}
          </p>

          <p className="block text-sm font-medium text-gray-800">
            {sender.email}
          </p>
          <p className="block text-sm font-medium text-gray-800">
            {sender.phone}
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            {sender.company} Invoice
          </h2>
          <span className="mt-1 block text-gray-500">
            {details.invoiceNumber}
          </span>
          <address className="mt-4 not-italic text-gray-800">
            {sender.address}
            <br />
            {sender.zipCode}, {sender.city}
            <br />
            {sender.country}
            <br />
          </address>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Bill to:</h3>
          <h3 className="text-lg font-semibold text-gray-800">
            {receiver.name}
          </h3>
          <address className="mt-2 not-italic text-gray-500">
            {receiver.address}
            <br />
            {receiver.zipCode}
            <br />
            {receiver.city}
            <br />
            {receiver.email}
            <br />
            {receiver.phone}
            <br />
            {receiver.CGST}
          </address>
        </div>
        <div className="sm:text-right space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
            <dl className="grid sm:grid-cols-6 gap-x-3">
              <dt className="col-span-3 font-semibold text-gray-800">
                Invoice date:
              </dt>
              <dd className="col-span-3 text-gray-500">
                {new Date(details.invoiceDate).toLocaleDateString(
                  "en-US",
                  DATE_OPTIONS
                )}
              </dd>
            </dl>
            <dl className="grid sm:grid-cols-6 gap-x-3">
              <dt className="col-span-3 font-semibold text-gray-800">
                Due date:
              </dt>
              <dd className="col-span-3 text-gray-500">
                {new Date(details.dueDate).toLocaleDateString(
                  "en-US",
                  DATE_OPTIONS
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div className="mt-3 overflow-x-auto">
        <div className="border border-gray-200 p-1 rounded-lg space-y-1">
          {/* Header for larger screens */}
          <div className="hidden sm:grid sm:grid-cols-7"> {/* Changed to 7 Columns */}
            <div className="sm:col-span-2 text-xs font-medium text-gray-500 uppercase">
              Item
            </div>
            <div className="text-left text-xs font-medium text-gray-500 uppercase">
              GST %
            </div>
            <div className="text-left text-xs font-medium text-gray-500 uppercase">
              Qty
            </div>
            <div className="text-left text-xs font-medium text-gray-500 uppercase">
              Rate
            </div>
           <div className="text-left text-xs font-medium text-gray-500 uppercase">
              IGST
            </div>
            <div className="text-right text-xs font-medium text-gray-500 uppercase">
              Amount
            </div>
          </div>
          <div className="hidden sm:block border-b border-gray-200"></div>

          {/* Item rows */}
          {/* Item rows */}
{details.items.map((item, index) => {
  const itemTotal = calculateItemTotal(item);
   const igst = calculateIGST(item.gst, itemTotal);
  return (
    <div
      key={index}
      className="grid grid-cols-1 sm:grid-cols-7 gap-y-1 sm:gap-0"  // Changed to 7 Columns
    >
      {/* Item name and description */}
      <div className="col-span-full sm:col-span-2 border-b border-gray-300 p-2 sm:p-0">
        <p className="font-medium text-gray-800">{item.name}</p>
        <p className="text-xs text-gray-600 whitespace-pre-line">
          {item.description}
        </p>
      </div>
      {/* GST */}

      <div className="border-b border-gray-300 p-2 sm:p-0">
        <p className="text-gray-800">{item.gst} %</p>
      </div>
      {/* Quantity */}
      <div className="border-b border-gray-300 p-2 sm:p-0">
        <p className="text-gray-800">{item.quantity}</p>
      </div>
      {/* Rate */}
      <div className="border-b border-gray-300 p-2 sm:p-0">
        <p className="text-gray-800">{item.unitPrice}</p>
      </div>
       {/* IGST */}
         <div className="border-b border-gray-300 p-2 sm:p-0">
          <p className="text-gray-800">
            {formatNumberWithCommas(
              Number(igst)
            )}
          </p>
        </div>

      {/* Total Amount */}
      <div className="border-b border-gray-300 p-2 sm:p-0 text-right">
        <p className="text-gray-800">{item.total}</p>
      </div>
    </div>
  );
})}

          <div className="sm:hidden border-b border-gray-200"></div>
        </div>
      </div>


      <div className="mt-2 flex sm:justify-end">
        <div className="sm:text-right space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
            <dl className="grid sm:grid-cols-5 gap-x-3">
              <dt className="col-span-3 font-semibold text-gray-800">
                Subtotal:
              </dt>
              <dd className="col-span-2 text-gray-500">
                {formatNumberWithCommas(Number(details.subTotal))}{" "}
                {details.currency}
              </dd>
            </dl>
            {details.discountDetails?.amount != undefined &&
              details.discountDetails?.amount > 0 && (
                <dl className="grid sm:grid-cols-5 gap-x-3">
                  <dt className="col-span-3 font-semibold text-gray-800">
                    Discount:
                  </dt>
                  <dd className="col-span-2 text-gray-500">
                    {details.discountDetails.amountType === "amount"
                      ? `- ${details.discountDetails.amount} ${details.currency}`
                      : `- ${details.discountDetails.amount}%`}
                  </dd>
                </dl>
              )}
            {details.taxDetails?.amount != undefined &&
              details.taxDetails?.amount > 0 && (
                <dl className="grid sm:grid-cols-5 gap-x-3">
                  <dt className="col-span-3 font-semibold text-gray-800">
                    Tax:
                  </dt>
                  <dd className="col-span-2 text-gray-500">
                    {details.taxDetails.amountType === "amount"
                      ? `+ ${details.taxDetails.amount} ${details.currency}`
                      : `+ ${details.taxDetails.amount}%`}
                  </dd>
                </dl>
              )}
            {details.shippingDetails?.cost != undefined &&
              details.shippingDetails?.cost > 0 && (
                <dl className="grid sm:grid-cols-5 gap-x-3">
                  <dt className="col-span-3 font-semibold text-gray-800">
                    Shipping:
                  </dt>
                  <dd className="col-span-2 text-gray-500">
                    {details.shippingDetails.costType === "amount"
                      ? `+ ${details.shippingDetails.cost} ${details.currency}`
                      : `+ ${details.shippingDetails.cost}%`}
                  </dd>
                </dl>
              )}
            <dl className="grid sm:grid-cols-5 gap-x-3">
              <dt className="col-span-3 font-semibold text-gray-800">
                Total:
              </dt>
              <dd className="col-span-2 text-gray-500">
                {formatNumberWithCommas(Number(details.totalAmount))}{" "}
                {details.currency}
              </dd>
            </dl>
            {details.totalAmountInWords && (
              <dl className="grid sm:grid-cols-5 gap-x-3">
                <dt className="col-span-3 font-semibold text-gray-800">
                  Total in words:
                </dt>
                <dd className="col-span-2 text-gray-500">
                  <em>
                    {details.totalAmountInWords} {details.currency}
                  </em>
                </dd>
              </dl>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="my-4">
          <div className="my-2">
            <p className="font-semibold text-blue-600">Additional notes:</p>
            <p className="font-regular text-gray-800">
              {details.additionalNotes}
            </p>
          </div>
          <div className="my-2">
            <p className="font-semibold text-blue-600">Payment terms:</p>
            <p className="font-regular text-gray-800">{details.paymentTerms}</p>
          </div>
          <div className="my-2">

          </div>
        </div>
        <p className="text-gray-500 text-sm">
          If you have any questions concerning this invoice, use the following
          contact information:
        </p>
        <div>

        </div>
      </div>

      {/* Signature */}
      {
        <div className="mt-6">
          <p className="font-semibold text-gray-800">Signature:</p>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/vegiwell-2.appspot.com/o/VFTech_Singnature_Blue.png?alt=media&token=cae543d1-7c74-4ab4-8cbf-0e243974648e"
            width={120}
            height={60}
            alt={`Signature of ${sender.name}`}
          />
        </div>
      }
    </InvoiceLayout>
  );
};

export default InvoiceTemplate;