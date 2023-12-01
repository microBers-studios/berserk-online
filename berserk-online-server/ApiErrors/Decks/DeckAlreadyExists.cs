using berserk_online_server.Utils;
namespace berserk_online_server.ApiErrors.Decks
{
    public class DeckAlreadyExists : ApiError
    {
        public DeckAlreadyExists(object? ctx) : base(ctx)
        {
            Id = (int)ApiErrorType.DeckAlreadyExists;
            Message = "Deck with this id already exists";
        }
    }
}
