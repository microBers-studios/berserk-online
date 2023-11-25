using berserk_online_server.Exceptions;
using berserk_online_server.Interfaces;
using berserk_online_server.Interfaces.Repos;
using berserk_online_server.Models.Cards;
using berserk_online_server.Models.Db;
using berserk_online_server.Models.Requests;

namespace berserk_online_server.Facades.Database
{
    public class DeckDatabase : IDeckDatabase
    {
        private readonly IUserRepository _userRepo;
        private readonly IDeckBuilder _deckBuilder;
        private readonly IDeckRepository _deckRepo;
        private readonly ICache<int, DeckDb[]> _cache;
        public DeckDatabase(IUserRepository userRepository, IDeckBuilder deckBuilder,
            IDeckRepository deckRepo, ICache<int, DeckDb[]> userCache)
        {
            _userRepo = userRepository;
            _deckBuilder = deckBuilder;
            _deckRepo = deckRepo;
            _cache = userCache;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        /// <exception cref="NotFoundException"></exception>
        public Deck[] GetAll(string email)
        {
            var decks = getDecks(new UserInfoRequest() { Email = email });
            if (decks.Length > 0 && decks[0].UserId != null)
            {
                _cache.Set((int)decks[0].UserId, decks);
            }
            return decks.Select(_deckBuilder.BuildFromDb).ToArray();
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="NotFoundException"></exception>
        public Deck Get(string id)
        {
            var deck = _deckRepo.Get(id);
            return _deckBuilder.BuildFromDb(deck);
        }
        public void Update(DeckRequest deck, string email)
        {
            if (_deckRepo.IsUnique(deck.Id))
                throw new NotFoundException();
            if (!isUserOwnDeck(deck, email))
                throw new InvalidOperationException("No permission to update this deck.");
            var deckDb = _deckBuilder.BuildToDb(_deckBuilder.BuildFromRequest(deck));
            _deckRepo.Update(deckDb);
            var updatedDeck = _deckRepo.Get(deck.Id);
            if (updatedDeck.UserId != null)
                _cache.Remove((int)updatedDeck.UserId);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="email"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="NotFoundException"></exception>
        public Deck[] Delete(string email, string id)
        { 
            if (_deckRepo.IsUnique(id)) throw new NotFoundException();
            if (!isUserOwnDeck(new DeckRequest() { Id = id }, email))
                throw new InvalidOperationException();
            _deckRepo.Delete(id);
            var decks = _deckRepo.GetByUser(email);
            if (decks.Length > 0 && decks[0].UserId != null)
                _cache.Remove((int)decks[0].UserId);
            return decks.Select(_deckBuilder.BuildFromDb).ToArray();
        }
        public void Add(string email, DeckRequest deck)
        {
            var user = _userRepo.Get(email);
            if (!_deckRepo.IsUnique(deck.Id))
            {
                throw new InvalidOperationException("Deck id not unique");
            }
            var deckDb = _deckBuilder.BuildToDb(_deckBuilder.BuildFromRequest(deck));
            deckDb.UserId = user.Id;
            _cache.Remove(user.Id);
            _deckRepo.Add(deckDb);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="ArgumentNullException"></exception>
        /// <exception cref="NotFoundException"></exception>
        private DeckDb[] getDecks(UserInfoRequest request)
        {
            if (request.Email == null)
                throw new ArgumentNullException(nameof(request.Email));
            var decks = _deckRepo.GetByUser(request.Email).ToArray();
            return decks;
        }
        private bool isUserOwnDeck(DeckRequest deck, string email)
        {   
            var userDecks = _deckRepo.GetByUser(email);
            return userDecks.Any(d => d.Id == deck.Id);
        }
    }
}
