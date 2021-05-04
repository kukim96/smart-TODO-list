/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const getCategory = require('./getCategory');
const queryCategory = require('./queryCategory');
const { getAllCategories } = require('../routes/database');
// const database = require('./database');

module.exports = (db) => {
  // 8080:users/user_id

  router.get("/:user_id", (req, res) => {
    const user = req.params;
    // console.log(user);
    db.getAllCategories()
    .then((result) => {
      const types = result;
      // console.log(types);

      db.getTodo(user)
      .then(data => {
        // console.log(data);
          const userTodoLists = data;
          res.render("show",{userTodoLists,types});
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
    });
  });

  //8080:users/user_id/:todolist_id
  router.delete("/:user_id/:todolist_id", (req, res) => {
    console.log(req.params);
    const id = req.params;
    console.log(id);

    db.getAllCategories()
    .then((result) => {
      const types = result;
      console.log(types);

    db.deleteToDoById(id.todolist_id)
    .then(data => {
      const userTodoLists = data;
      // console.log(userTodoLists)
      res.render("show",{userTodoLists, types});
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });

      });
    });
  });

  router.put("/:user_id/:todolist_id/:category_id", (req,res) => {
    // console.log(req.params);
    const userId = req.params.user_id;
    const todoId = req.params.todolist_id;
    const cateId = req.params.category_id;

    // db.getAllCategories()
    // .then((result) => {
    //   const types = result;
    //   console.log(types);

    db.changeCateById(userId, todoId, cateId)

    .then(data => {
      const userTodoLists = data;
      // console.log(userTodoLists)
      res.render("show",{userTodoLists, types});
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });

    //  });
    });
  });

 // 8080:users/user_id/new
  router.post('/:user_id/new', (req, res) => {
    console.log(req.params);
    const user_id = parseInt(req.params.user_id);
    const input = req.body.todolist;

    db.getAllCategories()
    .then((result) => {
      const types = result;
      console.log(types);

    getCategory(input)
      .then(res => {
      return db.getIdByName(res)
      })
      .then(res =>{
      const cateId = res[0].id;
      return queryCategory.queryCategory(user_id, cateId, input);
      })
      .then(res => {
        // console.log("user res: ",res);
       return db.getTodo(res);
      })
      .then(data => {
        const userTodoLists = data;
        res.render("show",{userTodoLists, types});
      })
      .catch(err => {
        console.error(err);
        res.send(err)
      });

    });
  });
  return router;

};
