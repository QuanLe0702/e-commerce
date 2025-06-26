import React, { useState } from "react";
import { formatMoney, renderStarFromNumber } from "../ultils/helper";
import label from "../assets/new.png";
import trending from "../assets/trending.png";
import { SelectOption } from ".";
import icons from "../ultils/icons";

const { AiFillEye, AiOutlineMenu, BsFillSuitHeartFill } = icons;

const Product = ({ productData, isNew }) => {
  const [isShowOption, setIsShowOption] = useState(false);
  return (
    <div className="w-full text-base px-[10px]">
      <div
        className="w-full border p-[15px] flex flex-col items-center"
        onMouseEnter={(e) => {
          e.stopPropagation();
          setIsShowOption(true);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setIsShowOption(false);
        }}
      >
        <div className="w-full relative">
          {isShowOption && (
            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 animate-slide-top">
              <SelectOption icon={<AiFillEye />} />
              <SelectOption icon={<AiOutlineMenu />} />
              <SelectOption icon={<BsFillSuitHeartFill />} />
            </div>
          )}
          <img
            src={
              productData?.thumb ||
              "https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png"
            }
            alt=""
            className="w-[243px] h-[243px] object-cover"
          />
          <div
            className={
              isNew
                ? "absolute top-2 right-2 w-[80px] h-[30px] flex items-center justify-center z-10"
                : "absolute top-2 right-2 w-[80px] h-[50px] flex items-center justify-center z-10"
            }
          >
            <img
              src={isNew ? label : trending}
              alt=""
              className="w-[274px] h-[274px] object-contain"
            />
          </div>
        </div>
        <div className="flex flex-col mt-[15px] items-start gap-1 w-full">
          <span className="line-clamp-1">{productData?.title}</span>
          <span>{`${formatMoney(productData?.price)} VND`}</span>
          <span className="flex h-4/6">
            {" "}
            {renderStarFromNumber(productData?.totalRatings)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Product;
