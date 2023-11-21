const tableName = 'users';

export async function up(knex) {
  await knex.schema.createTable(tableName, function (table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.enum('role', ['admin', 'user']).notNullable().defaultTo('user');
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTable(tableName);
}