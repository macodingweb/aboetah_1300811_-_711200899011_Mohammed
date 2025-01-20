'use client';

import { useEffect, useState } from "react";
import "./login.css";
import Link from "next/link";

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); // لتخزين الرسالة
  const [alertStyle, setAlertStyle] = useState({}); // لتخزين نوع التنسيق (مثل success أو error)
  const [showAlert, setShowAlert] = useState(false); // لتحديد ما إذا كان يجب عرض الـ alert
  // const router = useRouter();

  const [sessionID, setSessionID] = useState(0);

  useEffect(() => {
    setSessionID(Number(sessionStorage.getItem("userAuth")));
  }, []);
  
  if (sessionID) {
    window.location.href = "/";
  }
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const response = await fetch('http://localhost:5002/api/login', {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status == "success") {
        sessionStorage.setItem("userAuth", JSON.stringify(data.id));
        window.location.href = "/";
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
  };

  return (
    <>
      <div className="min-h-[100vh] flex justify-center items-center bg-blue-600">
          {/* عرض الـ alert إذا كانت showAlert = true */}
          {showAlert && (
          <div className={`alert py-4 px-6 rounded-[6px] absolute left-2/4 -translate-x-2/4 top-[20px]`} style={alertStyle}>
            {alertMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="z-10 login-form main-shadow w-[400px] p-5 bg-white rounded-xl">
          <div className="form-title text-center text-[24px] font-semibold">إدارة الأقساط</div>
          <div className="form-group grid">
            <label htmlFor="email" className="form-label mb-2">البريد الإلكتروني</label>
            <input type="email" name="email" id="email" className="w-full main-shadow-sm mb-4  transition-all focus:translate-x-1 focus:translate-y-1 focus:scale-95 focus:main-shadow py-4 px-3 border-solid border-[2px] border-black text-black rounded-md" placeholder="ادخل بريدك الالكتروني" required />
          </div>
          <div className="form-group grid">
            <label htmlFor="password" className="form-label mb-2">كلمة المرور</label>
            <input type={showPass ? "text" : "password"} name="password" id="password" className="w-full main-shadow-sm mb-3  transition-all focus:translate-x-1 focus:translate-y-1 focus:scale-95 focus:main-shadow py-4 px-3 border-solid border-[2px] border-black text-black rounded-md" placeholder="ادخل كلمة مرورك" required />
          </div>
          <div className="show-password flex items-center mb-10">
            <input type="checkbox" id="show-password" onChange={() => setShowPass(!showPass)} />
            <label htmlFor="show-password" className="mr-2 select-none">عرض كلمة المرور</label>
          </div>
          <div className="form-submit flex justify-between items-center">
            {isLoading ? (
              <input type="submit" value="جاري التسجيل ..." disabled className="py-3 px-4 bg-blue-500 text-white rounded-[4px] cursor-pointer transition-all main-shadow-sm hover:bg-blue-600" />
            ) : (
              <input type="submit" value="تسجيل الدخول" className="py-3 px-4 bg-blue-500 text-white rounded-[4px] cursor-pointer transition-all main-shadow-sm hover:bg-blue-600" />
            )}            
            <Link href="/register" className="create-new-account text-blue-500">إنشاء حساب جديد ؟</Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
