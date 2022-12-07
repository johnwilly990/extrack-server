const knex = require("knex");
const knexConfig = require("../knexfile").development;
const db = knex(knexConfig);
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

exports.addEntry = async (req, res) => {
  try {
    const { item_name, amount, category, user_id } = req.body;
    const { authorization } = req.headers;

    // Validate empty fields and negative or 0 values
    if (item_name === "" || category === "" || user_id === "" || amount <= 0) {
      return res.status(400).json({
        message: "All fields required/Please enter correct numerical amount",
      });
    }

    // Verify valid token
    const token = authorization.split(" ")[1];
    jwt.verify(token, SECRET_KEY, async (err, _decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Invalid token",
        });
      }

      // New object to be added into db
      const newEntry = {
        id: uuid(),
        user_id: user_id,
        item_name: item_name,
        amount: amount,
        category: category,
      };

      // Inserts new entry to db
      await db("recurring_expenses_entries").insert(newEntry);

      // Sums all recurring expenses of same user ID
      const sumRecurringArr = await db("recurring_expenses_entries")
        .select("user_id")
        .sum("amount")
        .groupBy("user_id");

      // Returns object with matching user Id
      const correspondingId = sumRecurringArr.find(
        (sum) => sum.user_id === newEntry.user_id
      );

      // Retrieves sum value
      const sumOfReccuring = Object.values(correspondingId)[1];

      // Updates Users table with summed value
      await db("users")
        .where({ id: user_id })
        .update({ recurring_amount: sumOfReccuring });

      return res.status(201).json({ message: "New entry successfully added" });
    });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

exports.updateEntry = async (req, res) => {
  try {
    const { item_name, amount, user_id, category } = req.body;
    const { authorization } = req.headers;

    // Validate empty fields and negative or 0 values
    if (item_name === "" || category === "" || user_id === "" || amount <= 0) {
      return res.status(400).json({
        message: "All fields required/Please enter correct numerical amount",
      });
    }

    // Verify valid token
    const token = authorization.split(" ")[1];
    jwt.verify(token, SECRET_KEY, async (err, _decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Invalid token",
        });
      }

      // New object to be added into db
      const entry = {
        user_id: user_id,
        item_name: item_name,
        amount: amount,
        category: category,
      };

      // Inserts new entry to db
      await db("recurring_expenses_entries")
        .where({ user_id: user_id, item_name: item_name })
        .update(entry);

      // Sums all recurring expenses of same user ID
      const sumRecurringArr = await db("recurring_expenses_entries")
        .select("user_id")
        .sum("amount")
        .groupBy("user_id");

      // Returns object with matching user Id
      const correspondingId = sumRecurringArr.find(
        (sum) => sum.user_id === entry.user_id
      );

      // Retrieves sum value
      const sumOfReccuring = Object.values(correspondingId)[1];

      // Updates Users table with summed value
      await db("users")
        .where({ id: user_id })
        .update({ recurring_amount: sumOfReccuring });

      return res.status(200).json({ message: "Entry successfully updated" });
    });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

exports.deleteEntry = async (req, res) => {
  try {
    // const { id } = req.params;
    // const { authorization } = req.headers;
    // const databaseId = await db("recurring_expenses_entries").where({ id: id });
    // console.log(databaseId);
    // if (!databaseId.length) {
    //   return res.status(400).json({
    //     message: `Invalid ID ${id}`,
    //   });
    // }
    // const token = authorization.split(" ")[1];
    // jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    //   if (err) {
    //     return res.status(401).json({
    //       message: "Invalid token",
    //     });
    //   }
    //   // Sums all recurring expenses of same user ID
    //   const sumRecurringArr = await db("recurring_expenses_entries")
    //     .select("user_id")
    //     .sum("amount")
    //     .groupBy("user_id");
    //   // Deletes entry based on ID
    //   await db("recurring_expenses_entries").del().where({ id: id });
    //   // Returns object with matching user Id
    //   const correspondingId = sumRecurringArr.find(
    //     (sum) => sum.user_id === decoded.id
    //   );
    //   console.log(correspondingId);
    //   // Retrieves sum value
    //   const sumOfReccuring = Object.values(correspondingId)[1];
    //   // Updates Users table with summed value
    //   await db("users")
    //     .where({ id: decoded.id })
    //     .update({
    //       recurring_amount: sumRecurringArr === [] ? 0 : sumOfReccuring,
    //     });
    //   return res.status(200).json({
    //     message: `Entry successfully deleted. Recurring amount set to ${
    //       sumRecurringArr === [] ? 0 : sumOfReccuring
    //     }`,
    //   });
    // });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
