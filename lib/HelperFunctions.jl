module HelperFunctions

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

export dropdown_transform, get_columns, get_datasource

end