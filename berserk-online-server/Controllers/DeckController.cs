using berserk_online_server.Exceptions;
using berserk_online_server.Facades;
using berserk_online_server.Models.Requests;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
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
            catch (InvalidOperationException)
            {
                return Results.NotFound(ApiErrorFabric.Create(ApiErrorType.NotFound, "user not found."));
            }


        }
        [HttpPost("Add")]
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
        }
        [HttpPut("Update")]
        public IResult Put(DeckRequest request)
        {
            try
            {
                var email = getMail();
                _db.Decks.Update(email, request);
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
        }
        [HttpDelete("Delete")]
        public IResult Delete(string id)
        {
            try
            {
                var email = getMail();
                _db.Decks.Delete(email, id);
                return Results.Ok();
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
