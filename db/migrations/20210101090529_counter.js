exports.up = function(knex) {
    return knex.schema.createTable('counter', table => {
      table.bigIncrements('id');
      table.integer('count');
    }).then(()=>
      knex('counter').insert({count:1})
    )
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('counter');
  };
  
