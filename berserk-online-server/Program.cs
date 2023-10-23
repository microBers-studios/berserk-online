using berserk_online_server.Contexts;
using berserk_online_server.Facades;
using berserk_online_server.Middleware;
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
builder.Services.AddTransient<FrontendURLCreator>();
builder.Services.AddTransient<UsersDatabase>();
builder.Services.AddSingleton<StaticContentService>();
builder.Services.AddSingleton<MailSender>();
builder.Services.AddSingleton<RecoveryManager>();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithOrigins(builder.Configuration.GetValue<string>("FrontendPath"))
            .WithExposedHeaders("Set-Cookie");
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

app.MapControllers();

app.Run();
