const { Router } = require("express"); // commonjs way of importing
const router = Router();

const db = require("../Config/db.cofig");
const breakOrder = require("../Utils/breakOrder");

router.get("/orderstatuscount", (req, res) => {
  db.task((t) => {
    return t.none("DROP TABLE IF EXISTS status_table CASCADE").then(() => {
      return t
        .none(
          "CREATE TABLE status_table AS SELECT order_id, status FROM order_table"
        )
        .then(() => {
          return t.any(
            "SELECT status, count(*) FROM status_table GROUP BY status"
          );
        });
    });
  })
    .then((result) => res.send({ msg: result }))
    .catch((err) => console.error(err));
});

router.get("/orderproductcount", (req, res) => {
  db.task((t) => {
    return t
      .none("DROP TABLE IF EXISTS product_only_table CASCADE")
      .then(() => {
        return t
          .none("DROP TABLE IF EXISTS prod_name_count_table CASCADE")
          .then(() => {
            return t
              .none(
                "CREATE TABLE product_only_table AS SELECT order_id, prod_id FROM order_table"
              )
              .then(() => {
                return t
                  .none(
                    "CREATE TABLE prod_name_count_table AS SELECT product_table.prod_id, product_table.prod_name FROM product_table LEFT JOIN product_only_table ON product_table.prod_id = product_only_table.prod_id"
                    // "SELECT prod_id, count(*) FROM product_only_table GROUP BY prod_id"
                  )
                  .then(() => {
                    return t.any(
                      "SELECT prod_name, count(*) FROM prod_name_count_table GROUP BY prod_id, prod_name;"
                    );
                  });
              });
          });
      });
  })
    .then((result) => res.send({ msg: result }))
    .catch((err) => console.error(err));
});

router.get("/topbranches", (req, res) => {
  db.task((t) => {
    return t.none("DROP TABLE IF EXISTS branch_only_table CASCADE").then(() => {
      return t
        .none(
          "CREATE TABLE branch_only_table AS SELECT order_id, branch_id FROM order_table"
        )
        .then(() => {
          return t.any(
            "SELECT branch_id, count(*) FROM branch_only_table GROUP BY branch_id ORDER BY count desc LIMIT 5"
          );
        });
    });
  })
    .then((result) => res.send({ msg: result }))
    .catch((err) => console.error(err));
});

// router.get("/:id", (req, res) => {
//   db.manyOrNone("SELECT * FROM order_table WHERE order_id=($1)", [
//     req.params.id,
//   ])
//     .then((result) => res.send(result))
//     .catch((err) => console.error(err));
// });

router.get("/:id", (req, res) => {
  let id = req.params.id;
  db.task((t) => {
    return t
      .none("DROP TABLE IF EXISTS current_order_price CASCADE")
      .then(() => {
        return t
          .none("DROP TABLE IF EXISTS current_order_totaprice_name CASCADE")
          .then(() => {
            return t
              .none("DROP TABLE IF EXISTS current_order_price_name CASCADE")
              .then(() => {
                return t
                  .none("DROP TABLE IF EXISTS current_order_price_name CASCADE")
                  .then(() => {
                    return t
                      .none(
                        "CREATE TABLE current_order_price AS SELECT order_table.order_id, order_table.cust_id, product_table.prod_name, product_table.prod_price, order_table.order_date, order_table.order_time, order_table.quantity, order_table.status FROM product_table LEFT JOIN order_table ON order_table.prod_id = product_table.prod_id;"
                      )
                      .then(() => {
                        return t
                          .none(
                            "CREATE TABLE current_order_price_name AS SELECT current_order_price.order_id, current_order_price.cust_id, current_order_price.prod_name, current_order_price.prod_price, current_order_price.order_date, current_order_price.order_time, current_order_price.quantity, current_order_price.status, customer_table.cust_name FROM current_order_price LEFT JOIN customer_table ON current_order_price.cust_id = customer_table.cust_id"
                          )
                          .then(() => {
                            return t
                              .none(
                                "CREATE TABLE current_order_totaprice_name AS SELECT *, prod_price*quantity AS total_price FROM current_order_price_name"
                              )
                              .then(() => {
                                return t.any(
                                  "SELECT * FROM current_order_totaprice_name WHERE order_id=($1)",
                                  [id]
                                )
                              });
                          });
                      });
                  });
              });
          });
      });
  })
    .then((result) => res.send({msg: result}))
    .catch((err) => console.error(err));
});

router.post("/createorder", (req, res) => {
  let { c_name, c_phno } = req.body;
  db.task((t) => {
    // check if user already exist
    return t
      .oneOrNone(
        "SELECT * FROM customer_table WHERE cust_name = $1 AND cust_phno = $2",
        [c_name, c_phno]
      )
      .then((cust) => {
        if (cust) {
          // console.log("found")
          return cust;
        } else {
          // if no --
          // add user in customer table
          return t
            .one("SELECT MAX(cust_id) FROM customer_table")
            .then((maxid) => {
              return t.one(
                "INSERT INTO customer_table VALUES ($1, $2, $3) RETURNING *",
                [maxid.max + 1, c_name, c_phno]
              );
            })
            .then((cust) => {
              return cust;
            });
        }
      });
  })
    .then((cust) => {
      db.task((t) => {
        return t
          .one(
            "SELECT MAX(id) as max_id, MAX(order_id) as max_oid FROM order_table"
          )
          .then((result) => {
            let list = [];
            let orderArr = breakOrder(req.body, cust.cust_id);
            orderArr.map((order) =>
              list.push({
                id: result.max_id,
                order_id: result.max_oid,
                ...order,
              })
            );
            // console.log(list)
            return list;
          })
          .then((list) => {
            db.tx((t) => {
              let i = 0;
              const queries = list.map((result) => {
                i++;
                new_id = result.id + i;
                return t.one(
                  "INSERT INTO order_table VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE, LOCALTIME(0), $7) RETURNING *",
                  [
                    new_id,
                    result.order_id + 1,
                    result.cust_id,
                    result.prod_id,
                    result.quantity,
                    result.status,
                    result.branch_id,
                  ]
                );
              });
              return t.batch(queries);
            })
              .then((result) => {
                let o_id = result[0].order_id;
                res.send({ msg: o_id });
              })
              .catch((err) => console.error(err));
          });
      });
    })
    .catch((err) => console.error(err));
});

module.exports = router; // commonjs way of exporting
