using berserk_online_server.Exceptions;
using berserk_online_server.Facades;
using berserk_online_server.Models.User;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Collections;

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
        public async Task<IResult> Login(UserAuthenticationRequest authRequest)
        {
            // REFACTOR
            try
            {
                UserInfo matchingUser = db.VerifyUser(authRequest);
                await authenticate(matchingUser, authRequest.RememberMe);
                return Results.Ok(matchingUser);
            }
            catch (ArgumentException)
            {
                return userEmailNotFound(authRequest);
            }
            catch (UserPasswordException)
            {
                return userPasswordNotMatching(authRequest);
            }
        }
        [HttpGet("test")]
        public IEnumerable Test()
        {
            return User.Claims.Select(claim => new { Type = claim.Type, Value = claim.Value }).ToList();
        }
        [HttpPost("register")]
        public async Task<IResult> Register(UserAuthenticationRequest user)
        {
            if (db.IsUnique(new UserInfoRequest() { Email = user.Email, Name = user.Email }))
            {
                db.AddUser(user);
                await authenticate(new UserInfo(user), user.RememberMe);
                return Results.Ok();
            }
            else return userAlreadyExists(user);
        }
        private async Task authenticate(UserInfo user, bool rememberMe)
        {
            var manager = new AuthenticationManager(CookieAuthenticationDefaults.AuthenticationScheme);
            await manager.Authenticate(user, rememberMe, HttpContext);
        }
        private IResult userPasswordNotMatching(User user) => Results.BadRequest(ApiErrorFabric.Create(ApiErrorType.InvalidPassword, user));
        private IResult userEmailNotFound(User user) => Results.BadRequest(ApiErrorFabric.Create(ApiErrorType.InvalidEmail, user));
        private IResult userAlreadyExists(User user)
        {
            return Results.BadRequest(ApiErrorFabric.Create(ApiErrorType.UserAlreadyExists, user));
        }
    }
}