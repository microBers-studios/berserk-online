using berserk_online_server.Exceptions;
using berserk_online_server.Facades;
using berserk_online_server.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Collections;
using System.Security.Claims;

namespace berserk_online_server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly UsersDatabase db;

        public AuthenticationController(UsersDatabase databases)
        {
            db = databases;
        }
        [HttpPost("login")]
        public async Task<IResult> Login(User user)
        {
            // REFACTOR
            try
            {
                var matchingUser = db.FindMatchingUser(user);
                await authenticate(matchingUser);
                return Results.Ok(outputUser(matchingUser));
            }
            catch (ArgumentException)
            {
                return userEmailNotFound(user);
            }
            catch (UserPasswordException)
            {
                return userPasswordNotMatching(user);
            }
        }
        [HttpGet("test")]
        public IEnumerable Test()
        {
            return User.Claims.Select(claim => new { Type = claim.Type, Value = claim.Value }).ToList();
        }
        [HttpPost("register")]
        public async Task<IResult> Register(User user)
        {
            if (db.IsUnique(user))
            {
                db.AddUser(user);
                await authenticate(user);
                return Results.Ok();
            }
            else return userAlreadyExists(user);
        }
        private async Task authenticate(User user)
        {
            var claims = new[] {
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
            };
            var claimsIdentity = new ClaimsIdentity(claims,
                CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity));
        }
        private IResult userPasswordNotMatching(User user) => Results.BadRequest(ApiErrorFabric.Create(ApiErrorType.InvalidPassword, user));
        private IResult userEmailNotFound(User user) => Results.BadRequest(ApiErrorFabric.Create(ApiErrorType.InvalidEmail, user));
        private IResult userAlreadyExists(User user) => Results.BadRequest(ApiErrorFabric.Create(ApiErrorType.UserAlreadyExists, user));
        private User outputUser(User user)
        {
            return new User() { Email = user.Email, Password = "", Name = user.Name };
        }
    }
}