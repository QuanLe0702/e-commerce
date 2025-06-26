import React, { useState, useEffect } from "react";
import icons from "../ultils/icons";
import { apiGetProducts } from "../apis/product";
import { renderStarFromNumber, formatMoney } from "../ultils/helper";
import { CountDown } from ".";

const { AiFillStar, AiOutlineMenu } = icons;

// Hàm tính thời gian còn lại đến 0h đêm hôm sau (giờ Việt Nam GMT+7)
function getTimeToMidnightVN() {
  const now = new Date();
  // Giờ Việt Nam là GMT+7
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const nowVN = new Date(utc + 7 * 60 * 60 * 1000);
  const tomorrow = new Date(nowVN);
  tomorrow.setHours(24, 0, 0, 0); // 0h đêm hôm sau
  const diff = tomorrow - nowVN;
  const hour = Math.floor(diff / (1000 * 60 * 60));
  const minute = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const second = Math.floor((diff % (1000 * 60)) / 1000);
  return { hour, minute, second };
}

// Hàm lấy ngày hiện tại theo giờ Việt Nam (yyyy-mm-dd)
function getTodayVN() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const nowVN = new Date(utc + 7 * 60 * 60 * 1000);
  return nowVN.toISOString().slice(0, 10);
}

const DealDaily = () => {
  const [dealdaily, setDealdaily] = useState(null);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  // Hàm random sản phẩm, đảm bảo khác id hiện tại
  const fetchDealDaily = async (currentId = null) => {
    const limit = 20;
    const maxTries = 10;
    let found = false;
    let tries = 0;
    let result = null;

    // Lấy tổng số sản phẩm để tính tổng số trang
    const firstResponse = await apiGetProducts({ limit: 1, page: 1 });
    if (!firstResponse.success) {
      setDealdaily(null);
      return null;
    }
    const totalProducts = firstResponse.totalProducts || firstResponse.count;
    const totalPages = Math.ceil(totalProducts / limit);

    while (!found && tries < maxTries) {
      tries++;
      const randomPage = Math.floor(Math.random() * totalPages) + 1;
      const response = await apiGetProducts({
        limit,
        page: randomPage
      });

      if (response.success && response.products.length > 0) {
        // Ưu tiên sản phẩm 5 sao
        let fiveStarProducts = response.products.filter(p => p.totalRatings === 5);
        if (currentId) fiveStarProducts = fiveStarProducts.filter(p => p._id !== currentId);
        if (fiveStarProducts.length > 0) {
          const randomIndex = Math.floor(Math.random() * fiveStarProducts.length);
          result = fiveStarProducts[randomIndex];
          found = true;
          break;
        }

        // Nếu đã thử 5 lần mà không có 5 sao, chấp nhận 4 sao
        if (tries >= 6 && tries < 10) {
          let fourStarProducts = response.products.filter(p => p.totalRatings === 4);
          if (currentId) fourStarProducts = fourStarProducts.filter(p => p._id !== currentId);
          if (fourStarProducts.length > 0) {
            const randomIndex = Math.floor(Math.random() * fourStarProducts.length);
            result = fourStarProducts[randomIndex];
            found = true;
            break;
          }
        }

        // Nếu đã thử 10 lần, lấy sản phẩm có số sao cao nhất ở page này
        if (tries >= 10) {
          const maxRating = Math.max(...response.products.map(p => p.totalRatings));
          let maxRatingProducts = response.products.filter(p => p.totalRatings === maxRating);
          if (currentId) maxRatingProducts = maxRatingProducts.filter(p => p._id !== currentId);
          if (maxRatingProducts.length > 0) {
            const randomIndex = Math.floor(Math.random() * maxRatingProducts.length);
            result = maxRatingProducts[randomIndex];
            found = true;
            break;
          }
        }
      }
    }

    return result;
  };

  // Khi mount hoặc reload, set lại đồng hồ và random sản phẩm
  useEffect(() => {
    const { hour, minute, second } = getTimeToMidnightVN();
    setHour(hour);
    setMinute(minute);
    setSecond(second);
    const today = getTodayVN();
    const saved = localStorage.getItem('dealDaily');
    if (saved) {
      try {
        const { date, product } = JSON.parse(saved);
        if (date === today) {
          setDealdaily(product);
          return;
        }
      } catch (e) {}
    }
    // Nếu chưa có hoặc sang ngày mới, random lại
    fetchDealDaily().then((product) => {
      setDealdaily(product);
      localStorage.setItem('dealDaily', JSON.stringify({ date: today, product }));
    });
    // eslint-disable-next-line
  }, []);

  // Đếm ngược tới 0h đêm, khi hết giờ thì random lại sản phẩm và reset đồng hồ
  useEffect(() => {
    let idInterval = setInterval(() => {
      if (second > 0) {
        setSecond((prev) => prev - 1);
      } else {
        if (minute > 0) {
          setMinute((prev) => prev - 1);
          setSecond(59);
        } else {
          if (hour > 0) {
            setHour((prev) => prev - 1);
            setMinute(59);
            setSecond(59);
          } else {
            // Hết giờ, random lại sản phẩm và reset đồng hồ, đồng thời lưu vào localStorage
            fetchDealDaily(dealdaily?._id).then((product) => {
              setDealdaily(product);
              const today = getTodayVN();
              localStorage.setItem('dealDaily', JSON.stringify({ date: today, product }));
            });
            const { hour, minute, second } = getTimeToMidnightVN();
            setHour(hour);
            setMinute(minute);
            setSecond(second);
          }
        }
      }
    }, 1000);
    return () => {
      clearInterval(idInterval);
    };
  }, [hour, second, minute, dealdaily]);

  return (
    <div className="border w-full flex-auto">
      <div className="flex items-center justify-between p-4 w-full">
        <span className="flex-1 flex justify-center">
          <AiFillStar size={20} color="#DD1111" />
        </span>
        <span className="flex-8 font-semibold text-[16px] flex justify-center text-gray-700">
          TOP RATED
        </span>
        <span className="flex-1"></span>
      </div>
      <div className="w-full flex flex-col items-center pt-8 px-4 gap-2">
        <img
          src={
            dealdaily?.thumb ||
            "https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png"
          }
          alt=""
          className="w-full object-contain"
        />

        <span className="line-clamp-1 text-center">{dealdaily?.title}</span>
        <span className="flex h-4">
          {renderStarFromNumber(dealdaily?.totalRatings, 20)}
        </span>
        <span>
          {typeof dealdaily?.price === "number"
            ? `${formatMoney(dealdaily.price)} VND`
            : ""}
        </span>
      </div>
      <div className="px-4 mt-8">
        <div className="flex justify-center gap-2 items-center">
          <CountDown unit={"Hour"} number={hour} />
          <CountDown unit={"Minute"} number={minute} />
          <CountDown unit={"Second"} number={second} />
        </div>
        <button
          type="button"
          className="flex gap-2 items-center justify-center w-full bg-main hover:bg-gray-800 text-white font-medium py-2"
        >
          <AiOutlineMenu />
          <span>Options</span>
        </button>
      </div>
    </div>
  );
};

export default DealDaily;
