using berserk_online_server.Contexts;
using berserk_online_server.Controllers.Hubs;
using berserk_online_server.Data_objects.Rooms;
using berserk_online_server.DTO.Models;
using berserk_online_server.Facades;
using berserk_online_server.Facades.CardBase;
using berserk_online_server.Facades.Database;
using berserk_online_server.Facades.MailSenders;
using berserk_online_server.Facades.Rooms;
using berserk_online_server.Interfaces;
using berserk_online_server.Interfaces.Mail;
using berserk_online_server.Interfaces.Repos;
using berserk_online_server.Interfaces.Rooms;
using berserk_online_server.Middleware;
using berserk_online_server.Repository;
using berserk_online_server.Utils;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;

var staticContentPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
if (!Directory.Exists(staticContentPath))
{
    Directory.CreateDirectory(staticContentPath);
}

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
    {
        options.Cookie.SameSite = SameSiteMode.None;
    });
builder.Services.AddDbContext<DatabaseContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DatabaseConnectionString"));
});

builder.Services.AddMemoryCache();
builder.Services.AddHttpContextAccessor();

builder.Services.AddTransient<ICache<string, User>, Cache<string, User>>();
builder.Services.AddTransient<ICache<int, DeckDb[]>, Cache<int, DeckDb[]>>();
builder.Services.AddTransient<IUrlCreator, FrontendURLCreator>();
builder.Services.AddTransient<IAuthenticationManager, AuthenticationManager>();

builder.Services.AddTransient<IUsersDatabase, UsersDatabase>();
builder.Services.AddTransient<IDeckDatabase, DeckDatabase>();

builder.Services.AddTransient<RecoveryMailSender>();
builder.Services.AddTransient<ConfirmEmailSender>();

builder.Services.AddTransient<IDeckBuilder, DeckBuilder>();

builder.Services.AddTransient<IUserRepository, UserRepository>();
builder.Services.AddTransient<IDeckRepository, DeckRepository>();

builder.Services.AddSingleton<IAvatarStorage, AvatarStorage>();
builder.Services.AddSingleton<IMailClient, MailClient>();

builder.Services.AddSingleton<ITempRequestsManager<RecoveryMailSender>, TempRequestsManager<RecoveryMailSender>>();
builder.Services.AddSingleton<ITempRequestsManager<ConfirmEmailSender>, TempRequestsManager<ConfirmEmailSender>>();

builder.Services.AddSingleton<IRoomsManager, RoomsManager>();
builder.Services.AddSingleton<IUserLocationManager, UserLocationManager>();
builder.Services.AddSingleton<IConnectionGroupsManager, ConnectionGroupsManager>();
builder.Services.AddTransient<IGroupDispatcher<RoomEvent>, RoomUpdateDispatcher>();
builder.Services.AddTransient<IDispatcher<RoomListEvent>, RoomListDispatcher>();

builder.Services.AddSingleton<CardProvider>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
#pragma warning disable CS8604 // ¬озможно, аргумент-ссылка, допускающий значение NULL.
        policy.AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithOrigins(builder.Configuration.GetValue<string>("FrontendPath"))
            .WithExposedHeaders("Set-Cookie");
#pragma warning restore CS8604 // ¬озможно, аргумент-ссылка, допускающий значение NULL.
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseCors();
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<CookieUpdateMiddleware>();
app.UseMiddleware<ConfirmEmailMiddleware>();

app.MapControllers();
app.MapHub<RoomsListHub>("/connect");
app.MapHub<RoomHub>("/connect/{roomId}");

app.Run();
