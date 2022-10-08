module CreateTableProjects

import SearchLight.Migrations: create_table, column, columns, pk, add_index, drop_table, add_indices

function up()
  create_table(:projects) do
    [
      pk()
      column(:name, :string, limit=100)
      column(:description, :string, limit=1000)
    ]
  end
  add_index(:projects, :name)
end

function down()
  drop_table(:projects)
end

end
