const tableName = 'fights';

export async function up(knex) {
  await knex.schema.createTable(tableName, function (table) {
    table.increments('id').primary();
    table.integer('first_pokemon_id').notNullable();
    table.integer('second_pokemon_id').notNullable();
    table.integer('winner_pokemon_id').notNullable();
    table.integer('rounds').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTable(tableName);
}