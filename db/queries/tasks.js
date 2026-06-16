import db from "#db/client";

export async function createTask(title, done, userId) {
  const sql = `
    INSERT INTO tasks(title, done, user_id)
    VALUES ($1, $2, $3)
    RETURNING *
    `;

  const {
    rows: [task],
  } = await db.query(sql, [title, done, userId]);
  return task;
}

export async function getTasksByUserId(userId) {
  const sql = `
    SELECT *
    FROM tasks
    WHERE user_id = $1
    `;

  const { rows: tasks } = await db.query(sql, [userId]);
  return tasks;
}

export async function getTaskById(id) {
  const sql = `
    SELECT *
    FROM tasks
    WHERE id = $1
    `;

  const {
    rows: [task],
  } = await db.query(sql, [id]);
  return task;
}

export async function updateTask(id, title, done) {
  const sql = `
 UPDATE tasks
 SET title = $2, done = $3
 WHERE id = $1
 RETURNING *
 `;

  const {
    rows: [task],
  } = await db.query(sql, [id, title, done]);
  return task;
}

export async function deleteTask(id) {
  const sql = `
    DELETE FROM tasks
    WHERE id = $1
    RETURNING *
    `;

  const {
    rows: [task],
  } = await db.query(sql, [id]);
  return task;
}
