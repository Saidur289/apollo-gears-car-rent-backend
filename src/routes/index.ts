import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { CarRoutes } from "../modules/Car/car.route";
import { RentRoutes } from "../modules/Rent/rent.route";
import { BidRoutes } from "../modules/Bid/bid.route";
import { PaymentRoute } from "../modules/payment/payment.route";

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
  {
    path: "/rents",
    router: RentRoutes,
  },
  {
    path: "/bids",
    router: BidRoutes,
  },
  {
    path: "/payment",
    router: PaymentRoute,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.router);
});
export default router;
