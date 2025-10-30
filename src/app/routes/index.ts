import { Router } from "express"
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { TourRoutes } from "../modules/tour/tour.route";
import { DivisionRoutes } from "../modules/division/division.route";

export const router = Router();

const moduleRoutes = [
      {
            path: "/user",
            route: UserRoutes
      },
      {
            path: "/auth",
            route: AuthRoutes
      },
      {
            path: "/tour",
            route: TourRoutes
      },
      {
            path: "/division",
            route: DivisionRoutes
      }
];

moduleRoutes.forEach((route) => {
      router.use(route.path, route.route)
});