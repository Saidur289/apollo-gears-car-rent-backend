import { Router } from "express";

const router = Router();
const moduleRoutes: { path: string; router: Router }[] = [
  // {
  // //   path: "/users",
  //     // router: require("./users").default,
  // },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.router);
});
export default router;
