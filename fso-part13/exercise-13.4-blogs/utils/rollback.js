// Use test environemnt form .env.test file.
const dotenv = require('dotenv')
const path = require('path')
dotenv.config({path: path.join(__dirname, '..', '.env.test')}) // Joining path using path.join and __dirname allows us to execute files withSupertest using `fr withSupertest` from inside __tests__ folder and from the root folder as well.

// Rollback last migration
const {rollbackMigration} = require('../initPostgreSql')
rollbackMigration()

/* 
LEARN ABOUT MIGRATIONS
RUNNING MIGRATIONS ONCE ONLY REVERTS ONE LAST MIGRATION, yikes!
array@arch-os exercise-13.4-blogs$ nr migration:down


> fso-part13@1.0.0 migration:down
> node utils/rollback.js

SERVER: DATABASE_URL postgres://array@localhost:5432/myDb1_blogs_test initPostgreSql.js #30
SERVER: CONNECTION TO DB::SUCCESSFUL initPostgreSql.js #61
Migrations up to date { files: [] }
{ event: 'reverting', name: '20220626_02_add_read_later_table.js' }
{
  event: 'reverted',
  name: '20220626_02_add_read_later_table.js',
  durationSeconds: 0.014
}
array@arch-os exercise-13.4-blogs$ nr migration:down

> fso-part13@1.0.0 migration:down
> node utils/rollback.js

SERVER: DATABASE_URL postgres://array@localhost:5432/myDb1_blogs_test initPostgreSql.js #30
SERVER: CONNECTION TO DB::SUCCESSFUL initPostgreSql.js #61
{ event: 'migrating', name: '20220626_02_add_read_later_table.js' }
{ event: 'reverting', name: '20220624_02_add_year_field.js' }
{
  event: 'migrated',
  name: '20220626_02_add_read_later_table.js',
  durationSeconds: 0.02
}
Migrations up to date { files: [ '20220626_02_add_read_later_table.js' ] }
{
  event: 'reverted',
  name: '20220624_02_add_year_field.js',
  durationSeconds: 0.015
}
array@arch-os exercise-13.4-blogs$ nr migration:down

> fso-part13@1.0.0 migration:down
> node utils/rollback.js

SERVER: DATABASE_URL postgres://array@localhost:5432/myDb1_blogs_test initPostgreSql.js #30
SERVER: CONNECTION TO DB::SUCCESSFUL initPostgreSql.js #61
{ event: 'migrating', name: '20220624_02_add_year_field.js' }
{ event: 'reverting', name: '20220626_02_add_read_later_table.js' }
{
  event: 'migrated',
  name: '20220624_02_add_year_field.js',
  durationSeconds: 0.02
}
Migrations up to date { files: [ '20220624_02_add_year_field.js' ] }
{
  event: 'reverted',
  name: '20220626_02_add_read_later_table.js',
  durationSeconds: 0.017
}
array@arch-os exercise-13.4-blogs$

*/
