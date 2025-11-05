import { Router } from "express";
import { TourController } from "./tour.controller";
import { Role } from "../user/user.interface";
import { createTourTypeZodSchema, createTourZodSchema, updateTourZodSchema } from "./tour.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { multerUpload } from "../../config/multer.config";

const router = Router();

/*----------------- TOUR TYPE ROUTES ----------------*/
router.get("/tour-types", TourController.getAllTourTypes);
router.post("/create-tour-type",
      checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
      validateRequest(createTourTypeZodSchema),
      TourController.createTourType
);
router.patch("/tour-types/:id",
      checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
      TourController.updateTourType
);
router.delete("/tour-types/:id",
      checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
      TourController.deleteTourType
);

/*----------------- TOUR ROUTES ----------------*/
router.post("/create",
      checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
      multerUpload.array("files"),
      validateRequest(createTourZodSchema),
      TourController.createTour
);
router.get("/", TourController.getAllTours);
router.get("/:slug", TourController.getSingleTour);
router.patch("/:id",
      checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
      multerUpload.array("files"),
      validateRequest(updateTourZodSchema),
      TourController.updateTour
);
router.delete("/:id",
      checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
      TourController.deleteTour
);

export const TourRoutes = router;