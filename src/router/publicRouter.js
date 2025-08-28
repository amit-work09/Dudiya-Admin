import { Router } from "express";
import PublicController from "../controller/publicController.js";
import SpecialityController from "../controller/admin/specialityController.js";
import UpdateRepo from "../repo/updateRepo.js";

/**
 * @class PublicRouter
 */
export default class PublicRouter {
  constructor() {
    this.router = Router();
    this.routes();
  }

  routes = () => {
    this.router.get("/education-types", PublicController.getEduction);
    this.router.get("/get-location", PublicController.getLocation);
    this.router.get("/get-speciality", SpecialityController.getSpeciality);
    this.router.get("/static-pages", PublicController.getStaticPages);
  };
}
