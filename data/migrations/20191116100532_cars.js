exports.up = function(knex) {
  return knex.schema.createTable("cars", tbl => {
    tbl.increments();
    tbl
      .text("vin")
      .unique()
      .notNullable();
    tbl.text("make").notNullable();
    tbl.text("model").notNullable();
    tbl.integer("mileage").notNullable();
    tbl.text("transmission");
    tbl.text("title");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("cars");
};
