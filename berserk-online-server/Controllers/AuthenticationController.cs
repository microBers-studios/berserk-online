using berserk_online_server.Exceptions;
using berserk_online_server.Facades;
using berserk_online_server.Facades.MailSenders;
using berserk_online_server.Interfaces;
using berserk_online_server.Models.Db;
using berserk_online_server.Models.Requests;
using Microsoft.AspNetCore.Mvc;

namespace berserk_online_server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IUsersDatabase _db;
        private readonly ITempRequestsManager<RecoveryMailSender> _recoveryManager;
        private readonly ITempRequestsManager<ConfirmEmailSender> _confirmEmailManager;
        private readonly IAuthenticationManager _authenticationManager;

        public AuthenticationController(IUsersDatabase databases,
            ITempRequestsManager<RecoveryMailSender> recoveryManager,
            ITempRequestsManager<ConfirmEmailSender> confirmEmailManager,
            IAuthenticationManager authenticationManager)
        {
            _db = databases;
            _recoveryManager = recoveryManager;
            _confirmEmailManager = confirmEmailManager;
            _authenticationManager = authenticationManager;
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserInfo>> Login(UserAuthenticationRequest authRequest)
        {
            try
            {
                UserInfo matchingUser = _db.VerifyUser(authRequest);
                await authenticate(matchingUser, authRequest.RememberMe);
                return matchingUser;
            }
            catch (NotFoundException)
            {
                return userEmailNotFound(authRequest);
            }
            catch (UserPasswordException)
            {
                return userPasswordNotMatching(authRequest);
            }
        }
        [HttpPost("register")]
        public async Task<ActionResult<UserInfo>> Register(UserAuthenticationRequest user)
        {
            if (_db.IsUnique(new UserInfoRequest() { Email = user.Email, Name = user.Email }))
            {
                _db.AddUser(createUser(user));
                await authenticate(new UserInfo(createUser(user)), user.RememberMe);
                _confirmEmailManager.Push(user.Email);
                return Ok(new UserInfo(createUser(user)));
            }
            else return userAlreadyExists(user);
        }
        [HttpPost("requestRecover")]
        public IActionResult RequestRecover(UserInfoRequest request)
        {
            if (request.Email == null)
            {
                return BadRequest(ApiErrorFabric.Create(ApiErrorType.ArgumentsMissing, new
                {
                    Request = request,
                    Message = "'Email' required."
                }));
            }
            if (_db.IsUnique(request))
                return NotFound(ApiErrorFabric.Create(ApiErrorType.InvalidEmail, request));
            _recoveryManager.Push(request.Email);
            return Ok();
        }
        [HttpPatch("changePassword")]
        public IActionResult ChangePassword(RecoveryRequestModel request)
        {
            try
            {
                var email = _recoveryManager.GetEmail(request.Token);
                _db.UpdateUser(new User() { Password = request.Password }, email);
                _recoveryManager.Remove(request.Token);
            }
            catch (InvalidOperationException)
            {
                return BadRequest(ApiErrorFabric.Create(ApiErrorType.InvalidToken, request));
            }
            catch (NotFoundException)
            {
                return NotFound(ApiErrorFabric.Create(ApiErrorType.NotFound, new
                {
                    Request = request,
                    Message = "An incorrect email address is stored under this token."
                }));
            }

            return Ok();
        }
        [HttpPost("confirmEmail")]
        public ActionResult<UserInfo> ConfirmEmail(string token)
        {
            try
            {
                if (!_confirmEmailManager.IsValid(token))
                {
                    return BadRequest(ApiErrorFabric.Create(ApiErrorType.InvalidToken, token));
                }
                var email = _confirmEmailManager.GetEmail(token);
                var user = _db.ConfirmEmail(email);
                _confirmEmailManager.Remove(token);
                return Ok(user);
            }
            catch (InvalidOperationException)
            {
                return BadRequest(ApiErrorFabric.Create(ApiErrorType.InvalidToken, token));
            }
            catch (NotFoundException)
            {
                return NotFound(ApiErrorFabric.Create(ApiErrorType.InvalidEmail));
            }

        }
        [HttpGet("confirmationRequest")]
        public IActionResult RequestNewConfirmation()
        {
            try
            {
                var mail = _authenticationManager.GetMail();
                _confirmEmailManager.Push(mail);
                return Ok();
            }
            catch (ArgumentNullException)
            {
                return Unauthorized();
            }
        }
        [HttpGet("logout")]
        public IActionResult LogOut()
        {
            _authenticationManager.LogOut();
            return NoContent();
        }
        private async Task authenticate(UserInfo user, bool rememberMe)
        {
            ;
            await _authenticationManager.Authenticate(user, rememberMe);
        }
        private User createUser(UserAuthenticationRequest request)
        {
            return new User()
            {
                Email = request.Email,
                Id = request.Id,
                Name = request.Name,
                Password = request.Password,
            };
        }
        private ActionResult userPasswordNotMatching(UserAuthenticationRequest user) =>
            BadRequest(ApiErrorFabric.Create(ApiErrorType.InvalidPassword, user));
        private ActionResult userEmailNotFound(UserAuthenticationRequest user) =>
            BadRequest(ApiErrorFabric.Create(ApiErrorType.InvalidEmail, user));
        private ActionResult userAlreadyExists(UserAuthenticationRequest user) =>
            BadRequest(ApiErrorFabric.Create(ApiErrorType.UserAlreadyExists, user));
    }
}