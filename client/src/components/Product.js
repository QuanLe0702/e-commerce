import React from "react";
import { formatMoney } from "../ultils/helper";
import label from "../assets/label.png";

const Product = ({ productData }) => {
  return (
    <div className="w-full text-base px-[10px]">
      <div className="w-full border p-[15px] flex flex-col items-center">
        <div className="w-full relative">
          <img
            src={
              productData?.thumb ||
              "https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png"
            }
            alt=""
            className="w-[243px] h-[243px] object-cover"
          />
          <img src={label} alt="" className="absolute top-[-15px] left-[-32px] w-[100px] h-[35px] object-cover"/>
          <span className="font-bold top-[-15px] left-[-8px] text-white absolute">New</span>
        </div>
        <div className="flex flex-col mt-[15px] items-start gap-1 w-full">
          <span className="line-clamp-1">{productData?.title}</span>
          <span>{`${formatMoney(productData?.price)} VND`}</span>
        </div>
      </div>
    </div>
  );
};

export default Product;
