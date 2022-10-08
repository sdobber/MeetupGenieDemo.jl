module CreateTableUsers

import SearchLight.Migrations: create_table, column, columns, pk, add_index, drop_table, add_indices

function up()
  create_table(:users) do
    [
      pk()
      column(:name, :string, limit=100)
      column(:email, :string, limit=100)
      column(:nationality, :string, limit=20)
    ]
  end
  add_index(:users, :name)
end

function down()
  drop_table(:users)
end

end
