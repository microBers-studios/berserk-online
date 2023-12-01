using berserk_online_server.Utils;

namespace berserk_online_server.ApiErrors.Rooms
{
    public class RoomIsFull : ApiError
    {
        public RoomIsFull(object? ctx) : base(ctx)
        {
            Id = (int)ApiErrorType.RoomIsFull;
            Message = "Room is already full";
        }
    }
}
