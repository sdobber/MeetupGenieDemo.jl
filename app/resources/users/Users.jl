module Users

import SearchLight: AbstractModel, DbId
import Base: @kwdef

export User

@kwdef mutable struct User <: AbstractModel
  id::DbId = DbId()
  name::String = ""
  email::String = ""
  nationality::String = ""
end

end
