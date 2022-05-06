
exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
      table.bigIncrements('id');
      table.string('email');
      table.string('password');
      table.text('profile_img');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.unique('email');
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('users');
  };
  