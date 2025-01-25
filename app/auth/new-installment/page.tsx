'use client';

import { useEffect, useState } from "react";
import "./new-installment.css";
import Link from "next/link";

function NewInstallment() {
  const [installmentDate, setInstallmentDate] = useState<number[]>([]);
  const [installmentType, setInstallmentType] = useState("");
  const [buyerPrice, setBuyerPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [downPaidPrice, setDownPaidPrice] = useState(0);
  const [installmentProgressPrice, setInstallmentProgressPrice] = useState(0);
  const [installmentProgress, setInstallmentProgress] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [total, setTotal] = useState(0);
  const [admin, setAdmin] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); // لتخزين الرسالة
  const [alertStyle, setAlertStyle] = useState({}); // لتخزين نوع التنسيق (مثل success أو error)
  const [showAlert, setShowAlert] = useState(false); // لتحديد ما إذا كان يجب عرض الـ alert
  const [telephone, setTelephone] = useState('');
  const [teleList, setTeleList] = useState([{
    name: '',
    tele: '',
    status: '',
  }]);

  const weekly = [...Array(52)].map((_, index) => index + 1);
  const monthly = [...Array(24)].map((_, index) => index + 1);

  useEffect(() => {
    if (!sessionStorage.getItem("userAuth")) {
      window.location.href = "/login";
    } else {
      setAdmin(Number(sessionStorage.getItem("userAuth")));
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('telephone')) {
      setTelephone(String(urlParams.get('telephone')));
    }
  }, [])

  useEffect(() => {
    setInstallmentDate(weekly);
    if (installmentType == "weekly") {
      setInstallmentDate(weekly);
    } else if (installmentType == "monthly") {
      setInstallmentDate(monthly);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [installmentType]);

  useEffect(() => {
    const earn1 = sellingPrice - buyerPrice;
    const earn2 = (installmentProgressPrice * installmentProgress) - (sellingPrice - downPaidPrice);
    const total = earn1 + earn2;
    setTotal((installmentProgressPrice * installmentProgress) + downPaidPrice);
    setEarnings(total);
  }, [buyerPrice, sellingPrice, downPaidPrice, installmentProgressPrice, installmentProgress]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const response = await fetch("http://localhost:5002/api/new-installment", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status === "success") {
        (e.target as HTMLFormElement).reset();
      }

      // تعيين الرسالة وأسلوب الـ alert
      setAlertMessage(data.message);
      setAlertStyle(data.style); // مثلاً "success" أو "error"
      setShowAlert(true); // عرض الـ alert
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const getCustomersTele = async () => {
      try {
        const response = await fetch(`http://localhost:5002/api/get-customers-tele-list/${admin}`);
        const data = await response.json();
        setTeleList(data);
      } catch (err) {
        console.log(err);
      }
    }

    if (admin !== 0) {
      getCustomersTele();
    }
  }, [admin, telephone])

  const [newCustomerForm, setNewCustomerForm] = useState(false);

  const NewCustomerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const response = await fetch('http://localhost:5002/auth/new-customer', {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      

      if (data.status === "success") {
        setNewCustomerForm(false);
        setTelephone(data.telephone);
        (e.target as HTMLFormElement).reset();
      }
      setAlertMessage(data.message);
      setAlertStyle(data.style);
      setShowAlert(true);

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="min-h-[100vh] flex justify-center items-center bg-slate-600">
        {/* عرض الـ alert إذا كانت showAlert = true */}
        {showAlert && (
          <div className={`alert py-4 px-6 rounded-[6px] absolute left-2/4 -translate-x-2/4 top-[20px]`} style={alertStyle}>
            {alertMessage}
          </div>
        )}
        <form onSubmit={NewCustomerSubmit} className={`absolute z-50 ${newCustomerForm ? 'block opacity-100' : 'hidden opacity-0'} border-solid border-2 border-black shadow login-form main-shadow w-[400px] p-5 bg-white rounded-xl z-30`}>
          <div className="form-title text-center text-[24px] font-semibold">إدارة الأقساط</div>
          <input type="number" name="admin" hidden value={`${admin}`} onChange={() => setAdmin(admin)} />
          <div className="form-group grid">
            <label htmlFor="name" className="form-label mb-2">اسم العميل</label>
            <input type="text" name="name" id="name" className="w-full main-shadow-md mb-4  transition-all focus:translate-x-1 focus:translate-y-1 focus:scale-95 focus:main-shadow py-4 px-3 border-solid border-[2px] border-black text-black rounded-md" placeholder="ادخل اسم العميل" required />
          </div>
          <div className="form-group grid">
            <label htmlFor="address" className="form-label mb-2">عنوان العميل</label>
            <input type="text" name="address" id="address" className="w-full main-shadow-md mb-4  transition-all focus:translate-x-1 focus:translate-y-1 focus:scale-95 focus:main-shadow py-4 px-3 border-solid border-[2px] border-black text-black rounded-md" placeholder="ادخل عنوان العميل" required />
          </div>
          <div className="form-group grid">
            <label htmlFor="telephone" className="form-label mb-2">رقم الهاتف</label>
            <input type="text" pattern="^(010|011|012|015)\d{8}$" title="الرجاء إدخال رقم هاتف مصري صحيح (يبدأ بــ 010 أو 011 أو 012 أو 015 ويتكون من 11 رقم)" name="tele" id="telephone" className="w-full main-shadow-md mb-4  transition-all focus:translate-x-1 focus:translate-y-1 focus:scale-95 focus:main-shadow py-4 px-3 border-solid border-[2px] border-black text-black rounded-md" placeholder="ادخل رقم الهاتف" required />
          </div>
          <div className="form-submit flex justify-between items-center">
            {isLoading ? (
              <input type="submit" value="جاري التسجيل ..." disabled className="py-3 px-4 bg-blue-500 text-white rounded-[4px] cursor-pointer transition-all main-shadow-sm hover:bg-blue-600" />
            ) : (
              <input type="submit" value="تسجيل عميل" className="py-3 px-4 bg-blue-500 text-white rounded-[4px] cursor-pointer transition-all main-shadow-sm hover:bg-blue-600" />
            )}</div>
        </form>
        <form onSubmit={handleSubmit} className="login-form border-solid border-[4px] border-black main-shadow w-[auto] p-5 bg-white rounded-xl z-30">
          <button type="button" onClick={() => setNewCustomerForm(!newCustomerForm)} className="w-[30px] block absolute p-1.5 border-solid border-black border-2 rounded-[4px] main-shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/>
            </svg>
          </button>
          <div className="form-title text-center text-[18px] font-semibold mb-5">اضافة قسط</div>
          <input type="number" hidden name="admin" value={`${admin}`} onChange={() => setAdmin(admin)} required />
          <div className="form-group flex gap-[15px]">
            <div className="only-group w-[200px]">
              <label htmlFor="customer" className="form-label mb-3 block">العميل</label>
              <input list="customers" value={telephone == '' ? '' : telephone} onChange={(e) => setTelephone(e.target.value)} name="customer" className="w-full main-shadow-sm mb-4 main-shadow-lg  transition-all focus:translate-x-1 text-[14px] focus:translate-y-1 focus:scale-95 focus:main-shadow py-4 px-3 border-solid border-[2px] border-black text-black rounded-md" placeholder="اختر العميل" required />
              <datalist id="customers">
                {Array.isArray(teleList) && teleList.length > 0 ? teleList.map((item, index) => (
                  <option key={index} value={item.tele}>{item.name} | {item.tele} | {item.status}</option>
                )) : ''}
              </datalist>
            </div>
            <div className="only-group w-[200px]">
              <label htmlFor="product" className="form-label mb-3 block">المنتج</label>
              <input type="text" name="product" id="product" className="w-full main-shadow-sm mb-4 main-shadow-lg  transition-all focus:translate-x-1 text-[14px] focus:translate-y-1 focus:scale-95 focus:main-shadow py-4 px-3 border-solid border-[2px] border-black text-black rounded-md" placeholder="اسم المنتج" required />
            </div>
            <div className="only-group w-[200px]">
              <label htmlFor="pro-desc" className="form-label mb-3 block">وصف المنتج</label>
              <input type="text" name="pro_desc" id="pro-desc" className="w-full main-shadow-sm mb-4 main-shadow-lg  transition-all focus:translate-x-1 text-[14px] focus:translate-y-1 focus:scale-95 focus:main-shadow py-4 px-3 border-solid border-[2px] border-black text-black rounded-md" placeholder="ادخل مواصفات المنتج" required />
            </div>
          </div>
          <div className="form-group flex gap-[15px]">
            <div className="only-group w-[200px]">
              <label htmlFor="buyer_price" className="form-label mb-3 block">سعر الجمله</label>
              <input type="text" onChange={(e) => setBuyerPrice(Number(e.target.value))} pattern="^\d*\.?\d+$" title="الرجاء إدخال عدد عشري موجب (مثال: 12.34)" name="buyer_price" id="buyer_price" className="w-full main-shadow-sm mb-4 main-shadow-lg  transition-all focus:translate-x-1 text-[14px] focus:translate-y-1 focus:scale-95 focus:main-shadow py-4 px-3 border-solid border-[2px] border-black text-black rounded-md" placeholder="ادخل سعر الجمله" required />
            </div>
            <div className="only-group w-[200px]">
              <label htmlFor="customer_price" className="form-label mb-3 block">سعر البيع</label>
              <input type="number" onChange={(e) => setSellingPrice(Number(e.target.value))} min={1} name="customer_price" id="customer_price" className="w-full main-shadow-sm mb-4 main-shadow-lg  transition-all focus:translate-x-1 text-[14px] focus:translate-y-1 focus:scale-95 focus:main-shadow py-4 px-3 border-solid border-[2px] border-black text-black rounded-md" placeholder="ادخل سعر البيع" required />
            </div>
          </div>
          <div className="form-group flex gap-[15px]">
            <div className="only-group w-[200px]">
              <label htmlFor="down_payment" className="form-label mb-3 block">المقدم</label>
              <input type="number" onChange={(e) => setDownPaidPrice(Number(e.target.value))} min={0} name="down_payment" id="down_payment" className="w-full main-shadow-sm mb-4 main-shadow-lg  transition-all focus:translate-x-1 text-[14px] focus:translate-y-1 focus:scale-95 focus:main-shadow py-4 px-3 border-solid border-[2px] border-black text-black rounded-md" placeholder="ادخل قيمة الدفعه المقدمه (ان وجد)" required />
            </div>
            <div className="only-group w-[200px]">
              <label htmlFor="installment_type" className="form-label mb-3 block">نوع القسط</label>
              <select onChange={(e) => setInstallmentType(e.target.value)} name="installment_type"  id="installment_type" className="w-full main-shadow-sm mb-4 main-shadow-lg  transition-all focus:translate-x-1 text-[14px] focus:translate-y-1 focus:scale-95 focus:main-shadow py-3 px-3 border-solid border-[2px] border-black text-black rounded-md" required>
                <option value="weekly">اسبوعي</option>
                <option value="monthly">شهري</option>
              </select>
            </div>
            <div className="only-group">
              <div className="earnings py-2 px-4 bg-white border-2 border-solid border-black main-shadow-md rounded-[4px] text-[14px]">
                <span>الأرباح : </span>
                <span>{earnings}</span>
              </div>
            </div>
            <div className="only-group">
              <div className="earnings py-2 px-4 bg-white border-2 border-solid border-black main-shadow-md rounded-[4px] text-[14px]">
                <span>إجمالي السعر : </span>
                <span>{total}</span>
              </div>
            </div>
          </div>
          <div className="form-group flex gap-[15px]">
            <div className="only-group w-[200px]">
              <label htmlFor="installment_progress" className="form-label mb-3 block">مدة القسط</label>
              <select onChange={(e) => setInstallmentProgress(Number(e.target.value))} id="installment_progress" name="installment_progress" className="w-full main-shadow-sm mb-4 main-shadow-lg  transition-all focus:translate-x-1 text-[14px] focus:translate-y-1 focus:scale-95 focus:main-shadow py-3 px-3 border-solid border-[2px] border-black text-black rounded-md" required>
                {installmentDate.map((item, key) => (
                  <option value={item} key={key}>{item}</option>
                ))}
              </select>
            </div>
            <div className="only-group w-[200px]">
              <label htmlFor="installment_value" className="form-label mb-3 block">سعر القسط</label>
              <input type="number" onChange={(e) => setInstallmentProgressPrice(Number(e.target.value))} min={1} id="installment_value" name="installment_value" className="w-full main-shadow-sm mb-4 main-shadow-lg  transition-all focus:translate-x-1 text-[14px] focus:translate-y-1 focus:scale-95 focus:main-shadow py-4 px-3 border-solid border-[2px] border-black text-black rounded-md" placeholder="ادخل سعر القسط" required />
            </div>
            <div className="only-group w-[200px]">
              <label htmlFor="installment_date" className="form-label mb-3 block">تاريخ اول قسط</label>
              <input type="date" id="installment_date" name="installment_date" className="w-full main-shadow-sm mb-4 main-shadow-lg  transition-all focus:translate-x-1 text-[14px] focus:translate-y-1 focus:scale-95 focus:main-shadow py-4 px-3 border-solid border-[2px] border-black text-black rounded-md" required />
            </div>
          </div>
          <div className="form-submit flex justify-between items-center">
          {isLoading ? (
              <input type="submit" value="جاري الاضافه ..." disabled className="py-2 px-3 bg-blue-500 text-white rounded-[4px] text-[14px] cursor-pointer transition-all main-shadow-sm hover:bg-blue-600" />
            ) : (
              <input type="submit" value="اضافة قسط" className="py-2 px-3 bg-blue-500 text-white rounded-[4px] cursor-pointer text-[14px] transition-all main-shadow-sm hover:bg-blue-600" />
            )}           
            <Link href="/" className="create-new-account text-blue-500 text-[14px]">الرجوع للخلف</Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default NewInstallment;
