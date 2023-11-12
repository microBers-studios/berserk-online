using berserk_online_server.Contexts;
using berserk_online_server.Exceptions;
using berserk_online_server.Models.Db;

namespace berserk_online_server.Repository
{
    public class DeckRepository : IDeckRepository
    {
        private readonly Databases _db;
        private readonly UserRepository _userRepo;
        public DeckRepository(Databases db, UserRepository userRepository)
        {
            _db = db;
            _userRepo = userRepository;
        }
        public void Add(DeckDb entity)
        {
            _db.Decks.Add(entity);
            _db.SaveChanges();
        }

        public void Delete(string id)
        {
            var deck = Get(id);
            _db.Decks.Remove(deck);
            _db.SaveChanges();
        }

        public DeckDb Get(string id)
        {
            var deck = _db.Decks.Where(d => d.Id == id).FirstOrDefault();
            checkIsNull(deck);
#pragma warning disable CS8603 // Возможно, возврат ссылки, допускающей значение NULL.
            return deck;
#pragma warning restore CS8603 // Возможно, возврат ссылки, допускающей значение NULL.
        }
        public DeckDb[] GetByUser(string email)
        {
            var user = _userRepo.Get(email);
            return _db.Decks.Where(d => d.UserId == user.Id).ToArray();
        }

        public void Update(DeckDb entity)
        {
            var oldDeck = Get(entity.Id);
            oldDeck.Sideboard = entity.Sideboard;
            oldDeck.UserId = entity.UserId;
            oldDeck.Main = entity.Main;
            oldDeck.Elements = entity.Elements;
            oldDeck.Name = entity.Name;
            _db.Decks.Update(oldDeck);
            _db.SaveChanges();
        }
        private void checkIsNull(object? obj)
        {
            if (obj == null)
            {
                throw new NotFoundException();
            }
        }
    }
}
