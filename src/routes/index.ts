import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";

const router = Router();
const moduleRoutes: { path: string; router: Router }[] = [
  {
    path: "/auth",
    router: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.router);
});
export default router;
