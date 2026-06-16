import express from "express";
import {
  createTask,
  getTaskById,
  getTasksByUserId,
  deleteTask,
  updateTask,
} from "#db/queries/tasks";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";

const router = express.Router();

router.use(requireUser);
router.get("/", async (req, res, next) => {
  try {
    const tasks = await getTasksByUserId(req.user.id);

    res.send(tasks);
  } catch (err) {
    next(err);
  }
});

router.post("/", requireBody(["title", "done"]), async (req, res, next) => {
  try {
    const { title, done } = req.body;

    const task = await createTask(title, done, req.user.id);

    res.status(201).send(task);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", requireBody(["title", "done"]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, done } = req.body;

    const task = await getTaskById(id);

    if (!task || task.user_id !== req.user.id) {
      return res.status(403).send("Forbidden.");
    }
    const updatedTask = await updateTask(id, title, done);
    res.send(updatedTask);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await getTaskById(id);

    if (!task) {
      return res.status(404).send("Task not found.");
    }

    if (task.user_id !== req.user.id) {
      return res.status(403).send("You do not own this task.");
    }

    await deleteTask(id);

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
