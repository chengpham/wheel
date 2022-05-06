exports.up = function(knex) {
    return knex.schema.table('wheel', table => {
        table.boolean('is_private');
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.table('wheel', table => {
        table.dropColumn('is_private');
    })
  };