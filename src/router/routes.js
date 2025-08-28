import express from "express";
import { deleteObjectAWS, uploadImages } from "../utils/fileUpload.js";
import AuthRouter from "./authRouter.js";
// import UserRouter from "./userRouter.js";
// import { UserAuth } from "../middleware/authMiddleware.js";
import AdminSpecialityRouter from "./admin/specialityRouter.js";
import AdminDashboardRouter from "./admin/dashboardRouter.js"
import PatientRouter from "./patientRouter.js";
import DoctorRouter from "./doctorRouter.js";
import { DoctorAuth, PatientAuth } from "../middleware/authMiddleware.js";
import AdminPatientRouter from "./admin/patientRouter.js";
import AdminDoctorRouter from "./admin/doctorRouter.js";
import AdminAuthRouter from "./admin/authRouter.js";
import AdminBookingRouter from "./admin/bookingRouter.js"
import AdminRevenueRouter from "./admin/revenueRouter.js"
import AdminPaypalRouter from "./admin/paypalRouter.js"
import AdminNotificationRouter from "./admin/notificationsRouter.js"
import AdminStaticRouter from "./admin/staticRouter.js"
import MangeSubscriptionRouter from "./admin/managesubscription.js"
import AdminSubscriptionRouter from "./subscription/UserSubscriptionRouter.js"


import AdminSettingRouter from "./admin/settingRouter.js"
import PublicRouter from "./publicRouter.js";
import EducationType from "../models/EducationType.js"



export default class Routes {
  /**
   * @param  {Routes}
   * @returns void
   */
  static init(server) {
    const router = express.Router();

    server.app.use("/", router);

    /**
     * Entry point
     */
    server.app.get("/", (_, res) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(
        `<div><p><h3>Dudiya Server is working fine at : ${process.env.PORT}</h3><p></div>`
      );
    });

    // Auth Router
    server.app.use("/api/v1/auth", new AuthRouter().router);

    // patients
    // server.app.use("/api/v1/patient", new PatientRouter().router);

    // speciality
    
    // Patient/Doctor Router
    // server.app.use("/api/v1/user", UserAuth, new UserRouter().router);
    
    //  ================ Start Admin Router =================
    // Patient
    server.app.use("/api/v1/patient", PatientAuth, new PatientRouter().router);
    //Doctor Router
    server.app.use("/api/v1/doctor", DoctorAuth, new DoctorRouter().router);

    // Admin Routes
    // patients
    server.app.use("/api/v1/admin/patient", new AdminPatientRouter().router);
    
    server.app.use("/api/v1/admin/auth", new AdminAuthRouter().router);
    server.app.use("/api/v1/admin/dashboard",  new AdminDashboardRouter().router);
    server.app.use("/api/v1/admin/patient", new AdminPatientRouter().router);
    server.app.use("/api/v1/admin/doctor", new AdminDoctorRouter().router);
    server.app.use("/api/v1/admin/revenue", new AdminRevenueRouter().router);
    server.app.use("/api/v1/admin/booking", new AdminBookingRouter().router);
    server.app.use("/api/v1/admin/speciality", new AdminSpecialityRouter().router);
    server.app.use("/api/v1/admin/notifications", new AdminNotificationRouter().router);
    server.app.use("/api/v1/admin/settings", new AdminSettingRouter().router);
    server.app.use("/api/v1/admin/paypal", new AdminPaypalRouter().router);
    server.app.use("/api/v1/admin/static", new AdminStaticRouter().router);
    server.app.use("/api/v1/admin/manage-subscription", new MangeSubscriptionRouter().router);
    //  ================ End Admin Router =================
    server.app.use("/api/v1/subscription", new AdminSubscriptionRouter().router);
    server.app.use("/api/v1/public", new PublicRouter().router);






// user Subscription
// transtion 
// Booking
// user/subscription

//  public routes
//  location, speciality, 




   

    // upload router
    server.app.post("/api/v1/upload",uploadImages)
    
    
      

   

    /**
     * 404 if url not found
     */
    server.app.all("*", (_, res) => {
      res.status(process.env.NOT_FOUND).json({
        success: false,
        message: `API not found.`,
      });
    });

    // Static folder
    server.app.use("/", express.static("public"));
  }
}
