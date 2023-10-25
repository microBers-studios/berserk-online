using berserk_online_server.Constants;
using berserk_online_server.Exceptions;
using berserk_online_server.Facades;
using berserk_online_server.Facades.MailSenders;
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
        private readonly UsersDatabase _db;
        private readonly TempRequestsManager<RecoveryMailSender> _recoveryManager;
        private readonly TempRequestsManager<ConfirmEmailSender> _confirmEmailManager;

        public AuthenticationController(UsersDatabase databases, 
            TempRequestsManager<RecoveryMailSender> recoveryManager,
            TempRequestsManager<ConfirmEmailSender> confirmEmailManager)
        {
            _db = databases;
            _recoveryManager = recoveryManager;
            _confirmEmailManager = confirmEmailManager;
        }
        [HttpPost("login")]
        public async Task<IResult> Login(UserAuthenticationRequest authRequest)
        {
            try
            {
                UserInfo matchingUser = _db.VerifyUser(authRequest);
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
            if (_db.IsUnique(new UserInfoRequest() { Email = user.Email, Name = user.Email }))
            {
                _db.AddUser(user);
                await authenticate(new UserInfo(user), user.RememberMe);
                _confirmEmailManager.Push(user.Email);
                return Results.Ok(new UserInfo(user));
            }
            else return userAlreadyExists(user);
        }
        [HttpPost("requestRecover")]
        public IResult RequestRecover(UserInfoRequest request)
        {
            if (request.Email == null)
            {
                return Results.BadRequest(ApiErrorFabric.Create(ApiErrorType.ArgumentsMissing, new
                {
                    Request = request,
                    Message = "'Email' required."
                }));
            }
            if (_db.IsUnique(request))
                return Results.NotFound(ApiErrorFabric.Create(ApiErrorType.InvalidEmail, request));
            _recoveryManager.Push(request.Email);
            return Results.Ok();
        }
        [HttpPatch("changePassword")]
        public IResult ChangePassword(RecoveryRequestModel request)
        {
            try
            {
                var email = _recoveryManager.GetEmail(request.Token);
                _db.UpdateUser(new User() { Password = request.Password}, email);
                _recoveryManager.Remove(request.Token);
            }
            catch (InvalidOperationException)
            {
                return Results.BadRequest(ApiErrorFabric.Create(ApiErrorType.InvalidToken, request));
            }
            catch (NotFoundException)
            {
                return Results.NotFound(ApiErrorFabric.Create(ApiErrorType.NotFound, new
                {
                    Request = request,
                    Message = "An incorrect email address is stored under this token."
                }));
            }

            return Results.Ok();
        }
        [HttpPost("confirmEmail")]
        public IResult ConfirmEmail(string token)
        {
            try
            {
                if (!_confirmEmailManager.IsValid(token))
                {
                    return Results.BadRequest(ApiErrorFabric.Create(ApiErrorType.InvalidToken, token));
                }
                var email = _confirmEmailManager.GetEmail(token);
                var user = _db.ConfirmEmail(email);
                _confirmEmailManager.Remove(token);
                return Results.Ok(user);
            } catch (InvalidOperationException)
            {
                return Results.BadRequest(ApiErrorFabric.Create(ApiErrorType.InvalidToken, token));
            } catch (NotFoundException)
            {
                return Results.NotFound(ApiErrorFabric.Create(ApiErrorType.InvalidEmail));
            }
            
        }
        [HttpGet("confirmationRequest")]
        public IResult requestNewConfirmation()
        {
            try
            {
                var authManager = new AuthenticationManager(CookieAuthenticationDefaults.AuthenticationScheme,
                    HttpContext);
                var mail = authManager.GetMail();
                _confirmEmailManager.Push(mail);
                return Results.Ok();
            } catch (ArgumentNullException)
            {
                return Results.Unauthorized();
            }
        }
        [HttpGet("logout")]
        public IResult LogOut()
        {
            new Facades.AuthenticationManager(CookieAuthenticationDefaults.AuthenticationScheme, HttpContext).LogOut();
            return Results.NoContent();
        }
        private async Task authenticate(UserInfo user, bool rememberMe)
        {
            var manager = new Facades.AuthenticationManager(CookieAuthenticationDefaults.AuthenticationScheme, HttpContext);
            await manager.Authenticate(user, rememberMe);
        }
        private IResult userPasswordNotMatching(User user) => Results.BadRequest(ApiErrorFabric.Create(ApiErrorType.InvalidPassword, user));
        private IResult userEmailNotFound(User user) => Results.BadRequest(ApiErrorFabric.Create(ApiErrorType.InvalidEmail, user));
        private IResult userAlreadyExists(User user)
        {
            return Results.BadRequest(ApiErrorFabric.Create(ApiErrorType.UserAlreadyExists, user));
        }
    }
}