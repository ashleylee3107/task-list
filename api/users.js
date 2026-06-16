import express from "express";
import bcrypt from "bcrypt";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";
import { createUser, getUserByUsername } from "#db/queries/users";

const router = express.Router();

router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await createUser(username, hashedPassword);

      const token = createToken({ id: user.id });
      res.status(201).send(token);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const user = await getUserByUsername(username);

      if (!user) {
        return res.status(401).send("Invalid username or password.");
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).send("Invalid username or password.");
      }

      const token = createToken({ id: user.id });

      res.send(token);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
