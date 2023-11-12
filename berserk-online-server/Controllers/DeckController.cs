using berserk_online_server.Exceptions;
using berserk_online_server.Facades;
using berserk_online_server.Models.Requests;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;

namespace berserk_online_server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DeckController : ControllerBase
    {
        private UsersDatabase _db;
        public DeckController(UsersDatabase db)
        {
            _db = db;
        }
        [HttpGet("getMe")]
        public IResult GetMe()
        {
            try
            {
                var email = getMail();
                return Results.Ok(_db.Decks.GetAll(email));
            }
            catch (ArgumentNullException)
            {
                return Results.Unauthorized();
            }
            catch (NotFoundException)
            {
                return Results.NotFound(ApiErrorFabric.Create(ApiErrorType.NotFound, "user not found."));
            }


        }
        [HttpGet("getMe/{id}")]
        public IResult Get(string id)
        {
            try
            {
                return Results.Ok(_db.Decks.Get(id));
            }
            catch (NotFoundException)
            {
                return Results.BadRequest(ApiErrorFabric.Create(ApiErrorType.NotFound, new
                {
                    id,
                    message = "deck with current id not exists"
                }));
            }
        }
        [HttpPost("add")]
        public IResult Add(DeckRequest request)
        {
            try
            {
                var email = getMail();
                _db.Decks.Add(email, request);
                return Results.Ok();
            }
            catch (ArgumentNullException)
            {
                return Results.Unauthorized();
            }
            catch (InvalidOperationException)
            {
                return Results.NotFound(ApiErrorFabric.Create(ApiErrorType.NotFound, "user not found."));
            }
            catch (InvalidDataException)
            {
                return Results.BadRequest(ApiErrorFabric.Create(ApiErrorType.DeckAlreadyExists, request.Id));
            }
        }
        [HttpPut("update")]
        public IResult Put(DeckRequest request)
        {
            try
            {
                _db.Decks.Update(request);
                return Results.Ok();
            }
            catch (ArgumentNullException)
            {
                return Results.Unauthorized();
            }
            catch (InvalidOperationException)
            {
                return Results.NotFound(ApiErrorFabric.Create(ApiErrorType.NotFound, "user not found."));
            }
            catch (InvalidDataException)
            {
                return Results.BadRequest(ApiErrorFabric.Create(ApiErrorType.NotFound, "deck with this id not found."));
            }
        }
        [HttpDelete("delete")]
        public IResult Delete(string id)
        {
            try
            {
                var email = getMail();
                var decks = _db.Decks.Delete(email, id);
                return Results.Ok(decks);
            }
            catch (ArgumentNullException)
            {
                return Results.Unauthorized();
            }
            catch (NotFoundException)
            {
                return Results.BadRequest(ApiErrorFabric.Create(ApiErrorType.NotFound, new
                {
                    id,
                    message = "deck with current id not exists"
                }));
            }

        }
        private string getMail()
        {
            var authManager = new AuthenticationManager(CookieAuthenticationDefaults.AuthenticationScheme,
                HttpContext);
            return authManager.GetMail();
        }
    }
}
