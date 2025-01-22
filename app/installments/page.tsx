'use client';
import Sidebar from "@/app/components/Sidebar/Sidebar";
import "./installments.css";
import { useEffect, useState } from "react";
import Link from "next/link";

function Installments() {
  const [admin, setAdmin] = useState(0);
  const [installments, setInstallments] = useState([{
    id: 0,
    name: '',
    prodcut: '',
    insert_date: '',
    last_paid_date: '',
    installment_valids: 0,
    price: 0,
    total: 0,
    overdue_installments: 0,
    remained_installments: 0,
    down_paid: 0,
  }]);

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
        const response = await fetch(`http://localhost:5002/api/installments-data/${admin}`);
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
  }, [admin]); // تنفيذ `handleData` عند تغير `admin`

  const handlingSearch = async (e: React.FormEvent<HTMLInputElement>) => {
    try {
      const response = await fetch(`http://localhost:5002/api/search-installments/${admin}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchQuery: (e.target as HTMLInputElement).value }),
      })

      const data = await response.json();
      setInstallments(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="App p-[30px] w-full h-[100vh] bg-blue-600 flex justify-between">
        <Sidebar />
        <div className="content relative w-[100%] mr-[30px]">
          <div className="search-box relative w-[50%] mb-[30px]">
            <span className="w-[14px] absolute left-[15px] top-2/4 -translate-y-2/4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
              </svg>
            </span>
            <input onInput={(e) => handlingSearch(e)} type="search" className="no-search-btn w-full p-4 text-[12px] border-solid border-[2px] border-black main-shadow-lg rounded-[6px]" placeholder="بحث أقساط..." />
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
                </tr>
              </thead>
              <tbody>
                {Array.isArray(installments) ? installments.map((item, index) => (
                <tr key={index}>
                  <th>
                    <Link href={`/auth/installment-details?installmentId=${item.id}&adminId=${admin}`}>{item.name}</Link>
                  </th>
                  <th>{item.prodcut}</th>
                  <th>{item.insert_date}</th>
                  <th>{item.last_paid_date}</th>
                  <th>{item.installment_valids} أقساط</th>
                  <th>{item.price}</th>
                  <th>{item.down_paid}</th>
                  <th>{item.total}</th>
                  <th>{item.overdue_installments} أقساط</th>
                  <th>{item.remained_installments} أقساط</th>
                </tr>
                )) : (
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
