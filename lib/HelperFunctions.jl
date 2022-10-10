module HelperFunctions

function dropdown_transform(arr)
    return [Dict("id" => el.id.value, "value" => el.name) for el in arr]
end

export dropdown_transform

end