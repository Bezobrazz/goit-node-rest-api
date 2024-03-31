import jwt from "jsonwebtoken";
import { HttpError } from "../helpers/HttpError.js";
import { findUserServise } from "../services/usersServises.js";
const { JWT_SECRET } = process.env;

export const authenticate = async (req, _, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(HttpError(401, "Not authorized"));
  }

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    return next(HttpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);

    const user = await findUserServise({ _id: id });
    if (!user || user.token !== token) {
      return next(HttpError(401, "Not authorized"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, error.message));
  }
};
