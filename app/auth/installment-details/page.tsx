"use client";
import Sidebar from "@/app/components/Sidebar/Sidebar";
import "./installments.css";
import { useEffect, useState } from "react";
// import Link from "next/link";

function Installments() {
  const [admin, setAdmin] = useState(0);
  const [installment, setInstallment] = useState(0);
  const [installmentId, setInstallmentId] = useState('');
  const [progressId, setProgressId] = useState('');
  const [updateForm, setUpdateForm] = useState(false);
  const [installments, setInstallments] = useState([{
    installment: 0,
    installmentValue: 0,
    installmentWhen: '',
    installmentStatus: '',
    installmentPaidDate: '',
    payNow: 'none',
    progressId: 0,
    customerName: '',
    restMoney: 0,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin]); // تنفيذ `handleData` عند تغير `admin`

  const handlePaying = async () => {
    try {
      const response = await fetch("http://localhost:5002/api/pay-installment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ progressid: Number(progressId), userId: admin}),
      });

      const data = await response.json();

      if (data.status = 'success') {
        window.location.href = `/auth/installment-details?installmentId=${installmentId}&adminId=${admin}`;
      }

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="App p-[30px] w-full h-[100vh] bg-slate-600 flex justify-between">
        <Sidebar />
        <div className="content relative w-[100%] mr-[30px]">
          <div></div>
        <form onSubmit={handlePaying} className={`login-form ${updateForm ? 'block' : 'hidden'} fixed top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 border-solid border-2 border-slate-700 main-shadow w-[400px] p-5 bg-white rounded-xl z-30`}>
          <h3 className="font-semibold mb-10">هل تريد تأكيد سداد القسط ؟</h3>
          <div className="form-submit flex justify-between items-center">
            <input type="submit" value="تأكيد" className="py-3 px-4 bg-blue-500 text-white rounded-[4px] cursor-pointer transition-all main-shadow-sm hover:bg-blue-600" />
            <button type="button" onClick={() => {setProgressId(`0`); setInstallmentId(`0`); setUpdateForm(false)}}>الرجوع</button>
          </div>
        </form>
          <div className="table-container">
            <table className="main-table rounded-[10px] border-collapse border-spacing-0 text-center bg-white w-full">
              <thead>
                <tr>
                  <td>الاسم</td>
                  <td>سعر القسط</td>
                  <td>تاريخ الاستحقاق</td>
                  <td>الحاله</td>
                  <td>تاريخ السداد</td>
                  <td>المتبقي</td>
                  <td>تسديد</td>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(installments) && installments.length > 0 ? (
                  installments.map((item, index) => (
                    <tr key={index}>
                      <th>{item ? item.customerName: ''}</th>
                      <th>{item ? item.installmentValue: ''}</th>
                      <th>{item ? item.installmentWhen: ''}</th>
                      <th>{item ? item.installmentStatus: ''}</th>
                      <th>{item ? item.installmentPaidDate: ''}</th>
                      <th>{item ? item.restMoney: ''}</th>
                      <th>
                        {/* {item.payNow == "paid" ? (
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
                        )} */}
                        {item.payNow == "paid" ? (
                          "تم السداد"
                        ) : item.payNow == "wait" ? (
                          "منتظر"
                        ) : item.payNow == "overdue" ? (
                          <button
                            onClick={() => {setProgressId(`${item.progressId}`); setInstallmentId(`${item.installment}`); setUpdateForm(true)}}
                            style={{
                              backgroundColor: "#007dff",
                              color: "#fff",
                              padding: "2px 15px",
                            }}
                          >
                            متأخر / سداد
                          </button>
                        ) : item.payNow == "must" ? (
                          <button
                            onClick={() => {setProgressId(`${item.progressId}`); setInstallmentId(`${item.installment}`); setUpdateForm(true)}}
                            style={{
                              backgroundColor: "#007dff",
                              color: "#fff",
                              padding: "2px 15px",
                            }}
                          >
                            واجب السداد
                          </button>
                        ) : item.payNow == "pay" ? (
                          <button
                            onClick={() => {setProgressId(`${item.progressId}`); setInstallmentId(`${item.installment}`); setUpdateForm(true)}}
                            style={{
                              backgroundColor: "#007dff",
                              color: "#fff",
                              padding: "2px 15px",
                            }}
                          >
                            السداد
                          </button>
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
