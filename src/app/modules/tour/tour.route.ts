import { Router } from "express";
import { TourController } from "./tour.controller";
import { Role } from "../user/user.interface";
import { createTourTypeZodSchema, createTourZodSchema, updateTourZodSchema } from "./tour.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";

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
router.get("/", TourController.getAllTours);
router.post("/create",
      checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
      validateRequest(createTourZodSchema),
      TourController.createTour
);
router.patch("/:id",
      checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
      validateRequest(updateTourZodSchema),
      TourController.updateTour
);
router.delete("/:id",
      checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
      TourController.deleteTour
);

export const TourRoutes = router;