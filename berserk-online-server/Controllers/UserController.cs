using berserk_online_server.Exceptions;
using berserk_online_server.Facades;
using berserk_online_server.Models.User;
using Microsoft.AspNetCore.Authorization;
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
        [HttpGet("getUser/{name}")]
        public IResult GetUser(string name)
        {
            try
            {
                return Results.Ok(_db.GetUserInfo(new UserInfoRequest { Name = name }));
            }
            catch (NotFoundException)
            {
                return Results.NotFound(ApiErrorFabric.Create(ApiErrorType.NotFound, new { Name = name }));
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
                return Results.BadRequest(ApiErrorFabric.Create(ApiErrorType.NotAuthorized));
            }
        }
        [HttpPost("loadAvatar")]
        [Authorize]
        public async Task<IResult> LoadAvatar(IFormFile avatar)
        {
            string email = getRequesterMail();
            string fileName = await _contentService.AddAvatar(avatar, email);
            try
            {
                _db.AddAvatarPath(fileName, email);
                return Results.Ok();
            }
            catch (NotFoundException)
            {
                return Results.NotFound(ApiErrorFabric.Create(ApiErrorType.NotAuthorized));
            }
        }
        private string getRequesterMail()
        {
            var nameClaim = User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Email);
            if (nameClaim == null) throw new NotFoundException("Name claim not found");
            return nameClaim.Value;
        }
    }
}
