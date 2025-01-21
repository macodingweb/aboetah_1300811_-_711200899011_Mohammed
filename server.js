"use client";

import cors from "cors";
import mysql from "mysql2/promise"; // استخدام `promise` لتجنب الأخطاء
import bcrypt from "bcrypt";
import express from "express";
import multer from "multer";
// import { v4 as uuidv4 } from "uuid";

const PORT = 5002;
const app = express();
const upload = multer();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const conn = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "manager",
});

// Register API
app.post("/api/register", upload.none(), async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const [result] = await conn.execute(
      "SELECT email FROM users WHERE email = ?",
      [email]
    );

    if (Array.isArray(result) && result.length > 0) {
      res.status(409).json({
        message: "هذا المستخدم موجود بالفعل",
        style: { backgroundColor: "red", color: "white", display: "block" },
        status: "failed",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const randomId = Math.floor(Math.random() * 10000000) + 1;

    await conn.execute(
      "INSERT INTO users (unique_id, name, email, password) VALUES (?, ?, ?, ?)",
      [randomId, name, email, hashedPassword]
    );

    res.status(201).json({
      message: "تم اضافة الحساب بنجاح",
      style: { backgroundColor: "green", color: "white", display: "block" },
      status: "success",
      id: randomId,
    });
  } catch {
    res.status(500).json({
      message: "حدث خطأ في السيرفر",
      style: { backgroundColor: "red", color: "white", display: "block" },
      status: "failed",
    });
  }
});

// Login API
app.post("/api/login", upload.none(), async (req, res) => {
  const { email, password } = req.body;

  try {
    const [result] = await conn.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (Array.isArray(result) && result.length > 0) {
      const isMatch = await bcrypt.compare(password, result[0].password);

      if (isMatch) {
        res.status(201).json({
          message: "تم تسجيل الدخول",
          style: { backgroundColor: "green", color: "white", display: "block" },
          status: "success",
          id: result[0].unique_id,
        });
      } else {
        res.status(409).json({
          message: "يوجد خطأ في البريد الالكتروني او كلمة المرور",
          style: { backgroundColor: "red", color: "white", display: "block" },
        });
      }
    } else {
      res.status(409).json({
        message: "هذا المستخدم غير موجود",
        style: { backgroundColor: "red", color: "white", display: "block" },
      });
    }
  } catch {
    res.status(500).json({
      message: "حدث خطأ في السيرفر",
      style: { backgroundColor: "red", color: "white", display: "block" },
      status: "failed",
    });
  }
});

// Create New Customer
app.post("/auth/new-customer", upload.none(), async (req, res) => {
  const { admin, name, address, tele } = req.body;

  try {
    const [result] = await conn.execute(
      "SELECT telephone FROM customers WHERE telephone = ?",
      [tele]
    );

    if (Array.isArray(result) && result.length > 0) {
      res.status(409).json({
        message: "هذا العميل موجود بالفعل",
        style: { backgroundColor: "red", color: "white", display: "block" },
        status: "failed",
      });
    } else {
      const randomId = Math.floor(Math.random() * 10000000) + 1;
      const status = "جديد";

      const today = new Date();

      // استخراج اليوم والشهر والسنة بتنسيق مناسب
      const day = today.getDate().toString().padStart(2, "0"); // اليوم (01 - 31)
      const month = (today.getMonth() + 1).toString().padStart(2, "0"); // الشهر (01 - 12)
      const year = today.getFullYear(); // السنة

      // تحويل التاريخ إلى تنسيق SQL (YYYY-MM-DD)
      const insert_date = `${year}-${month}-${day}`;

      await conn.execute(
        "INSERT INTO customers (unique_id, name, address, telephone, inserted_date, status, admin) VALUES (?, ?, ?, ?, ?, ?)",
        [randomId, name, address, tele, insert_date, status, admin]
      );

      res.status(201).json({
        message: `تمت اضافة  ${name}`,
        style: { backgroundColor: "green", color: "white", display: "block" },
        status: "success",
        telephone: tele,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(409).json({
      message: "حدث خطأ في السيرفر",
      style: { backgroundColor: "red", color: "white", display: "block" },
      status: "failed",
    });
  }
});

// Create New Installment
app.post("/api/new-installment", upload.none(), async (req, res) => {
  console.log(req.body);
  const {
    admin,
    customer,
    product,
    pro_desc,
    buyer_price,
    customer_price,
    down_payment,
    installment_type,
    installment_progress,
    installment_value,
    installment_date,
  } = req.body;

  try {
    const progress = [installment_date];
    let startDate = new Date(installment_date); // تحويل تاريخ البداية إلى كائن Date
    const day = startDate.getDate(); // حفظ اليوم الأصلي للقسط الأول

    for (let i = 0; i < parseInt(installment_progress) - 1; i++) {
      let nextDate = new Date(startDate);

      if (installment_type === "monthly") {
        nextDate.setMonth(startDate.getMonth() + 1); // إضافة شهر واحد

        // التأكد من أن اليوم في الشهر التالي هو نفس اليوم
        if (nextDate.getDate() !== day) {
          nextDate.setMonth(nextDate.getMonth() + 1); // الانتقال إلى الشهر التالي
          nextDate.setDate(0); // تعيين التاريخ ليكون آخر يوم في الشهر
        }
      } else if (installment_type === "weekly") {
        nextDate.setDate(startDate.getDate() + 7); // إضافة أسبوع واحد
      }

      progress.push(nextDate.toISOString().split("T")[0]); // تخزين التاريخ بدون الوقت
      startDate = nextDate; // تحديث `startDate` ليكون تاريخ القسط التالي
    }

    const [findCustomer] = await conn.execute(
      "SELECT unique_id FROM customers WHERE telephone = ?",
      [customer]
    );

    if (Array.isArray(findCustomer) && findCustomer.length > 0) {
      const randomId = Math.floor(Math.random() * 10000000) + 1;
      const customerId = findCustomer[0].unique_id;
      const status = false;
      let inserted_date = new Date();
      inserted_date = inserted_date.toISOString().split("T")[0];

      await conn.execute(
        "INSERT INTO installments (unique_id, product, pro_desc, buyer_price, selling_price, down_paid, type, progress, installment_value, inserted_date, f_installment_date, admin, customer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          randomId,
          product,
          pro_desc,
          buyer_price,
          customer_price,
          down_payment,
          installment_type,
          installment_progress,
          installment_value,
          inserted_date,
          installment_date,
          admin,
          customerId,
        ]
      );

      for (let i = 0; i < progress.length; i++) {
        await conn.execute(
          "INSERT INTO installments_progress (date, status, admin, customer, installment) VALUES (?, ?, ?, ?, ?)",
          [progress[i], status, admin, customerId, randomId]
        );
      }

      return res.status(201).json({
        message: "تم اضافة القسط بنجاح",
        style: { backgroundColor: "green", color: "white", display: "block" },
        status: "success",
      });
    } else {
      return res.status(409).json({
        message: "العميل غير موجود",
        style: { backgroundColor: "red", color: "white", display: "block" },
        status: "failed",
      });
    }

    res.send(progress);
  } catch (err) {
    console.log(err);
    res.status(409).json({
      message: "حدث خطأ في السيرفر",
      style: { backgroundColor: "red", color: "white", display: "block" },
      status: "failed",
    });
  }
});

// Get Customers Data
app.get("/api/customers-data/:userId", async (req, res) => {
  try {
    const customersData = [];
    const userId = parseInt(req.params.userId);
    console.log(userId);

    const [customers] = await conn.execute(
      "SELECT * FROM customers WHERE admin = ?",
      [userId]
    );

    for (let i = 0; i < customers.length; i++) {
      let installments_valid = 0;
      let installments_mount = 0;
      let overdueInstallments = 0;

      const [installments] = await conn.execute(
        "SELECT * FROM installments WHERE admin = ? AND customer = ?",
        [userId, customers[i].unique_id]
      );

      for (let j = 0; j < installments.length; j++) {
        const [installments_progress] = await conn.execute(
          "SELECT * FROM installments_progress WHERE admin = ? AND customer = ? AND installment = ?",
          [userId, customers[i].unique_id, installments[j].unique_id]
        );

        for (let e = 0; e < installments_progress.length; e++) {
          if (installments_progress[e].status == false) {
            installments_mount += 1;
          }

          const today = new Date();

          const installmentDate = new Date(installments_progress[e].date);
          if (
            installmentDate < today &&
            installments_progress[e].status != true
          ) {
            overdueInstallments += 1;
          }
        }

        installments_valid += installments_progress.length;
      }

      const prdoucts = installments.length;
      customersData.push({
        id: customers[i].id,
        name: customers[i].name,
        telephone: customers[i].telephone,
        CusInstallments: installments_valid,
        status: customers[i].status,
        insert_date: customers[i].inserted_date.toISOString().split("T")[0],
        prdoucts: prdoucts,
        unique_id: customers[i].unique_id,
        bad_installments: overdueInstallments,
        remained_installments: installments_mount,
      });
    }

    return res.status(201).json(customersData);
  } catch (err) {
    console.log(err);
  }
});

// Get Installments Data
app.get("/api/installments-data/:userId", async (req, res) => {
  try {
    const installmentsData = [];
    const userId = parseInt(req.params.userId);
    console.log(userId);

    const [installments] = await conn.execute(
      "SELECT * FROM installments WHERE admin = ?",
      [userId]
    );


    if (installments.length > 0) {
      for (let i = 0; i < installments.length; i++) {
          let name = "";
          let installment_valids = 0;
          let overdueInstallments = 0;
          let installments_mount = 0;
          let last_paid_date = "";

          const [customerData] = await conn.execute(
            "SELECT name FROM customers WHERE admin = ? AND unique_id = ?",
            [userId, installments[i].customer]
          );

          name = customerData[0].name;

          const [installmentValids] = await conn.execute(
            "SELECT * FROM installments_progress WHERE admin = ? AND customer = ? AND installment = ?",
            [
              userId,
              installments[i].customer,
              installments[i].unique_id,
            ]
          );

          installment_valids = installmentValids.length;

          for (let j = 0; j < installmentValids.length; j++) {
            if (installmentValids[j].status == false) {
              installments_mount += 1;
            }
            const today = new Date();

            const installmentDate = new Date(installmentValids[j].date);
            if (
              installmentDate < today &&
              installmentValids[j].status != true
            ) {
              overdueInstallments += 1;
            }
          }

          const [lastPaidDate] = await conn.execute(
            "SELECT * FROM installments_progress WHERE admin = ? AND customer = ? AND installment = ? AND status = 1 ORDER BY date DESC LIMIT 1",
            [
              userId,
              installments[i].customer,
              installments[i].unique_id,
            ]
          );

          if (lastPaidDate.length > 0) {
            last_paid_date = new Date(
              lastPaidDate[0].finished_date
            ).toLocaleDateString("en-CA"); // YYYY-MM-DD
          }
          

          installmentsData.push({
            id: installments[i].unique_id,
            name: name,
            prodcut: installments[i]["product"],
            insert_date: installments[i].inserted_date
              .toLocaleDateString("en-CA")
              .split("T")[0],
            last_paid_date: last_paid_date == "" ? "لا يوجد" : last_paid_date,
            installment_valids: installment_valids,
            price: installments[i].selling_price,
            total:
              installments[i].installment_value * installments[i]["progress"] +
              installments[i].down_paid,
            overdue_installments: overdueInstallments,
            remained_installments: installments_mount,
          });
      }
      return res.status(201).json(installmentsData);
    } else {
      return res.status(404).json({ message: "Not Found" });
    }
  } catch (err) {
    console.log(err);
  }
});

// Get Customers Telephones List
app.get("/api/get-customers-tele-list/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const customersTeleList = [];
    const [result] = await conn.execute(
      "SELECT * FROM customers WHERE admin = ?",
      [userId]
    );

    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        customersTeleList.push({
          name: result[i].name,
          tele: result[i].telephone,
          status: result[i].status,
        });
      }

      console.log(customersTeleList);

      return res.status(201).json(customersTeleList);
    } else {
      return res.status(409).json({ message: "Request Failed" });
    }
  } catch (err) {
    console.log(err);
    return res.status(409).json({ message: "Request Failed" });
  }
});

// Edit Customer
app.post("/api/edit-customer/:userId", upload.none(), async (req, res) => {
  const userId = parseInt(req.params.userId);
  const { customerId, name, tele, status } = req.body;

  try {
    const [result] = await conn.execute(
      "SELECT * FROM customers WHERE admin = ? AND unique_id = ?",
      [userId, customerId]
    );

    if (result.length > 0) {
      if (tele == result[0].telephone) {
        await conn.execute(
          "UPDATE customers SET name = ?, status = ? WHERE admin = ? AND unique_id = ?",
          [name, status, userId, customerId]
        );

        return res.status(409).json({
          message: "تم تعديل العميل",
          style: { backgroundColor: "green", color: "white", display: "block" },
          status: "success",
        });
      } else {
        const [checking] = await conn.execute(
          "SELECT * FROM customers WHERE admin = ? AND telephone = ? LIMIT 1",
          [userId, tele]
        );

        if (checking.length > 0) {
          return res.status(409).json({
            message: "هذا الرقم موجود بالفعل جرب رقم اخر",
            style: { backgroundColor: "red", color: "white", display: "block" },
            status: "failed",
          });
        } else {
          await conn.execute(
            "UPDATE customers SET name = ?, telephone = ?, status = ? WHERE admin = ? AND unique_id = ?",
            [name, tele, status, userId, customerId]
          );

          return res.status(409).json({
            message: "تم تعديل العميل",
            style: {
              backgroundColor: "green",
              color: "white",
              display: "block",
            },
            status: "success",
          });
        }
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(409).json({
      message: "حدث خطأ في السيرفر",
      style: { backgroundColor: "red", color: "white", display: "block" },
      status: "failed",
    });
  }
});

// Get Installments Details
app.get("/api/installments-details/:userId/:installmentId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const installmentId = parseInt(req.params.installmentId);

    try {
      const progressDate = [];
      const [install] = await conn.execute(
        "SELECT installment_value FROM installments WHERE unique_id = ? AND admin = ?",
        [installmentId, userId]
      );

      const [result] = await conn.execute(
        "SELECT * FROM installments_progress WHERE admin = ? AND installment = ?",
        [userId, installmentId]
      );

      if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          let payBtn = "";
          const timePaid = new Date(result[i].date);
          const today = new Date();

          timePaid.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);

          if (timePaid > today && result[i].status == false) {
            payBtn = "pay";
          } else if ((timePaid <= today && result[i].status == true) || (timePaid > today && result[i].status == true)) {
            payBtn = "paid";
          } else if (
            timePaid.getTime() === today.getTime() &&
            result[i].status == false
          ) {
            payBtn = "must";
          } else if (timePaid < today && result[i].status == false) {
            payBtn = "overdue";
          }

          progressDate.push({
            installment: installmentId,
            installmentValue: install[0].installment_value,
            installmentWhen: result[i].date
              .toLocaleDateString("en-CA")
              .split("T")[0],
            installmentStatus: result[i].status ? "تم السداد" : "لم يسدد",
            installmentPaidDate:
              result[i].finished_date == null
                ? "لا يوجد"
                : result[i].finished_date
                    .toLocaleDateString("en-CA")
                    .split("T")[0],
            payNow: payBtn,
            progressId: result[i].id,
          });
        }

        return res.status(201).json(progressDate);
      }
    } catch (err) {
      console.log(err);
      return res.status(409).json({
        message: "حدث خطأ في السيرفر",
        style: { backgroundColor: "red", color: "white", display: "block" },
        status: "failed",
      });
    }
  }
);

// Pay Installment
app.post("/api/pay-installment", upload.none(), async (req, res) => {
  const {progressid, userId} = req.body;
  

  try {
    let today = new Date();
    today = today.toLocaleDateString("en-CA").split("T")[0];
    await conn.execute(
      "UPDATE installments_progress SET finished_date = ?, status = ? WHERE admin = ? AND id = ?",
      [today, 1, userId, progressid]
    );

    res.status(201).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(409).json({ status: "failed" });
  }
});

// Get Dashboard Data
app.get("/api/dashboard-data/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const dashboardData = [];
    // إنشاء المتغيرات خارج الاستعلامات
    let customersCount = 0;
    let specialCustomersCount = 0;
    let badCustomersCount = 0;
    let overdueInstallments = 0;
    let mustNow = 0;

    // تنفيذ جميع الاستعلامات في نفس الوقت
    const [customersCountS, specialCustomersCountS, badCustomersCountS, badMust] = await Promise.all([
      conn.execute('SELECT id FROM customers WHERE admin = ?', [userId]),
      conn.execute('SELECT * FROM customers WHERE status = ? AND admin = ?', ['ممتاز', userId]),
      conn.execute('SELECT * FROM customers WHERE admin = ? AND status = ?', [userId, 'سئ']),
      conn.execute('SELECT * FROM installments_progress WHERE admin = ? AND status = 0', [userId]),
    ]);

    console.log(badCustomersCountS[0]);
    console.log(userId);
    

    customersCount = customersCountS[0].length;
    specialCustomersCount = specialCustomersCountS[0].length;
    badCustomersCount = badCustomersCountS[0].length;

    // حساب الأقساط المتأخرة والمستحقة الآن
    badMust[0].forEach((installment) => {
      let today = new Date().toLocaleDateString("en-CA").split("T")[0];
      let installDate = new Date(installment.date).toLocaleDateString("en-CA").split("T")[0];

      if (today > installDate) {
        overdueInstallments += 1;
      } else if (today == installDate) {
        mustNow += 1;
      }
    });

    // تجميع البيانات في مصفوفة
    dashboardData.push({
      customers_Count: customersCount,
      special_CustomersCount: specialCustomersCount,
      bad_CustomersCount: badCustomersCount,
      overdue_Installments: overdueInstallments,
      must_Now: mustNow,
    });
    console.log(dashboardData);
    

    return res.status(201).json(dashboardData);
  } catch (err) {
    console.log(err);
    return res.status(409).json({ status: "failed" });
  }
});

// Get Customers By Search
app.post("/api/search-customers/:userId", upload.none(), async (req, res) => {
  const {searchQuery} = req.body;

  try {
    const customersData = [];
    const userId = parseInt(req.params.userId);
    console.log(userId);

    const [customers] = await conn.execute(
      "SELECT * FROM customers WHERE admin = ? AND name LIKE ?",
      [userId, `${searchQuery}%`]
    );

    for (let i = 0; i < customers.length; i++) {
      let installments_valid = 0;
      let installments_mount = 0;
      let overdueInstallments = 0;

      const [installments] = await conn.execute(
        "SELECT * FROM installments WHERE admin = ? AND customer = ?",
        [userId, customers[i].unique_id]
      );

      for (let j = 0; j < installments.length; j++) {
        const [installments_progress] = await conn.execute(
          "SELECT * FROM installments_progress WHERE admin = ? AND customer = ? AND installment = ?",
          [userId, customers[i].unique_id, installments[j].unique_id]
        );

        for (let e = 0; e < installments_progress.length; e++) {
          if (installments_progress[e].status == false) {
            installments_mount += 1;
          }

          const today = new Date();

          const installmentDate = new Date(installments_progress[e].date);
          if (
            installmentDate < today &&
            installments_progress[e].status != true
          ) {
            overdueInstallments += 1;
          }
        }

        installments_valid += installments_progress.length;
      }

      const prdoucts = installments.length;
      customersData.push({
        id: customers[i].id,
        name: customers[i].name,
        telephone: customers[i].telephone,
        CusInstallments: installments_valid,
        status: customers[i].status,
        insert_date: customers[i].inserted_date.toISOString().split("T")[0],
        prdoucts: prdoucts,
        unique_id: customers[i].unique_id,
        bad_installments: overdueInstallments,
        remained_installments: installments_mount,
      });
    }

    return res.status(201).json(customersData);
  } catch (err) {
    console.log(err);
  }

});

// Get Installments By Search
app.post("/api/search-installments/:userId", upload.none(), async (req, res) => {
  const {searchQuery} = req.body;
  
  try {
    const installmentsData = [];
    const userId = parseInt(req.params.userId);
    console.log(userId);

    const [customers] = await conn.execute(
      'SELECT * FROM customers WHERE admin = ? AND name LIKE ?',
      [userId, `${searchQuery}%`],
    )

    if (customers.length > 0) {
      for (let q = 0; q < customers.length; q++) {
        const [installments] = await conn.execute(
          "SELECT * FROM installments WHERE admin = ? AND customer = ?",
          [userId, customers[q].unique_id],
        );
    
        for (let i = 0; i < installments.length; i++) {
          let name = "";
          let installment_valids = 0;
          let overdueInstallments = 0;
          let installments_mount = 0;
          let last_paid_date = "";
  
            const [customerData] = await conn.execute(
              "SELECT name FROM customers WHERE admin = ? AND unique_id = ?",
              [userId, installments[i].customer]
            );
  
            name = customerData[0].name;
  
            const [installmentValids] = await conn.execute(
              "SELECT * FROM installments_progress WHERE admin = ? AND customer = ? AND installment = ?",
              [
                userId,
                installments[i].customer,
                installments[i].unique_id,
              ]
            );
  
            installment_valids = installmentValids.length;
  
            for (let j = 0; j < installmentValids.length; j++) {
              if (installmentValids[j].status == false) {
                installments_mount += 1;
              }
              const today = new Date();
  
              const installmentDate = new Date(installmentValids[j].date);
              if (
                installmentDate < today &&
                installmentValids[j].status != true
              ) {
                overdueInstallments += 1;
              }
            }
  
            const [lastPaidDate] = await conn.execute(
              "SELECT * FROM installments_progress WHERE admin = ? AND customer = ? AND installment = ? AND status = 1 ORDER BY date DESC LIMIT 1",
              [
                userId,
                installments[i].customer,
                installments[i].unique_id,
              ]
            );
  
            if (lastPaidDate.length > 0) {
              last_paid_date = new Date(
                lastPaidDate[0].finished_date
              ).toLocaleDateString("en-CA"); // YYYY-MM-DD
            }
            
  
          installmentsData.push({
            id: installments[i].unique_id,
            name: name,
            prodcut: installments[i]["product"],
            insert_date: installments[i].inserted_date
              .toLocaleDateString("en-CA")
              .split("T")[0],
            last_paid_date: last_paid_date == "" ? "لا يوجد" : last_paid_date,
            installment_valids: installment_valids,
            price: installments[i].selling_price,
            total:
              installments[i].installment_value * installments[i]["progress"] +
              installments[i].down_paid,
            overdue_installments: overdueInstallments,
            remained_installments: installments_mount,
          });
        }
      }
    } 

    console.log(installmentsData);
    return res.status(201).json(installmentsData);

  } catch (err) {
    console.log(err);
  }
})

// 🚀 تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
