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
  wordcount = 0  # add later
  text = ""  # add later
  Submission(userid=user, projectid=project, submissiontext=text,
    wordcount=wordcount) |> save
  return nothing
end