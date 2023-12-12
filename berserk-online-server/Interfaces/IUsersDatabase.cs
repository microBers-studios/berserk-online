using berserk_online_server.DTO;
using berserk_online_server.DTO.Models;
using berserk_online_server.DTO.Requests;

namespace berserk_online_server.Interfaces
{
    public interface IUsersDatabase
    {
        IDeckDatabase Decks { get; }
        void AddUser(User user);
        void RemoveUser(string email);
        UserInfo UpdateUser(UserInfoRequest request, string oldMail);
        UserInfo UpdateUser(User newUser, string oldmail);
        UserInfo ConfirmEmail(string email);
        UserInfo RemoveAvatar(string email);
        bool IsUnique(UserInfoRequest user);
        User GetUser(UserInfoRequest userRequest);
        UserInfo VerifyUser(UserAuthenticationRequest user);

    }
}
