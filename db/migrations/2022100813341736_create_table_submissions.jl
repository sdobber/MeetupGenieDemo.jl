module CreateTableSubmissions

import SearchLight.Migrations: create_table, column, columns, pk, add_index, drop_table, add_indices

function up()
  create_table(:submissions) do
    [
      pk()
      column(:submissiontext, :string)
      column(:userid, :integer)
      column(:projectid, :integer)
      column(:wordcount, :integer)
      column(:comment, :string)
    ]
  end
end

function down()
  drop_table(:submissions)
end

end
