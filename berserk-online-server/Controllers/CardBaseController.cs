using berserk_online_server.Facades.CardBase;
using berserk_online_server.Models.Cards;
using Microsoft.AspNetCore.Mvc;

namespace berserk_online_server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CardBaseController : ControllerBase
    {
        private CardProvider _cardProvider;
        public CardBaseController(CardProvider cardProvider)
        {
            _cardProvider = cardProvider;
        }

        [HttpGet("getAll")]
        public DeserealizedCard[] GetAll()
        {

            return _cardProvider.GetAll();
        }
        [HttpGet("find")]
        public DeserealizedCard[] Find(string query, int? limit)
        {
            return _cardProvider.Find(query, limit ?? -1);
        }
    }
}
