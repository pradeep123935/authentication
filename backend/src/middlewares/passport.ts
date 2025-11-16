import passport from "passport";
import { setUpJwtStrategy } from "../common/strategies/jwt.strategy";

const intializePassport = () => {
  setUpJwtStrategy(passport);
};

intializePassport();

export default passport;
