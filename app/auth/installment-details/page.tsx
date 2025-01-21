"use client";
import Sidebar from "@/app/components/Sidebar/Sidebar";
import "./installments.css";
import { useEffect, useState } from "react";
import Link from "next/link";

function Installments() {
  const [admin, setAdmin] = useState(0);
  const [installment, setInstallment] = useState(0);
  const [installments, setInstallments] = useState([{
    installment: 0,
    installmentValue: 0,
    installmentWhen: '',
    installmentStatus: '',
    installmentPaidDate: '',
    payNow: 'none',
    progressId: 0,
  }]);

  useEffect(() => {
    if (!sessionStorage.getItem("userAuth")) {
      window.location.href = "/login";
    } else {
      const urlParams = new URLSearchParams(window.location.search);

      // استخراج البيانات من الرابط
      const installmentId = String(urlParams.get("installmentId"));
      setInstallment(Number(installmentId));
      setAdmin(Number(sessionStorage.getItem("userAuth")));
    }
  }, []);

  useEffect(() => {
    const handleData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5002/api/installments-details/${admin}/${installment}`
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
  }, [admin]); // تنفيذ `handleData` عند تغير `admin`

  return (
    <>
      <div className="App p-[30px] w-full h-[100vh] bg-blue-600 flex justify-between">
        <Sidebar />
        <div className="content relative w-[100%] mr-[30px]">
          <div className="table-container">
            <table className="main-table rounded-[10px] border-collapse border-spacing-0 text-center bg-white w-full">
              <thead>
                <tr>
                  <td>القسط</td>
                  <td>سعر القسط</td>
                  <td>تاريخ الاستحقاق</td>
                  <td>الحاله</td>
                  <td>تاريخ السداد</td>
                  <td>تسديد</td>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(installments) && installments.length > 0 ? (
                  installments.map((item, index) => (
                    <tr key={index}>
                      <th>{item ? item.installment: ''}</th>
                      <th>{item ? item.installmentValue: ''}</th>
                      <th>{item ? item.installmentWhen: ''}</th>
                      <th>{item ? item.installmentStatus: ''}</th>
                      <th>{item ? item.installmentPaidDate: ''}</th>
                      <th>
                        {item.payNow == "paid" ? (
                          "تم السداد"
                        ) : item.payNow == "wait" ? (
                          "منتظر"
                        ) : item.payNow == "overdue" ? (
                          <Link
                            style={{
                              backgroundColor: "#007dff",
                              color: "#fff",
                              padding: "2px 15px",
                            }}
                            href={`/auth/pay-installment?progressId=${item.progressId}&installmentId=${item.installment}`}
                          >
                            متأخر / سداد
                          </Link>
                        ) : item.payNow == "must" ? (
                          <Link
                            style={{
                              backgroundColor: "#007dff",
                              color: "#fff",
                              padding: "2px 15px",
                            }}
                            href={`/auth/pay-installment?progressId=${item.progressId}&installmentId=${item.installment}`}
                          >
                            واجب السداد
                          </Link>
                        ) : item.payNow == "pay" ? (
                          <Link
                            style={{
                              backgroundColor: "#007dff",
                              color: "#fff",
                              padding: "2px 15px",
                            }}
                            href={`/auth/pay-installment?progressId=${item.progressId}&installmentId=${item.installment}`}
                          >
                            السداد
                          </Link>
                        ) : (
                          "غير معروف"
                        )}
                      </th>
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
