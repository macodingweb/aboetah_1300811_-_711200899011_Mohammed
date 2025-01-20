'use client';
import Link from "next/link";
import { useEffect, useState } from "react";

function NewCustomer() {
  const [sessionID, setSessinID] = useState(0);
  const [installmentId, setInstallmentId] = useState(0);
  const [progressId, setProgressId] = useState(0);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    // استخراج البيانات من الرابط
    const installmentid = String(urlParams.get('installmentId'));
    const progressid = String(urlParams.get('progressId'));
    setInstallmentId(Number(installmentid));
    setProgressId(Number(progressid));
  }, [])

  useEffect(() => {
    if (!sessionStorage.getItem("userAuth")) {
      window.location.href = "/login";
    } else {
      setSessinID(Number(sessionStorage.getItem("userAuth")));
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5002/api/pay-installment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ progressid: progressId, userId: sessionID}),
      });

      const data = await response.json();

      if (data.status = 'success') {
        window.location.href = `/auth/installment-details?installmentId=${installmentId}&adminId=${sessionID}`;
      }

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="min-h-[100vh] flex justify-center items-center bg-blue-600">
        <form onSubmit={handleSubmit} className="login-form main-shadow w-[400px] p-5 bg-white rounded-xl z-30">
          <h3 className="mb-2 font-semibold">هل تريد تأكيد سداد القسط ؟</h3>
          <div className="form-submit flex justify-between items-center">
            <input type="submit" value="تأكيد" className="py-3 px-4 bg-blue-500 text-white rounded-[4px] cursor-pointer transition-all main-shadow-sm hover:bg-blue-600" />
            <Link href={`/auth/installment-details?installmentId=${installmentId}&adminId=${sessionID}`}>الرجوع</Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default NewCustomer;
