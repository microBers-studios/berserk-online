using berserk_online_server.Data_objects.Cards;
using berserk_online_server.DTO.Cards;
using berserk_online_server.Implementations.CardBase;
using berserk_online_server.Utils;
using Microsoft.AspNetCore.Mvc;

namespace berserk_online_server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CardBaseController : ControllerBase
    {
        private ICardProvider _cardProvider;
        public CardBaseController(ICardProvider cardProvider)
        {
            _cardProvider = cardProvider;
        }

        [HttpGet("getAll")]
        public DeserealizedCard[] GetAll()
        {

            return _cardProvider.GetAll();
        }
        [HttpGet("find")]
        public ActionResult<DeserealizedCard[]> Find(string? query,string? rarity, bool? elite, string? type,
            string? elements,string? price, string? health, string? moves, int? limit)
        {
            try
            {
                var filterParams = FilterFabric.Create(new FilterParamsRaw()
                {
                    Element = elements,
                    Health = health,
                    Elite = elite,
                    Type = type,
                    Moves = moves,
                    Price = price,
                    Rarity = rarity,
                });
                return _cardProvider.Find(query, filterParams, limit ?? -1);
            } catch (FormatException)
            {
                return BadRequest(ApiErrorFabric.Create(ApiErrorType.InvalidFormat));
            }
            
        }
    }
}
