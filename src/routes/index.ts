import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { CarRoutes } from "../modules/Car/car.route";

const router = Router();
const moduleRoutes: { path: string; router: Router }[] = [
  {
    path: "/auth",
    router: AuthRoutes,
  },
  {
    path: "/cars",
    router: CarRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.router);
});
export default router;
