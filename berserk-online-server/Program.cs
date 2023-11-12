using berserk_online_server.Contexts;
using berserk_online_server.Facades;
using berserk_online_server.Facades.CardBase;
using berserk_online_server.Facades.MailSenders;
using berserk_online_server.Interfaces;
using berserk_online_server.Interfaces.Mail;
using berserk_online_server.Interfaces.Repos;
using berserk_online_server.Middleware;
using berserk_online_server.Repository;
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
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
    {
        options.Cookie.SameSite = SameSiteMode.None;
    });
builder.Services.AddDbContext<Databases>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DatabaseConnectionString"));
});
builder.Services.AddTransient<IUrlCreator, FrontendURLCreator>();

builder.Services.AddTransient<IUsersDatabase, UsersDatabase>();

builder.Services.AddTransient<RecoveryMailSender>();
builder.Services.AddTransient<ConfirmEmailSender>();

builder.Services.AddTransient<IDeckBuilder, DeckBuilder>();

builder.Services.AddTransient<IUserRepository, UserRepository>();
builder.Services.AddTransient<IDeckRepository, DeckRepository>();

builder.Services.AddSingleton<IAvatarStorage, AvatarStorage>();
builder.Services.AddSingleton<IMailClient, MailClient>();

builder.Services.AddSingleton<TempRequestsManager<RecoveryMailSender>>();
builder.Services.AddSingleton<TempRequestsManager<ConfirmEmailSender>>();

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

app.Run();
