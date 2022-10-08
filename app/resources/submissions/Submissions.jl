module Submissions

import SearchLight: AbstractModel, DbId
import Base: @kwdef

export Submission

@kwdef mutable struct Submission <: AbstractModel
  id::DbId = DbId()
  userid::Int = 0
  projectid::Int = 0
  submissiontext::String = ""
  wordcount::Int = 0
  comment::String = ""
end

end
