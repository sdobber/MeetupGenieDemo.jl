module HelperFunctions

using Genie

"""
    genie_settings()

Returns the current Genie settings as dictionary.
"""
function genie_settings()
    return Dict(:server_host => Genie.config.server_host,
        :server_port => Genie.config.server_port)
end

"""
    pure_json(dict)

Converts the dictionary `dict` to a JSON string.
"""
pure_json = Genie.Renderer.Json.JSONParser.json  # shortcut to Genie's json function
# Makes one's life easier when broadcasting dictionaries: 
Genie.WebChannels.broadcast(ch, msg::Dict) = Genie.WebChannels.broadcast(ch, pure_json(msg))

function dropdown_transform(arr)
    return [Dict("id" => el.id.value, "value" => el.name) for el in arr]
end

function get_columns(colnames)
    return [Dict("title" => name, "dataIndex" => name, "key" => name) for name in colnames]
end

function get_datasource(submissions, users, projects)
    out = []
    for sub in submissions
        text = sub.submissiontext
        user = filter(x -> x.id.value == sub.userid, users)
        project = filter(x -> x.id.value == sub.projectid, projects)
        text = length(text) <= 50 ? text : text[1:50] * "..."
        push!(out, Dict("key" => sub.id.value,
            "ID" => string(sub.id.value),
            "User" => user[1].name,
            "Project" => project[1].name,
            "Comment" => sub.comment,
            "Wordcount" => sub.wordcount,
            "Text" => text
        )
        )
    end
    return out
end

export dropdown_transform, get_columns, get_datasource, genie_settings

end