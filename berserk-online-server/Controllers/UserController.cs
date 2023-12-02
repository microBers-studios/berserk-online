using berserk_online_server.DTO;
using berserk_online_server.DTO.Models;
using berserk_online_server.DTO.Requests;
using berserk_online_server.Exceptions;
using berserk_online_server.Interfaces;
using berserk_online_server.Utils;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace berserk_online_server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUsersDatabase _db;
        private readonly IAvatarStorage _contentService;
        private readonly IAuthenticationManager _authenticationManager;
        public UserController(IUsersDatabase db,
            IAvatarStorage contentService, IAuthenticationManager manager)
        {
            _db = db;
            _contentService = contentService;
            _authenticationManager = manager;
        }
        [HttpPost("findUser")]
        public ActionResult<UserInfo> GetUserInfo(UserInfoRequest requestInfo)
        {
            if (requestInfo.isEmpty)
            {
                return BadRequest(ApiErrorFabric.Create(ApiErrorType.ArgumentsMissing, requestInfo));
            }
            try
            {
                var user = _db.GetUser(requestInfo);
                return Ok(new UserInfo(user));
            }
            catch (NotFoundException)
            {
                return NotFound(ApiErrorFabric.Create(ApiErrorType.NotFound, requestInfo));
            }
        }
        [HttpGet("getUser/{id}")]
        public ActionResult<UserInfo> GetUser(int id)
        {
            try
            {
                var user = _db.GetUser(new UserInfoRequest { Id = id });
                return Ok(new UserInfo(user));
            }
            catch (NotFoundException)
            {
                return NotFound(ApiErrorFabric.Create(ApiErrorType.NotFound, new { Id = id }));
            }
        }
        [HttpGet("getMe")]
        public ActionResult<UserInfo> GetMe()
        {
            try
            {
                string email = User.Claims.Where(claim => claim.Type == ClaimTypes.Email).First().Value;
                string name = User.Claims.Where(claim => claim.Type == ClaimTypes.Name).First().Value;

                var user = _db.GetUser(new UserInfoRequest() { Name = name, Email = email });
                return Ok(new UserInfo(user));
            }
            catch (InvalidOperationException)
            {
                return Unauthorized();
            }
        }
        [HttpPost("loadAvatar")]
        public async Task<ActionResult<UserInfo>> LoadAvatar([FromForm] IFormFile avatar)
        {
            try
            {
                string email = _authenticationManager.GetMail();
                string fileName = await _contentService.AddAvatar(avatar, email);
                if (!fileName.Contains('.'))
                {
                    return BadRequest(ApiErrorFabric.Create(ApiErrorType.InvalidFileName, avatar.Name));
                }
                var updatedUser = _db.UpdateUser(new User() { AvatarUrl = fileName }, email);
                return Ok(updatedUser);
            }
            catch (NotFoundException)
            {
                return NotFound(ApiErrorFabric.Create(ApiErrorType.NotFound));
            }
            catch (ArgumentNullException)
            {
                return Unauthorized();
            }
        }
        [HttpDelete("deleteAvatar")]
        public ActionResult<UserInfo> DeleteAvatar()
        {
            try
            {
                string email = _authenticationManager.GetMail();
                try
                {
                    _contentService.DeleteAvatar(email);
                }
                catch (InvalidOperationException)
                {
                    _db.RemoveAvatar(email);
                    throw;
                }
                var updatedUser = _db.RemoveAvatar(email);
                return Ok(updatedUser);
            }
            catch (ArgumentNullException)
            {
                return Unauthorized();
            }
            catch (NotFoundException)
            {
                return NotFound(ApiErrorFabric.Create(ApiErrorType.InvalidEmail));
            }
            catch (InvalidOperationException)
            {
                return NotFound(ApiErrorFabric.Create(ApiErrorType.NotFound,
                    "Avatar not found."));
            }
        }
        [HttpPatch("updateMe")]
        public async Task<ActionResult<UserInfo>> updateMe(UserInfoRequest request)
        {
            if (!_db.IsUnique(request))
            {
                return BadRequest(ApiErrorFabric.Create(ApiErrorType.UserAlreadyExists, request));
            }
            try
            {
                string oldMail = _authenticationManager.GetMail();
                var updatedUser = await _db.UpdateUser(request, oldMail);
                await updateCookie(updatedUser);
                return Ok(updatedUser);
            }
            catch (NotFoundException)
            {
                string email = _authenticationManager.GetMail();
                return NotFound(ApiErrorFabric.Create(ApiErrorType.NotFound,
                    new { Request = request, Mail = email }));
            }
            catch (ArgumentNullException)
            {
                return Unauthorized();
            }
        }
        private async Task updateCookie(UserInfo userInfo)
        {
            await _authenticationManager.Authenticate(userInfo, true);
        }
    }
}
