'use client';
import { useEffect, useState } from "react";
import './customer.css';
import Sidebar from "../components/Sidebar/Sidebar";
import Link from "next/link";

function Customer() {
  const [admin, setAdmin] = useState(0);
  const [customers, setCustomers] = useState([{
    id: 0,
    name: '',
    address: '',
    telephone: '',
    CusInstallments: 0,
    status: '',
    insert_date: '',
    prdoucts: 0,
    unique_id: 0,
    bad_installments: 0,
    remained_installments: 0,
  }]); // تغيير من `""` إلى `[]`

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
        const response = await fetch(`http://localhost:5002/api/customers-data/${admin}`);
        const data = await response.json();
        setCustomers(data); // تخزين البيانات كمصفوفة
      } catch (err) {
        console.log(err);
      }
    };

    if (admin !== 0) {
      handleData();
    }
  }, [admin]); // تنفيذ `handleData` عند تغير `admin`

  const SearchHandling = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    try {
      const response = await fetch(`http://localhost:5002/api/search-customers/${admin}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchQuery:  (e.target as HTMLInputElement).value}),
      });

      const data = await response.json();
      setCustomers(data); // تخزين البيانات كمصفوفة

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
            <input onKeyUp={(e) => SearchHandling(e)} type="search" className="no-search-btn w-full p-4 text-[12px] border-solid border-[2px] border-black main-shadow-lg rounded-[6px]" placeholder="بحث عملاء..." />
          </div>

          <div className="table-container">
            <table className="main-table rounded-[10px] overflow-hidden border-collapse border-spacing-0 text-center bg-white w-full">
              <thead>
                <tr>
                  <td>تسلسل</td>
                  <td>الاسم</td>
                  <td>العنوان</td>
                  <td>رقم الهاتف</td>
                  <td>الاقساط</td>
                  <td>عميل</td>
                  <td>تاريخ الاضافه</td>
                  <td>المنتجات</td>
                  <td>الاقساط المتأخره</td>
                  <td>الاقساط المتبقيه</td>
                  <td>تعديل</td>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(customers) && customers.length > 0 ? (
                  customers.map((customer, index) => (
                    <tr key={index}>
                      <th>{customer.id}</th>
                      <th>{customer.name}</th>
                      <th>{customer.address}</th>
                      <th>{customer.telephone}</th>
                      <th>{customer.CusInstallments} أقساط</th>
                      <th>{customer.status}</th>
                      <th>{customer.insert_date}</th>
                      <th>{customer.prdoucts} منتجات</th>
                      <th>{customer.bad_installments} أقساط</th>
                      <th>{customer.remained_installments} أقساط</th>
                      <th>
                        <Link href={`/auth/edit-customer?name=${customer.name}&telephone=${customer.telephone}&customerId=${customer.unique_id}&address=${customer.address}&status=${customer.status}`} className="w-[40px] block">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/>
                          </svg>
                        </Link>
                      </th>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>لا يوجد عملاء للعرض</td>
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

export default Customer;
