const tableName = 'users';

export async function up(knex) {
  await knex.schema.table(tableName, function (table) {
    table.string('secret2fa', 128);
    table.boolean('connected2fa').notNullable().defaultTo(false);
  });
}

export async function down(knex) {
  await knex.schema.table(tableName, function (table) {
    table.dropColumn('secret2fa');
    table.dropColumn('connected2fa');
  });
}
