"use client";
import Sidebar from "@/app/components/Sidebar/Sidebar";
import "./installments.css";
import { useEffect, useState } from "react";
import Link from "next/link";

function Installments() {
  const [admin, setAdmin] = useState(0);
  const [filter, setFilter] = useState(false);
  const [installments, setInstallments] = useState([
    {
      id: 0,
      name: "",
      product: "",
      insert_date: "",
      last_paid_date: "",
      installment_valids: 0,
      price: 0,
      total: 0,
      overdue_installments: 0,
      remained_installments: 0,
      down_paid: 0,
    },
  ]);

  useEffect(() => {
    if (!sessionStorage.getItem("userAuth")) {
      window.location.href = "/login";
    } else {
      setAdmin(Number(sessionStorage.getItem("userAuth")));
    }

    const urlParams = new URLSearchParams(window.location.search);

    // التأكد من أن `overdue_filter` يتم تحويله إلى Boolean بشكل صحيح
    setFilter(urlParams.get("overdue_filter") === "true");
  }, []);

  useEffect(() => {
    const handleData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5002/api/installments-data/${admin}/${filter}`
        );
        const data = await response.json();
        console.log(data);
        setInstallments(data); // تخزين البيانات كمصفوفة
      } catch (err) {
        console.log(err);
      }
    };

    if (admin !== 0) {
      handleData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin]); // تنفيذ `handleData` عند تغير `admin`

  const handlingSearch = async (e: React.FormEvent<HTMLInputElement>) => {
    try {
      const response = await fetch(
        `http://localhost:5002/api/search-installments/${admin}/${filter}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            searchQuery: (e.target as HTMLInputElement).value,
          }),
        }
      );

      const data = await response.json();
      setInstallments(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="App p-[30px] w-full h-[100vh] bg-slate-600 flex justify-between">
        <Sidebar />
        <div className="content relative w-[100%] mr-[30px]">
          <div className="search-box relative w-[50%] mb-[30px]">
            <span className="w-[14px] absolute left-[15px] top-2/4 -translate-y-2/4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              </svg>
            </span>
            <input
              onInput={(e) => handlingSearch(e)}
              type="search"
              className="no-search-btn w-full p-4 text-[12px] border-solid border-[2px] border-black main-shadow-lg rounded-[6px]"
              placeholder="بحث أقساط..."
            />
          </div>
          <div className="table-container">
            <table className="main-table rounded-[10px] overflow-hidden border-collapse border-spacing-0 text-center bg-white w-full">
              <thead>
                <tr>
                  <td>الاسم</td>
                  <td>المنتج</td>
                  <td>تاريخ الاضافه</td>
                  <td>تاريخ اخر دفعه</td>
                  <td>عدد الاقساط</td>
                  <td>الكاش</td>
                  <td>المقدم</td>
                  <td>الاجمالي</td>
                  <td>متأخر</td>
                  <td>الباقي</td>
                  {/* <td>تعديل</td>
                  <td>حذف</td> */}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(installments) ? (
                  installments.map((item, index) => (
                    <tr key={index}>
                      <th>
                        <Link
                          href={`/auth/installment-details?installmentId=${item.id}&adminId=${admin}`}
                        >
                          {item.name}
                        </Link>
                      </th>
                      <th>{item.product}</th>
                      <th>{item.insert_date}</th>
                      <th>{item.last_paid_date}</th>
                      <th>{item.installment_valids} أقساط</th>
                      <th>{item.price}</th>
                      <th>{item.down_paid}</th>
                      <th>{item.total}</th>
                      <th>{item.overdue_installments} أقساط</th>
                      <th>{item.remained_installments} أقساط</th>
                      {/* <th>
                        <button type="button" className="w-[20px]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                          >
                            <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" />
                          </svg>
                        </button>
                      </th>
                      <th>
                        <button type="button" className="w-[20px]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                          >
                            <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z" />
                          </svg>
                        </button>
                      </th> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>لا يوجد اقساط للعرض</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Installments;
