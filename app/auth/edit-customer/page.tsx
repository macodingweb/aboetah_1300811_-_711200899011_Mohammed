'use client';
import { useEffect, useState } from "react";

function NewCustomer() {
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); // لتخزين الرسالة
  const [alertStyle, setAlertStyle] = useState({}); // لتخزين نوع التنسيق (مثل success أو error)
  const [showAlert, setShowAlert] = useState(false); // لتحديد ما إذا كان يجب عرض الـ alert
  const [sessionID, setSessinID] = useState(0);
  const [nameInp, setNameInp] = useState('');
  const [telephoneInp, setTelephoneInp] = useState('');
  const [customerInp, setCustomerInp] = useState('');
  const [StatusInp, setStatusInp] = useState('');
  const [AddressInp, setAddressInp] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    // استخراج البيانات من الرابط
    const name = String(urlParams.get('name'));
    const telephone = String(urlParams.get('telephone'));
    const customerId = String(urlParams.get('customerId'));
    const status = String(urlParams.get('status'));
    const address = String(urlParams.get('address'));
    setNameInp(name);
    setTelephoneInp(telephone);
    setCustomerInp(customerId);
    setAddressInp(address);
    setStatusInp(status);
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
    
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const response = await fetch (`http://localhost:5002/api/edit-customer/${sessionID}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.status === "success") {
        window.location.href = "/customers";
      }

      
      // تعيين الرسالة وأسلوب الـ alert
      setAlertMessage(data.message);
      setAlertStyle(data.style); // مثلاً "success" أو "error"
      setShowAlert(true); // عرض الـ alert

    } catch (err) {
      console.log(err);
      setAlertMessage("حدث خطأ، يرجى المحاولة مرة أخرى.");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="min-h-[100vh] flex justify-center items-center bg-blue-600">
        {/* عرض الـ alert إذا كانت showAlert = true */}
        {showAlert && (
          <div className={`alert py-4 px-6 rounded-[6px] absolute left-2/4 -translate-x-2/4 top-[20px]`} style={alertStyle}>
            {alertMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="login-form main-shadow w-[400px] p-5 bg-white rounded-xl z-30">
          <input type="number" hidden name="customerId" value={customerInp} />
          <div className="form-title text-center text-[24px] font-semibold">إدارة الأقساط</div>
          <input type="number" name="admin" hidden value={`${sessionID}`} />
          <div className="form-group grid">
            <label htmlFor="name" className="form-label mb-2">اسم العميل</label>
            <input type="text" defaultValue={`${nameInp}`} name="name" id="name" className="w-full main-shadow-md mb-4  transition-all focus:translate-x-1 focus:translate-y-1 focus:scale-95 focus:main-shadow py-4 px-3 border-solid border-[2px] border-black text-black rounded-md" placeholder="ادخل اسم العميل" required />
          </div>
          <div className="form-group grid">
            <label htmlFor="telephone" className="form-label mb-2">رقم الهاتف</label>
            <input type="text" defaultValue={`${telephoneInp}`} pattern="^(010|011|012|015)\d{8}$" title="الرجاء إدخال رقم هاتف مصري صحيح (يبدأ بــ 010 أو 011 أو 012 أو 015 ويتكون من 11 رقم)" name="tele" id="telephone" className="w-full main-shadow-md mb-4  transition-all focus:translate-x-1 focus:translate-y-1 focus:scale-95 focus:main-shadow py-4 px-3 border-solid border-[2px] border-black text-black rounded-md" placeholder="ادخل اسم العميل" required />
          </div>
          <div className="form-group grid">
            <label htmlFor="status" className="form-label mb-2">حالة العميل</label>
            <select className="w-full main-shadow-md mb-4  transition-all focus:translate-x-1 focus:translate-y-1 focus:scale-95 focus:main-shadow py-4 px-3 border-solid border-[2px] border-black text-black rounded-md" name="status" id="status">
              {StatusInp == 'جديد' ? (
              <>
              <option value="جديد" selected>جديد</option>
              <option value="ممتاز" >ممتاز</option>
              <option value="سئ" >سئ</option>
              </>
              ) : StatusInp == 'ممتاز' ? (
                <>
              <option value="جديد">جديد</option>
              <option value="ممتاز" selected >ممتاز</option>
              <option value="سئ" >سئ</option>
                </>
              ) : StatusInp == 'سئ' ? (
                <>
              <option value="جديد">جديد</option>
              <option value="ممتاز" >ممتاز</option>
              <option value="سئ" selected >سئ</option>
                </>
              ) : 'لا يوجد بيانات'}
            </select>
          </div>
          <div className="form-submit flex justify-between items-center">
            {isLoading ? (
              <input type="submit" value="جاري التعديل ..." disabled className="py-3 px-4 bg-blue-500 text-white rounded-[4px] cursor-pointer transition-all main-shadow-sm hover:bg-blue-600" />
            ) : (
              <input type="submit" value="تعديل عميل" className="py-3 px-4 bg-blue-500 text-white rounded-[4px] cursor-pointer transition-all main-shadow-sm hover:bg-blue-600" />
            )}</div>
        </form>
      </div>
    </>
  );
}

export default NewCustomer;
