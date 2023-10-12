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
        private readonly string _avatarImagesPath;
        public UserController(UsersDatabase db, IWebHostEnvironment environment) {
            _db = db;
            _avatarImagesPath = environment.WebRootPath + "/Avatars/";
        }
        [HttpPost("findUser")]
        public IResult GetUserInfo(UserInfoRequest requestInfo)
        {
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
            } catch (NotFoundException)
            {
                return Results.NotFound(ApiErrorFabric.Create(ApiErrorType.NotFound, new {Name = name}));
            }
        }
        [Authorize]
        [HttpGet("getMe")]
        public IResult GetMe()
        {
            try
            {
                string email = User.Claims.Where(claim => claim.Type == ClaimTypes.Email).First().Value;
                string name = User.Claims.Where(claim => claim.Type == ClaimTypes.Name).First().Value;

                return Results.Ok(_db.GetUserInfo(new UserInfoRequest() { Name = name, Email = email}));
            } catch (InvalidOperationException)
            {
                //TO-DO Тип ошибки
                return Results.BadRequest();
            }   
        }
        [HttpPost("loadAvatar")]
        [Authorize]
        public async Task<IResult> LoadAvatar(IFormFile avatar)
        {
            string email = getRequesterMail();
            string path = _avatarImagesPath + email;
            using (var fs = new FileStream(path, FileMode.CreateNew))
            {
                await avatar.CopyToAsync(fs);
            }
            try
            {
                _db.addAvatar(email, path);
                return Results.Ok();
            } catch (NotFoundException)
            { //TODO
                return Results.NotFound();
            }
            
        }
        private string getRequesterMail()
        {
            var nameClaim = User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Name);
            if (nameClaim == null) throw new NotFoundException("Name claim not found");
            return nameClaim.Value;
        }
    }
}
