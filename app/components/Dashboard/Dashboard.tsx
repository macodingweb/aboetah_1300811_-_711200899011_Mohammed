import Link from "next/link";
import { useEffect, useState } from "react";

function Dashboard() {
  const [admin, setAdmin] = useState(0);
  const [dashboardData, setDashboardData] = useState([{
    customers_Count: 0,
    special_CustomersCount: 0,
    bad_CustomersCount: 0,
    overdue_Installments: 0,
    must_Now: 0,
    totalEarnings: 0,
  }]);
  const [cardA, setCardA] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("userAuth")) {
      window.location.href = "/login";
    } else {
      setAdmin(Number(sessionStorage.getItem("userAuth")));
    }
  }, []);

  useEffect(() => {
    const handleData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5002/api/dashboard-data/${admin}`
        );
        const data = await response.json();
        console.log(data);
        setDashboardData(data); // تخزين البيانات كمصفوفة
      } catch (err) {
        console.log(err);
      }
    };

    if (admin !== 0) {
      handleData();
    }
  }, [admin]); // تنفيذ `handleData` عند تغير `admin`

  return (
    <>
      <div className="content relative w-[100%] mr-[30px]">
        <div className="card-group main-grid">
          <div onClick={() => setCardA(!cardA)} className="card p-6 border-solid border-[2px] border-black bg-white rounded-[8px] main-shadow-lg main-shadow-lg-hover transition-all">
            <div className="info flex items-center justify-between pb-5 border-solid border-x-0 border-y-0 border-b-[1px] border-black">
              <span className="text-[14px] font-[700] main-text-shadow">
                عدد العملاء
              </span>
              <div className="icon w-[20px]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                  <path d="M72 88a56 56 0 1 1 112 0A56 56 0 1 1 72 88zM64 245.7C54 256.9 48 271.8 48 288s6 31.1 16 42.3l0-84.7zm144.4-49.3C178.7 222.7 160 261.2 160 304c0 34.3 12 65.8 32 90.5l0 21.5c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-26.8C26.2 371.2 0 332.7 0 288c0-61.9 50.1-112 112-112l32 0c24 0 46.2 7.5 64.4 20.3zM448 416l0-21.5c20-24.7 32-56.2 32-90.5c0-42.8-18.7-81.3-48.4-107.7C449.8 183.5 472 176 496 176l32 0c61.9 0 112 50.1 112 112c0 44.7-26.2 83.2-64 101.2l0 26.8c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32zm8-328a56 56 0 1 1 112 0A56 56 0 1 1 456 88zM576 245.7l0 84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM320 32a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM240 304c0 16.2 6 31 16 42.3l0-84.7c-10 11.3-16 26.1-16 42.3zm144-42.3l0 84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM448 304c0 44.7-26.2 83.2-64 101.2l0 42.8c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-42.8c-37.8-18-64-56.5-64-101.2c0-61.9 50.1-112 112-112l32 0c61.9 0 112 50.1 112 112z" />
                </svg>
              </div>
            </div>
            <div style={cardA ? {filter: "blur(0)"} : {filter: "blur(12px)"}} className="value select-none text-center text-[18px] font-bold text-slate-800 my-8 blur-[10px]">
              {dashboardData.length > 0
                ? dashboardData[0].customers_Count
                : "لا توجد بيانات"}
            </div>
          </div>
          <div onClick={() => setCardA(!cardA)} className="card p-6 border-solid border-[2px] border-black bg-white rounded-[8px] main-shadow-lg main-shadow-lg-hover transition-all">
            <div className="info flex items-center justify-between pb-5 border-solid border-x-0 border-y-0 border-b-[1px] border-black">
              <span className="text-[14px] font-[700] main-text-shadow">
                رأس المال
              </span>
              <div className="icon w-[20px]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                  <path d="M64 64C28.7 64 0 92.7 0 128L0 384c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L64 64zm64 320l-64 0 0-64c35.3 0 64 28.7 64 64zM64 192l0-64 64 0c0 35.3-28.7 64-64 64zM448 384c0-35.3 28.7-64 64-64l0 64-64 0zm64-192c-35.3 0-64-28.7-64-64l64 0 0 64zM288 160a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
                </svg>
              </div>
            </div>
            <div style={cardA ? {filter: "blur(0)"} : {filter: "blur(12px)"}} className="value select-none text-center text-[18px] font-bold text-slate-800 my-8 blur-[10px]">
              0
            </div>
          </div>
          <div onClick={() => setCardA(!cardA)} className="card p-6 border-solid border-[2px] border-black bg-white rounded-[8px] main-shadow-lg main-shadow-lg-hover transition-all">
            <div className="info flex items-center justify-between pb-5 border-solid border-x-0 border-y-0 border-b-[1px] border-black">
              <span className="text-[14px] font-[700] main-text-shadow">
                عميل مميز
              </span>
              <div className="icon w-[20px]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M4.1 38.2C1.4 34.2 0 29.4 0 24.6C0 11 11 0 24.6 0L133.9 0c11.2 0 21.7 5.9 27.4 15.5l68.5 114.1c-48.2 6.1-91.3 28.6-123.4 61.9L4.1 38.2zm503.7 0L405.6 191.5c-32.1-33.3-75.2-55.8-123.4-61.9L350.7 15.5C356.5 5.9 366.9 0 378.1 0L487.4 0C501 0 512 11 512 24.6c0 4.8-1.4 9.6-4.1 13.6zM80 336a176 176 0 1 1 352 0A176 176 0 1 1 80 336zm184.4-94.9c-3.4-7-13.3-7-16.8 0l-22.4 45.4c-1.4 2.8-4 4.7-7 5.1L168 298.9c-7.7 1.1-10.7 10.5-5.2 16l36.3 35.4c2.2 2.2 3.2 5.2 2.7 8.3l-8.6 49.9c-1.3 7.6 6.7 13.5 13.6 9.9l44.8-23.6c2.7-1.4 6-1.4 8.7 0l44.8 23.6c6.9 3.6 14.9-2.2 13.6-9.9l-8.6-49.9c-.5-3 .5-6.1 2.7-8.3l36.3-35.4c5.6-5.4 2.5-14.8-5.2-16l-50.1-7.3c-3-.4-5.7-2.4-7-5.1l-22.4-45.4z" />
                </svg>
              </div>
            </div>
            <div style={cardA ? {filter: "blur(0)"} : {filter: "blur(12px)"}} className="value select-none text-center text-[18px] font-bold text-slate-800 my-8 blur-[10px]">
              {dashboardData.length > 0
                ? dashboardData[0].special_CustomersCount
                : "لا توجد بيانات"}
            </div>
          </div>
          <div onClick={() => setCardA(!cardA)} className="card p-6 border-solid border-[2px] border-black bg-white rounded-[8px] main-shadow-lg main-shadow-lg-hover transition-all">
            <div className="info flex items-center justify-between pb-5 border-solid border-x-0 border-y-0 border-b-[1px] border-black">
              <span className="text-[14px] font-[700] main-text-shadow">
                عميل سئ
              </span>
              <div className="icon w-[20px]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                  <path d="M72 88a56 56 0 1 1 112 0A56 56 0 1 1 72 88zM64 245.7C54 256.9 48 271.8 48 288s6 31.1 16 42.3l0-84.7zm144.4-49.3C178.7 222.7 160 261.2 160 304c0 34.3 12 65.8 32 90.5l0 21.5c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-26.8C26.2 371.2 0 332.7 0 288c0-61.9 50.1-112 112-112l32 0c24 0 46.2 7.5 64.4 20.3zM448 416l0-21.5c20-24.7 32-56.2 32-90.5c0-42.8-18.7-81.3-48.4-107.7C449.8 183.5 472 176 496 176l32 0c61.9 0 112 50.1 112 112c0 44.7-26.2 83.2-64 101.2l0 26.8c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32zm8-328a56 56 0 1 1 112 0A56 56 0 1 1 456 88zM576 245.7l0 84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM320 32a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM240 304c0 16.2 6 31 16 42.3l0-84.7c-10 11.3-16 26.1-16 42.3zm144-42.3l0 84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM448 304c0 44.7-26.2 83.2-64 101.2l0 42.8c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-42.8c-37.8-18-64-56.5-64-101.2c0-61.9 50.1-112 112-112l32 0c61.9 0 112 50.1 112 112z" />
                </svg>
              </div>
            </div>
            <div style={cardA ? {filter: "blur(0)"} : {filter: "blur(12px)"}} className="value select-none text-center text-[18px] font-bold text-slate-800 my-8 blur-[10px]">
              {dashboardData.length > 0
                ? dashboardData[0].bad_CustomersCount
                : "لا توجد بيانات"}
            </div>
          </div>
          <div onClick={() => setCardA(!cardA)} className="card p-6 border-solid border-[2px] border-black bg-white rounded-[8px] main-shadow-lg main-shadow-lg-hover transition-all">
            <div className="info flex items-center justify-between pb-5 border-solid border-x-0 border-y-0 border-b-[1px] border-black">
              <span className="text-[14px] font-[700] main-text-shadow">
                صافي الأرباح
              </span>
              <div className="icon w-[20px]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M4.1 38.2C1.4 34.2 0 29.4 0 24.6C0 11 11 0 24.6 0L133.9 0c11.2 0 21.7 5.9 27.4 15.5l68.5 114.1c-48.2 6.1-91.3 28.6-123.4 61.9L4.1 38.2zm503.7 0L405.6 191.5c-32.1-33.3-75.2-55.8-123.4-61.9L350.7 15.5C356.5 5.9 366.9 0 378.1 0L487.4 0C501 0 512 11 512 24.6c0 4.8-1.4 9.6-4.1 13.6zM80 336a176 176 0 1 1 352 0A176 176 0 1 1 80 336zm184.4-94.9c-3.4-7-13.3-7-16.8 0l-22.4 45.4c-1.4 2.8-4 4.7-7 5.1L168 298.9c-7.7 1.1-10.7 10.5-5.2 16l36.3 35.4c2.2 2.2 3.2 5.2 2.7 8.3l-8.6 49.9c-1.3 7.6 6.7 13.5 13.6 9.9l44.8-23.6c2.7-1.4 6-1.4 8.7 0l44.8 23.6c6.9 3.6 14.9-2.2 13.6-9.9l-8.6-49.9c-.5-3 .5-6.1 2.7-8.3l36.3-35.4c5.6-5.4 2.5-14.8-5.2-16l-50.1-7.3c-3-.4-5.7-2.4-7-5.1l-22.4-45.4z" />
                </svg>
              </div>
            </div>
            <div style={cardA ? {filter: "blur(0)"} : {filter: "blur(12px)"}} className="value select-none text-center text-[18px] font-bold text-slate-800 my-8 blur-[10px]">
              {dashboardData.length > 0
                ? Math.floor(dashboardData[0].totalEarnings)
                : "لا توجد بيانات"}
            </div>
          </div>
        </div>
        <div className="btn-group mt-[30px]">
          <Link
            href={"/auth/new-installment"}
            className="btn w-[280px] flex justify-between border-solid border-[2px] border-black transition-all cursor-pointer items-center p-4 rounded-[4px] bg-white main-shadow-lg main-shadow-lg-hover"
          >
            <span className="text-[14px] font-semibold">إضافة قسط</span>
            <div className="icon w-[20px]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M96 32l0 32L48 64C21.5 64 0 85.5 0 112l0 48 448 0 0-48c0-26.5-21.5-48-48-48l-48 0 0-32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 32L160 64l0-32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192L0 192 0 464c0 26.5 21.5 48 48 48l352 0c26.5 0 48-21.5 48-48l0-272zM224 248c13.3 0 24 10.7 24 24l0 56 56 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-56 0 0 56c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-56-56 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l56 0 0-56c0-13.3 10.7-24 24-24z" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
export default Dashboard;
