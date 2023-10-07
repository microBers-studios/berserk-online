using berserk_online_server.Facades;
using berserk_online_server.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Collections;
using System.ComponentModel;
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
            var userStatus = db.IsExists(user);
            if (userStatus == ExistanceStatus.Exists) 
            {
                await Authenticate(user);
                return Results.Ok();
            }
            return Results.BadRequest(createStringFromStatus(userStatus));

        }
        [HttpGet("test")]
        public IEnumerable Test()
        {
            return User.Claims.Select(claim => new { Type = claim.Type, Value = claim.Value }).ToList();
        }
        private async Task Authenticate(User user)
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
        [HttpPost("register")]
        public async Task<IResult> Register(User user)
        {
            if (db.IsUnique(user))
            {
                db.AddUser(user);
                await Authenticate(user);
                return Results.Ok();
            }
            else return Results.BadRequest("This user already exist");
        }
        private string createStringFromStatus(ExistanceStatus status)
        {
            switch (status)
            {
                case ExistanceStatus.InvalidPassword:
                    return "Password not matching with user password stored in DB.";
                case ExistanceStatus.NotExists:
                    return "User with this email not exists.";
            }
            throw new InvalidEnumArgumentException(nameof(status) + "not matching with implemented");
        }
    }
}