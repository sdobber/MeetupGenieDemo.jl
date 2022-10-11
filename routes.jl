using Genie.Router
using Genie.Renderer.Json
using Genie.Requests

using MeetupGenieDemo.Users
using MeetupGenieDemo.Projects
using MeetupGenieDemo.Submissions
using MeetupGenieDemo.HelperFunctions

route("/") do
  serve_static_file("index.html")
end

route("/api/v1/submittext/getdata") do
  users = all(User)
  projects = all(Project)
  data = Dict("Users" => dropdown_transform(users),
    "Projects" => dropdown_transform(projects))
  return json(data)
end

route("/api/v1/submittext/formsubmit", method=POST) do
  data = jsonpayload()
  comment = data["Comment"]
  user = data["User"]
  project = data["Project"]
  wordcount = data["Wordcount"]
  text = data["Submissiontext"]
  Submission(userid=user, projectid=project, submissiontext=text,
    wordcount=wordcount, comment=comment) |> save
  return nothing
end

route("/api/v1/submittext/filesubmit", method=POST) do
  payload = filespayload()
  filename = payload["ST,file"].name
  text = String(payload["ST,file"].data)
  words = split(text, (' ', '\n', '\t', '-', '.', ',', ':', '_', '"', ';', '!');
    keepempty=false)
  wordcount = length(words)
  result = Dict("Wordcount" => wordcount, "Submissiontext" => text)
  return json(result)
end

route("/api/v1/view/getsubmissions") do
  users = all(User)
  projects = all(Project)
  submissions = all(Submission)
  columns = ["User", "Project", "Comment", "Wordcount", "Text"]

  table = Dict("dataSource" => get_datasource(submissions, users, projects),
    "columns" => get_columns(columns))
  return json(table)
end