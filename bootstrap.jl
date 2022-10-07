(pwd() != @__DIR__) && cd(@__DIR__) # allow starting app from bin/ dir

using MeetupGenieDemo
const UserApp = MeetupGenieDemo
MeetupGenieDemo.main()
