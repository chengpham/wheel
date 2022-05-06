exports.up = function(knex) {
    return knex.schema.createTable('wheel', table => {
      table.bigIncrements('id');
      table.text('username')
      table.text('group_name')
      table.text('image_url');
      table.text('members');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('wheel');
  };
  