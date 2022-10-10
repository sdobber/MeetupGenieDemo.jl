using Genie.Router
using Genie.Renderer.Json

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