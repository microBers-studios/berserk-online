using berserk_online_server.Exceptions;
using berserk_online_server.Facades;
using berserk_online_server.Models.User;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace berserk_online_server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UsersDatabase _db;
        private readonly StaticContentService _contentService;
        public UserController(UsersDatabase db, IWebHostEnvironment environment, StaticContentService contentService)
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
                return Results.Ok(_db.GetUserInfo(requestInfo));
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
                return Results.Ok(_db.GetUserInfo(new UserInfoRequest { Id = id }));
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

                return Results.Ok(_db.GetUserInfo(new UserInfoRequest() { Name = name, Email = email }));
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
                string email = getRequesterMail();
                string fileName = await _contentService.AddAvatar(avatar, email);
                if (!fileName.Contains('.'))
                {
                    return Results.BadRequest(ApiErrorFabric.Create(ApiErrorType.InvalidFileName, avatar.Name));
                }
                var updatedUser = _db.AddAvatarPath(fileName, email);
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
        [HttpPost("updateMe")]
        public async Task<IResult> updateMe(UserInfoRequest request)
        {
            if (!_db.IsUnique(new User() { Name = request.Name, Email = request.Email }))
            {
                return Results.BadRequest(ApiErrorFabric.Create(ApiErrorType.UserAlreadyExists, request));
            }
            try
            {
                var oldMail = getRequesterMail();
                var updatedUser = await _db.UpdateUser(request, oldMail);
                await updateCookie(updatedUser);
                return Results.Ok(updatedUser);
            }
            catch (NotFoundException)
            {
                return Results.NotFound(ApiErrorFabric.Create(ApiErrorType.NotFound, request));
            }
            catch (ArgumentNullException)
            {
                return Results.Unauthorized();
            }
        }
        private string getRequesterMail()
        {
            var emailClaim = User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Email);
            if (emailClaim == null) throw new ArgumentNullException("claim is null");
            return emailClaim.Value;
        }
        private async Task updateCookie(UserInfo userInfo)
        {
            var manager = new AuthenticationManager(CookieAuthenticationDefaults.AuthenticationScheme);
            await manager.Authenticate(userInfo, true, HttpContext);
        }
    }
}
