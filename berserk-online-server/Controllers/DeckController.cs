using berserk_online_server.DTO.Cards;
using berserk_online_server.DTO.Requests;
using berserk_online_server.Exceptions;
using berserk_online_server.Interfaces;
using berserk_online_server.Utils;
using Microsoft.AspNetCore.Mvc;

namespace berserk_online_server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DeckController : ControllerBase
    {
        private readonly IUsersDatabase _db;
        private readonly IAuthenticationManager _authenticationManager;
        public DeckController(IUsersDatabase db, IAuthenticationManager manager)
        {
            _db = db;
            _authenticationManager = manager;
        }
        [HttpGet("getMe")]
        public ActionResult<Deck[]> GetMe()
        {
            try
            {
                var email = getMail();
                return Ok(_db.Decks.GetAll(email));
            }
            catch (ArgumentNullException)
            {
                return Unauthorized();
            }
            catch (NotFoundException)
            {
                return NotFound(ApiErrorFabric.Create(ApiErrorType.NotFound, "user not found."));
            }


        }
        [HttpGet("get/{id}")]
        public ActionResult<Deck> Get(string id)
        {
            try
            {
                return Ok(_db.Decks.Get(id));
            }
            catch (NotFoundException)
            {
                return NotFound(ApiErrorFabric.Create(ApiErrorType.NotFound, new
                {
                    id,
                    message = "deck with current id not exists"
                }));
            }
        }
        [HttpPost("add")]
        public IActionResult Add(DeckRequest request)
        {
            try
            {
                var email = getMail();
                _db.Decks.Add(email, request);
                return Ok();
            }
            catch (ArgumentNullException)
            {
                return Unauthorized();
            }
            catch (NotFoundException)
            {
                return NotFound(ApiErrorFabric.Create(ApiErrorType.NotFound, "user not found."));
            }
            catch (InvalidOperationException)
            {
                return BadRequest(ApiErrorFabric.Create(ApiErrorType.DeckAlreadyExists, request.Id));
            }
        }
        [HttpPut("update")]
        public IActionResult Update(DeckRequest request)
        {
            try
            {
                _db.Decks.Update(request, getMail());
                return Ok();
            }
            catch (ArgumentNullException)
            {
                return Unauthorized();
            }
            catch (NotFoundException)
            {
                return BadRequest(ApiErrorFabric.Create(ApiErrorType.NotFound, "deck with this id not found."));
            }
            catch (InvalidOperationException)
            {
                return BadRequest(ApiErrorFabric.Create(ApiErrorType.NoAccess, request));
            }
        }
        [HttpDelete("delete")]
        public ActionResult<Deck[]> Delete(string id)
        {
            try
            {
                var email = getMail();
                var decks = _db.Decks.Delete(email, id);
                return Ok(decks);
            }
            catch (ArgumentNullException)
            {
                return Unauthorized();
            }
            catch (NotFoundException)
            {
                return BadRequest(ApiErrorFabric.Create(ApiErrorType.NotFound, new
                {
                    id,
                    message = "deck with current id not exists"
                }));
            }
            catch (InvalidOperationException)
            {
                return BadRequest(ApiErrorFabric.Create(ApiErrorType.NoAccess, new { id }));
            }

        }
        private string getMail()
        {
            return _authenticationManager.GetMail();
        }
    }
}
