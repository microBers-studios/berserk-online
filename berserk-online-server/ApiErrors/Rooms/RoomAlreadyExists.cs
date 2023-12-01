using berserk_online_server.Utils;

namespace berserk_online_server.ApiErrors.Rooms
{
    public class RoomAlreadyExists : ApiError
    {
        public RoomAlreadyExists(object? ctx) : base(ctx)
        {
            Id = (int)ApiErrorType.RoomAlreadyExists;
            Message = "Room with this name already exists.";
        }
    }
}
