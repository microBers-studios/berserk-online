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
            } catch (ArgumentNullException)
            {
                return Results.Unauthorized();
            } catch (InvalidOperationException ex)
            {
                return Results.BadRequest(ex.Message);
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
            catch (InvalidOperationException ex)
            {
                return Results.BadRequest(ex.Message);
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
