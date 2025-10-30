import { Router } from "express";
import { DivisionController } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDivisionSchema, updateDivisionSchema } from "./division.validation";


const router = Router();

router.post("/create",
      validateRequest(createDivisionSchema),
      checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
      DivisionController.createDivision
);
router.get("/",
      DivisionController.getAllDivisions
);
router.get("/:slug",
      DivisionController.getSingleDivision
);
router.patch("/:id",
      validateRequest(updateDivisionSchema),
      checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
      DivisionController.updateDivision
);
router.delete("/:id",
      checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
      DivisionController.deleteDivision
);

export const DivisionRoutes = router;