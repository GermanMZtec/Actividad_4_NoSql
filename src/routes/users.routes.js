import express from "express";
import { createUser, deleteUser, getUserFormData, listUsers, updateUser } from "../users/userService.js";
import { isValidObjectId } from "../db/mongo.js";

const router = express.Router();

function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await listUsers();
    res.render("users/index", { title: "Users", users });
  })
);

router.get(
  "/new",
  asyncHandler(async (req, res) => {
    res.render("users/new", { title: "Create user", user: null });
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    await createUser(req.body);
    res.redirect("/users");
  })
);

router.get(
  "/edit/:id",
  asyncHandler(async (req, res) => {
    const { user } = await getUserFormData(req.params.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("users/edit", { title: "Edit user", user });
  })
);

router.post(
  "/edit/:id",
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid user id");
    }

    await updateUser(req.params.id, req.body);
    res.redirect("/users");
  })
);

router.post(
  "/delete/:id",
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid user id");
    }

    await deleteUser(req.params.id);
    res.redirect("/users");
  })
);

export default router;