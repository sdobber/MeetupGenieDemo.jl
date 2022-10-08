module Projects

import SearchLight: AbstractModel, DbId
import Base: @kwdef

export Project

@kwdef mutable struct Project <: AbstractModel
  id::DbId = DbId()
  name::String = ""
  description::String = ""
end

end
