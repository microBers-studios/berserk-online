using berserk_online_server.Exceptions;
using berserk_online_server.Facades;
using berserk_online_server.Interfaces;
using berserk_online_server.Models.Db;
using berserk_online_server.Models.Requests;
using Microsoft.AspNetCore.Authentication.Cookies;
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
        public UserController(IUsersDatabase db, IWebHostEnvironment environment,
            IAvatarStorage contentService)
        {
            _db = db;
            _contentService = contentService;
        }
        [HttpPost("findUser")]
        public IResult GetUserInfo(UserInfoRequest requestInfo)
        {
            if (requestInfo.isEmpty)
            {
                return Results.BadRequest(ApiErrorFabric.Create(ApiErrorType.ArgumentsMissing, requestInfo));
            }
            try
            {
                var user = _db.GetUser(requestInfo);
                return Results.Ok(new UserInfo(user));
            }
            catch (NotFoundException)
            {
                return Results.NotFound(ApiErrorFabric.Create(ApiErrorType.NotFound, requestInfo));
            }
        }
        [HttpGet("getUser/{id}")]
        public IResult GetUser(int id)
        {
            try
            {
                var user = _db.GetUser(new UserInfoRequest { Id = id });
                return Results.Ok(new UserInfo(user));
            }
            catch (NotFoundException)
            {
                return Results.NotFound(ApiErrorFabric.Create(ApiErrorType.NotFound, new { Id = id }));
            }
        }
        [HttpGet("getMe")]
        public IResult GetMe()
        {
            try
            {
                string email = User.Claims.Where(claim => claim.Type == ClaimTypes.Email).First().Value;
                string name = User.Claims.Where(claim => claim.Type == ClaimTypes.Name).First().Value;

                var user = _db.GetUser(new UserInfoRequest() { Name = name, Email = email });
                return Results.Ok(new UserInfo(user));
            }
            catch (InvalidOperationException)
            {
                return Results.Unauthorized();
            }
        }
        [HttpPost("loadAvatar")]
        public async Task<IResult> LoadAvatar([FromForm] IFormFile avatar)
        {
            try
            {
                var authManager = new AuthenticationManager(CookieAuthenticationDefaults.AuthenticationScheme,
                    HttpContext);
                string email = authManager.GetMail();
                string fileName = await _contentService.AddAvatar(avatar, email);
                if (!fileName.Contains('.'))
                {
                    return Results.BadRequest(ApiErrorFabric.Create(ApiErrorType.InvalidFileName, avatar.Name));
                }
                var updatedUser = _db.UpdateUser(new User() { AvatarUrl = fileName }, email);
                return Results.Ok(updatedUser);
            }
            catch (NotFoundException)
            {
                return Results.NotFound(ApiErrorFabric.Create(ApiErrorType.NotFound));
            }
            catch (ArgumentNullException)
            {
                return Results.Unauthorized();
            }
        }
        [HttpDelete("deleteAvatar")]
        public IResult DeleteAvatar()
        {
            try
            {
                var authManager = new AuthenticationManager(CookieAuthenticationDefaults.AuthenticationScheme,
                    HttpContext);
                string email = authManager.GetMail();
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
                return Results.Ok(updatedUser);
            }
            catch (ArgumentNullException)
            {
                return Results.Unauthorized();
            }
            catch (NotFoundException)
            {
                return Results.NotFound(ApiErrorFabric.Create(ApiErrorType.InvalidEmail));
            }
            catch (InvalidOperationException)
            {
                return Results.NotFound(ApiErrorFabric.Create(ApiErrorType.NotFound,
                    "Avatar not found."));
            }
        }
        [HttpPatch("updateMe")]
        public async Task<IResult> updateMe(UserInfoRequest request)
        {
            if (!_db.IsUnique(request))
            {
                return Results.BadRequest(ApiErrorFabric.Create(ApiErrorType.UserAlreadyExists, request));
            }
            try
            {
                var authManager = new AuthenticationManager(CookieAuthenticationDefaults.AuthenticationScheme,
                    HttpContext);
                string oldMail = authManager.GetMail();
                var updatedUser = await _db.UpdateUser(request, oldMail);
                await updateCookie(updatedUser);
                return Results.Ok(updatedUser);
            }
            catch (NotFoundException)
            {
                var authManager = new AuthenticationManager(CookieAuthenticationDefaults.AuthenticationScheme,
                    HttpContext);
                string email = authManager.GetMail();
                return Results.NotFound(ApiErrorFabric.Create(ApiErrorType.NotFound,
                    new { Request = request, Mail = email }));
            }
            catch (ArgumentNullException)
            {
                return Results.Unauthorized();
            }
        }
        private async Task updateCookie(UserInfo userInfo)
        {
            var manager = new AuthenticationManager(CookieAuthenticationDefaults.AuthenticationScheme,
                HttpContext);
            await manager.Authenticate(userInfo, true);
        }
    }
}
